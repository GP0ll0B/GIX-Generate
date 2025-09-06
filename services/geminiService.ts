import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

class GeminiApiError extends Error {
  constructor(message: string, public context: string, public cause?: unknown) {
    super(message);
    this.name = "GeminiApiError";
    Object.setPrototypeOf(this, GeminiApiError.prototype);
  }
}

// --- Helpers ---
const isTransientError = (err: any): boolean => {
  if (!err) return false;

  let errorObject: any;

  // Step 1: Find the core error object from various possible structures.
  if (err instanceof Error) {
    try {
      errorObject = JSON.parse(err.message);
    } catch { /* Message is not JSON, fallback below */ }
  } else if (typeof err === 'object' && err !== null) {
    errorObject = err;
  } else if (typeof err === 'string') {
    try {
      errorObject = JSON.parse(err);
    } catch { /* String is not JSON, fallback below */ }
  }

  // Step 2: Check for a transient error code in the object.
  if (errorObject?.error?.code) {
    const code = errorObject.error.code;
    if (code === 429 || code === 503) {
      return true;
    }
  }
  
  // Step 3: Fallback to searching the string representation of the entire error.
  const errorMessage = String(err).toLowerCase();
  return /rate limit|resource has been exhausted|429|503|service is currently unavailable|timeout/.test(errorMessage);
};


async function withRetries<T>(fn: () => Promise<T>, attempts = 5, baseDelayMs = 1000): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1 || !isTransientError(err)) break;
      const delay = baseDelayMs * Math.pow(2, i) * (0.8 + Math.random() * 0.4); // Add jitter
      console.log(`[Gemini][Retry] Transient error detected. Retrying in ${delay.toFixed(0)}ms... (Attempt ${i + 1}/${attempts})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastErr;
}

function handleApiError(error: unknown, context: string): never {
  console.error(`[Gemini][${context}]`, error);

  if (error instanceof GeminiApiError) {
    throw error;
  }
  
  if (isTransientError(error)) {
    throw new GeminiApiError("The API is busy or you've exceeded your quota. Please wait a moment and try again.", context, error);
  }

  let message = "An unknown error occurred.";
  let errorObject: any;

  // Attempt to parse a structured error message
  if (error instanceof Error) {
    try { 
        errorObject = JSON.parse(error.message); 
    } catch { 
        message = error.message; 
    }
  } else if (typeof error === 'object' && error !== null) {
    errorObject = error;
  } else if (error) {
    message = String(error);
  }

  if (errorObject?.error?.message) {
    message = errorObject.error.message;
  } else if (errorObject?.message) {
    message = errorObject.message;
  }
  
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("api key not valid")) {
    throw new GeminiApiError("The provided API Key is not valid. Please check your configuration.", context, error);
  }
  if (lowerMessage.includes("permission denied")) {
    throw new GeminiApiError("The API key lacks permissions for this model or resource. Please check your Google Cloud project settings.", context, error);
  }
  if (lowerMessage.includes("billing")) {
      throw new GeminiApiError("There is a billing issue with your Google Cloud project. Please check your billing account status.", context, error);
  }
  if (lowerMessage.includes("invalid argument") || lowerMessage.includes("bad request")) {
      throw new GeminiApiError(`The request was invalid. The prompt may be malformed or a parameter is incorrect. Details: ${message}`, context, error);
  }
  if (lowerMessage.includes("safety")) {
    throw new GeminiApiError("The request was blocked due to safety filters. Please adjust your prompt and try again.", context, error);
  }
  
  throw new GeminiApiError(`An unexpected API error occurred: ${message}`, context, error);
}

function assertGeminiResponse(response: any, context: string) {
  if (!response) {
      throw new GeminiApiError("No response returned from Gemini.", context, response);
  }
  const safetyRatings = response.candidates?.[0]?.safetyRatings;
  if (safetyRatings && safetyRatings.some((r: any) => r.blocked)) {
    throw new GeminiApiError("Request blocked by safety filters.", context, response);
  }
}

// --- Public API ---

export async function generateContent(
  params: GenerateContentParameters
): Promise<GenerateContentResponse> {
  try {
    return await withRetries(async () => {
      const response = await ai.models.generateContent(params);
      assertGeminiResponse(response, "generateContent");
      return response;
    });
  } catch (err) {
    handleApiError(err, "generateContent");
  }
}

export async function generateContentStream(
  params: GenerateContentParameters
): Promise<AsyncGenerator<GenerateContentResponse, void, unknown>> {
  try {
    return await withRetries(async () => {
      const stream = await ai.models.generateContentStream(params);
      if (!stream) throw new GeminiApiError("Failed to initialize content stream.", "generateContentStream");
      return stream as any;
    });
  } catch (err) {
    handleApiError(err, "generateContentStream");
  }
}

// --- Image Generation ---
export async function generateImage(prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' = '1:1'): Promise<string> {
    try {
        const response = await withRetries(async () => {
            return await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: aspectRatio
                }
            });
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new GeminiApiError("No image was generated.", "generateImage");
        }
    } catch(err) {
        handleApiError(err, "generateImage");
    }
}

// --- Video Generation ---
export async function generateVideos(prompt: string, image: { data: string; type: string; } | null) {
  try {
    let imageBytes, mimeType;
    if (image) {
      const parts = image.data.split(',');
      if (parts.length === 2) {
        const base64Data = parts[1].replace(/(\r\n|\n|\r)/gm, "");
        imageBytes = base64Data;
        mimeType = image.type;
      }
    }

    const request: any = {
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: { numberOfVideos: 1 }
    };

    if (imageBytes && mimeType) {
      request.image = { imageBytes, mimeType };
    }

    return await withRetries(() => ai.models.generateVideos(request));
  } catch (err) {
    handleApiError(err, "generateVideos");
  }
}

export async function getVideosOperation(operation: any) {
  try {
    return await withRetries(() => ai.operations.getVideosOperation({ operation }));
  } catch (err) {
    handleApiError(err, "getVideosOperation");
  }
}
