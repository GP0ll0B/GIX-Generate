import { GoogleGenAI } from "@google/genai";

// The API key is sourced from the environment variable `process.env.API_KEY`.
// This is a hard requirement, and the app assumes this variable is pre-configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define a custom error class for Gemini API errors
class GeminiApiError extends Error {
    constructor(message: string, public context: string) {
        super(message);
        this.name = 'GeminiApiError';
        // Set the prototype explicitly to support inheritance
        Object.setPrototypeOf(this, GeminiApiError.prototype);
    }
}

// Centralized error handler for API-level issues
const handleApiError = (error: unknown, context: string) => {
    console.error(`Error in ${context} from Gemini:`, error);
    if (error instanceof GeminiApiError) {
        throw error;
    }
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new GeminiApiError('The provided API Key is not valid. Please check your configuration.', context);
        }
        if (error.message.startsWith('Failed to generate') || error.message.startsWith('The AI returned an invalid')) {
            throw new GeminiApiError(`Content generation failed: ${error.message}`, context);
        }
        if (error.message.includes('SAFETY')) { // Generic safety check
             throw new GeminiApiError(`Request failed due to safety filters.`, context);
        }
        throw new GeminiApiError(`An unexpected API error occurred: ${error.message}`, context);
    }
    throw new GeminiApiError("An unknown error occurred while communicating with the API.", context);
};

// Handle errors specific to the Gemini response, such as empty results
const handleGeminiResponseError = (response: any, context: string) => {
    if (!response) {
        throw new GeminiApiError("Content generation failed, no response was returned.", context);
    }
    // Check for safety ratings if they exist on the response structure
    if (response.safetyRatings && response.safetyRatings.some((r: any) => r.blocked)) {
        throw new GeminiApiError(`Failed to generate content due to safety filters.`, context);
    }
    if (context === 'generateImage' && (!response.generatedImages || response.generatedImages.length === 0)) {
        throw new GeminiApiError("Image generation failed, no images were returned. This could be due to safety filters or a temporary issue.", context);
    }
};


export async function generateContent(
    model: string, 
    contents: string, 
    config: {
        systemInstruction: string;
        tools?: any[];
        responseMimeType?: string;
        responseSchema?: any;
        temperature?: number;
    }
) {
    try {
        const response = await ai.models.generateContent({ model, contents, config });
        handleGeminiResponseError(response, "generateContent");
        return response;
    } catch (error) {
        handleApiError(error, "generateContent");
        // The line below is for type safety, as handleApiError always throws.
        throw new Error("Content generation failed.");
    }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });
        
        handleGeminiResponseError(response, "generateImage");

        // The check inside handleGeminiResponseError should catch this, but for type safety and clarity:
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            // This path should ideally not be reached if the handler works correctly.
            throw new GeminiApiError("Image generation failed, no images were returned.", "generateImage");
        }
    } catch (error) {
        handleApiError(error, "generateImage");
        // This is for type safety, as handleApiError always throws
        throw new Error("Image generation failed.");
    }
}

export async function generateVideos(prompt: string, image: { data: string; type: string; } | null): Promise<any> {
    try {
        const payload: {
            model: string;
            prompt: string;
            config: { numberOfVideos: number };
            image?: { imageBytes: string; mimeType: string };
        } = {
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
            },
        };

        if (image) {
            const base64Data = image.data.split(',')[1];
            if (base64Data) {
                payload.image = {
                    imageBytes: base64Data,
                    mimeType: image.type,
                };
            }
        }

        const operation = await ai.models.generateVideos(payload);
        return operation;
    } catch (error) {
        handleApiError(error, "generateVideos");
        throw new Error("Video generation initiation failed.");
    }
}

export async function getVideosOperation(operation: any): Promise<any> {
    try {
        const updatedOperation = await ai.operations.getVideosOperation({ operation });
        if (updatedOperation.done && updatedOperation.error) {
            const errorMessage = updatedOperation.error.message || 'Unknown video operation error';
            throw new GeminiApiError(`Video operation failed with an error: ${errorMessage}`, "getVideosOperation");
        }
        return updatedOperation;
    } catch (error) {
        handleApiError(error, "getVideosOperation");
        throw new Error("Failed to poll video operation status.");
    }
}