import { GoogleGenAI } from "@google/genai";

// The API key is sourced from the environment variable `process.env.API_KEY`.
// This is a hard requirement, and the app assumes this variable is pre-configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleApiError = (error: unknown, context: string) => {
    console.error(`Error in ${context} from Gemini:`, error);
    if (error instanceof Error) {
        if (error.message.startsWith('Failed to generate') || error.message.startsWith('The AI returned an invalid')) {
            throw error;
        }
        if (error.message.includes('API key not valid')) {
            throw new Error('The provided API Key is not valid. Please check your configuration.');
        }
        throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating content.");
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
        return ai.models.generateContent({ model, contents, config });
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
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("Image generation failed, no images were returned. This could be due to safety filters or a temporary issue.");
        }
    } catch (error) {
        console.error("Error generating image from Imagen:", error);
        if (error instanceof Error) {
            if (error.message.includes('SAFETY')) {
                 throw new Error(`Failed to generate image due to safety filters. The AI-generated prompt might have been too ambiguous: "${prompt}"`);
            }
            if (error.message.includes('API key not valid')) {
                throw new Error('The provided API Key is not valid. Please check your configuration.');
            }
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the image.");
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
        return updatedOperation;
    } catch (error) {
        handleApiError(error, "getVideosOperation");
        throw new Error("Failed to poll video operation status.");
    }
}