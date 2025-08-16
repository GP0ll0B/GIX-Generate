


import { useState, useCallback } from 'react';
import { 
    PostType, GeneratedContent, GuidedPostInput, AdCreativeInput, Source, VoiceDialogInput,
    TEXT_SYSTEM_INSTRUCTION, GUIDED_POST_SYSTEM_INSTRUCTION, GROUNDED_SYSTEM_INSTRUCTION,
    VIDEO_SYSTEM_INSTRUCTION, IMAGE_POST_SYSTEM_INSTRUCTION, ANALYSIS_POST_SYSTEM_INSTRUCTION,
    STRATEGY_SYSTEM_INSTRUCTION, STRATEGY_SCHEMA, AD_SYSTEM_INSTRUCTION, VOICE_DIALOG_SYSTEM_INSTRUCTION, VOICE_DIALOG_SCHEMA
} from '../constants';
import { generateContent, generateImage, generateVideos, getVideosOperation } from '../services/geminiService';

interface UseContentGeneratorProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

export interface GeneratePostsParams {
    postType: PostType;
    topic: string;
    url: string;
    guidedInput: GuidedPostInput;
    adCreativeInput: AdCreativeInput;
    voiceDialogInput: VoiceDialogInput;
    videoInputImage: { data: string; type: string; } | null;
    numVariations: number;
    temperature: number;
}

const generateAndParseSinglePost = async (
    params: Omit<GeneratePostsParams, 'numVariations' | 'videoInputImage'>
): Promise<GeneratedContent> => {
    const { postType, topic, url, guidedInput, adCreativeInput, voiceDialogInput, temperature } = params;
    
    let contents = '';
    const config: {
        systemInstruction: string;
        tools?: any[];
        responseMimeType?: string;
        responseSchema?: any;
        temperature?: number;
    } = { systemInstruction: '', temperature: temperature };

    switch (postType) {
        case 'text':
            contents = `Generate a post about: ${topic}`;
            config.systemInstruction = TEXT_SYSTEM_INSTRUCTION;
            break;
        case 'guided':
            contents = `Monetization Feature: "${guidedInput.monetizationFeature}"\nTarget Audience: "${guidedInput.targetAudience}"\nKey Tip/CTA: "${guidedInput.keyTip}"`;
            config.systemInstruction = GUIDED_POST_SYSTEM_INSTRUCTION;
            break;
        case 'ad':
            contents = `Product/Service: "${adCreativeInput.productOrService}"\nTarget Audience: "${adCreativeInput.targetAudience}"\nCall to Action: "${adCreativeInput.callToAction}"`;
            if (adCreativeInput.requiredKeywords) contents += `\nRequired Keywords: ${adCreativeInput.requiredKeywords}`;
            if (adCreativeInput.bannedWords) contents += `\nBanned Words: ${adCreativeInput.bannedWords}`;
            config.systemInstruction = AD_SYSTEM_INSTRUCTION;
            break;
        case 'grounded_text':
            contents = `Using the available search results, generate a fact-checked post about: ${topic}`;
            config.systemInstruction = GROUNDED_SYSTEM_INSTRUCTION;
            config.tools = [{ googleSearch: {} }];
            break;
        case 'video':
            contents = `Generate a video script about: ${topic}`;
            config.systemInstruction = VIDEO_SYSTEM_INSTRUCTION;
            break;
        case 'image':
            contents = `Generate a caption and image prompt for a post about: ${topic}`;
            config.systemInstruction = IMAGE_POST_SYSTEM_INSTRUCTION;
            break;
        case 'analysis':
            contents = `Based on the content from the URL ${url}, fulfill this prompt: ${topic}`;
            config.systemInstruction = ANALYSIS_POST_SYSTEM_INSTRUCTION;
            config.tools = [{ googleSearch: {} }];
            break;
        case 'strategy':
            contents = `Generate a comprehensive content strategy plan.`;
            config.systemInstruction = STRATEGY_SYSTEM_INSTRUCTION;
            config.responseMimeType = 'application/json';
            config.responseSchema = STRATEGY_SCHEMA;
            break;
        case 'voice_dialog':
            contents = `Dialog type: "${voiceDialogInput.dialogType}". Scenario: "${voiceDialogInput.scenario}"`;
            config.systemInstruction = VOICE_DIALOG_SYSTEM_INSTRUCTION;
            config.responseMimeType = 'application/json';
            config.responseSchema = VOICE_DIALOG_SCHEMA;
            break;
        default:
            throw new Error(`Unsupported post type for generation: ${postType}`);
    }

    const response = await generateContent('gemini-2.5-flash', contents, config);
    const rawText = response.text;
    
    const [mainContent, hashtagsString] = rawText.split('###HASHTAGS###');
    const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter(h => h.startsWith('#')) : [];

    switch (postType) {
        case 'text':
            return { type: 'text', content: mainContent.trim(), hashtags };
        case 'guided':
            return { type: 'guided', content: mainContent.trim(), hashtags, monetizationFeature: guidedInput.monetizationFeature };
        case 'grounded_text':
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as Source[] || [];
            return { type: 'grounded_text', content: mainContent.trim(), sources, hashtags };
        case 'video':
            const [title, message] = mainContent.split('###MESSAGE###');
            return { type: 'video', title: title.trim(), message: (message || '').trim(), hashtags };
        case 'image':
            const [caption, imagePrompt] = mainContent.split('###IMAGEPROMPT###');
            return { type: 'image', caption: caption.trim(), imageUrl: 'prompt_ready', imagePrompt: (imagePrompt || '').trim(), hashtags };
        case 'analysis':
            return { type: 'analysis', content: mainContent.trim(), sourceUrl: url, hashtags };
        case 'strategy':
            return { type: 'strategy', strategy: JSON.parse(rawText.trim()) };
        case 'ad':
            const [headlineAndPrimaryText, adImagePrompt] = mainContent.split('###IMAGEPROMPT###');
            const [headline, primaryText] = headlineAndPrimaryText.split('###PRIMARYTEXT###');
            return { 
                type: 'ad', 
                headline: headline.trim(), 
                primaryText: (primaryText || '').trim(), 
                callToAction: adCreativeInput.callToAction, 
                hashtags,
                imagePrompt: (adImagePrompt || '').trim(),
                imageUrl: 'prompt_ready'
            };
        case 'voice_dialog':
            const parsedDialog = JSON.parse(rawText.trim());
            return { type: 'voice_dialog', dialogType: voiceDialogInput.dialogType, scenario: voiceDialogInput.scenario, dialog: parsedDialog.dialog };
        default:
            throw new Error(`Unsupported post type for parsing: ${postType}`);
    }
};

export const useContentGenerator = ({ showToast }: UseContentGeneratorProps) => {
    const [contentVariations, setContentVariations] = useState<GeneratedContent[]>([]);
    const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePost = useCallback(async (params: GeneratePostsParams) => {
        setIsLoading(true);
        setError(null);
        setContentVariations([]);
        setCurrentVariationIndex(0);

        if (params.postType === 'video_generation') {
             const initialPostState: GeneratedContent = {
                type: 'video_generation',
                prompt: params.topic,
                inputImageUrl: params.videoInputImage?.data || null,
                operation: null,
                videoUrl: null,
                status: 'generating',
                pollingMessage: 'Initiating video generation...',
                progress: 0,
            };
            setContentVariations([initialPostState]);

            try {
                const operation = await generateVideos(params.topic, params.videoInputImage);
                
                setContentVariations([{ ...initialPostState, operation, status: 'polling', pollingMessage: 'Video request received. Waiting for processing to start...' }]);

                const pollOperation = async (op: any) => {
                    let currentOperation = op;
                    while (!currentOperation.done) {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        currentOperation = await getVideosOperation(currentOperation);
                        const progress = currentOperation.metadata?.progressPercentage || 0;
                        const progressMessage = `Processing video: ${progress.toFixed(0)}% complete.`;
                        setContentVariations(prev => [{ ...prev[0] as any, operation: currentOperation, pollingMessage: progressMessage, progress }]);
                    }
                    return currentOperation;
                };

                const finalOperation = await pollOperation(operation);

                if (finalOperation.error) {
                     throw new Error(finalOperation.error.message || 'Video generation failed during processing.');
                }

                const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
                if (!downloadLink) {
                    throw new Error("Video generation completed, but no video URL was found.");
                }

                const videoUrl = `${downloadLink}&key=${process.env.API_KEY}`;
                setContentVariations(prev => [{ ...prev[0] as any, status: 'success', videoUrl, pollingMessage: 'Video ready!' }]);
                showToast('Video generated successfully!', 'success');

            } catch (err) {
                const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(msg);
                setContentVariations(prev => [{ ...prev[0] as any, status: 'error', pollingMessage: msg }]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            const { numVariations, ...restParams } = params;
            const promises = Array(numVariations).fill(0).map(() => generateAndParseSinglePost(restParams));
            const results = await Promise.all(promises);
            setContentVariations(results);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const handleImagePromptChange = (newPrompt: string) => {
        setContentVariations(prev => {
            const newVariations = [...prev];
            const currentPost = newVariations[currentVariationIndex];
            if (currentPost && (currentPost.type === 'image' || currentPost.type === 'ad')) {
                newVariations[currentVariationIndex] = { ...currentPost, imagePrompt: newPrompt };
            }
            return newVariations;
        });
    };

    const handleFinalImageGeneration = async () => {
        const currentPost = contentVariations[currentVariationIndex];
        if (!currentPost || (currentPost.type !== 'image' && currentPost.type !== 'ad')) return;

        setIsGeneratingImage(true);
        setError(null);

        try {
            const base64Image = await generateImage(currentPost.imagePrompt);
            const imageUrl = `data:image/jpeg;base64,${base64Image}` as const;
            
            setContentVariations(prev => {
                const newVariations = [...prev];
                const postToUpdate = newVariations[currentVariationIndex];
                if (postToUpdate?.type === 'image' || postToUpdate?.type === 'ad') {
                    newVariations[currentVariationIndex] = { ...postToUpdate, imageUrl };
                }
                return newVariations;
            });
            showToast('Image generated successfully!', 'success');
        } catch (err) {
             const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
             setError(msg);
             showToast(msg, 'error');
        } finally {
            setIsGeneratingImage(false);
        }
    };

    return {
        contentVariations,
        currentVariationIndex,
        isLoading,
        isGeneratingImage,
        error,
        setError,
        handleGeneratePost,
        handleImagePromptChange,
        handleFinalImageGeneration,
        setCurrentVariationIndex,
        setContentVariations
    };
};
