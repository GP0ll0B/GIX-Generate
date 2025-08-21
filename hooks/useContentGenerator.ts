import { useState, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { 
    PostType, GeneratedContent, GuidedPostInput, AdCreativeInput, Source, VoiceDialogInput, ChatMessage, GoogleBusinessPostInput, ModelType, AllianceAdInput, SIMULATED_ALLIES,
    TEXT_SYSTEM_INSTRUCTION, GUIDED_POST_SYSTEM_INSTRUCTION, GROUNDED_SYSTEM_INSTRUCTION,
    VIDEO_SYSTEM_INSTRUCTION, IMAGE_POST_SYSTEM_INSTRUCTION, ANALYSIS_POST_SYSTEM_INSTRUCTION,
    STRATEGY_SYSTEM_INSTRUCTION, STRATEGY_SCHEMA, AD_SYSTEM_INSTRUCTION, ALLIANCE_AD_SYSTEM_INSTRUCTION, VOICE_DIALOG_SYSTEM_INSTRUCTION, VOICE_DIALOG_SCHEMA,
    BRAND_CHAT_SYSTEM_INSTRUCTION, COMMENT_ANALYSIS_SYSTEM_INSTRUCTION, COMMENT_ANALYSIS_SCHEMA, GOOGLE_BUSINESS_POST_SYSTEM_INSTRUCTION,
    BRAND_ALIGNMENT_SYSTEM_INSTRUCTION, BRAND_ALIGNMENT_SCHEMA
} from '../constants';
import { generateContent, generateImage, generateVideos, getVideosOperation } from '../services/geminiService';

interface UseContentGeneratorProps {
    showToast: (message: string, type: 'success' | 'error') => void;
    brandContext: string;
}

export interface GeneratePostsParams {
    postType: PostType;
    topic: string;
    url: string;
    guidedInput: GuidedPostInput;
    adCreativeInput: AdCreativeInput;
    allianceAdInput: AllianceAdInput;
    voiceDialogInput: VoiceDialogInput;
    googleBusinessPostInput: GoogleBusinessPostInput;
    videoInputImage: { data: string; type: string; } | null;
    commentsText: string;
    numVariations: number;
    temperature: number;
    model: ModelType;
}

const generateAndParseSinglePost = async (
    params: Omit<GeneratePostsParams, 'numVariations' | 'videoInputImage'>
): Promise<GeneratedContent> => {
    const { postType, topic, url, guidedInput, adCreativeInput, allianceAdInput, voiceDialogInput, googleBusinessPostInput, temperature, commentsText, model } = params;
    
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
        case 'alliance_ad':
            const keystone = allianceAdInput.keystone;
            if (!keystone.startsWith('fbadcode-') || keystone.length < 9 + 12 + 1 + 19 + 1) {
                throw new Error("Invalid or incomplete Alliance Keystone.");
            }
            const allyCypher = keystone.substring(9 + 12 + 1, 9 + 12 + 1 + 19);
            const ally = SIMULATED_ALLIES[allyCypher];
            if (!ally) {
                throw new Error("Alliance Keystone is not recognized. The Ally's Cypher is unknown.");
            }
            contents = `Core Message: "${allianceAdInput.coreMessage}"\nTarget Audience: "${allianceAdInput.targetAudience}"\nCall to Action: "${allianceAdInput.callToAction}"`;
            config.systemInstruction = ALLIANCE_AD_SYSTEM_INSTRUCTION(ally);
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
        case 'comment_analysis':
            contents = `Analyze the following block of comments:\n\n${commentsText}`;
            config.systemInstruction = COMMENT_ANALYSIS_SYSTEM_INSTRUCTION;
            config.responseMimeType = 'application/json';
            config.responseSchema = COMMENT_ANALYSIS_SCHEMA;
            break;
        case 'google_business_post':
            contents = `Business Name: "${googleBusinessPostInput.businessName}"\nPost Goal: "${googleBusinessPostInput.postGoal}"\nKey Information: "${googleBusinessPostInput.keyInfo}"\nCall to Action: "${googleBusinessPostInput.callToAction}"`;
            config.systemInstruction = GOOGLE_BUSINESS_POST_SYSTEM_INSTRUCTION;
            break;
        default:
            throw new Error(`Unsupported post type for generation: ${postType}`);
    }

    if (model === 'smollm-2-360m') {
        config.systemInstruction = `[Simulation Notice: You are using the lightweight SmolLM-2 360M model. The output should be fast and concise, but may be less nuanced than larger cloud models. Adhere to this persona.]\n\n` + config.systemInstruction;
    }

    const response = await generateContent('gemini-2.5-flash', contents, config);
    const rawText = response.text;
    
    if (postType === 'google_business_post') {
        const [postContent, imagePrompt] = rawText.split('###IMAGEPROMPT###');
        return {
            type: 'google_business_post',
            businessName: googleBusinessPostInput.businessName,
            postContent: postContent.trim(),
            callToAction: googleBusinessPostInput.callToAction,
            imagePrompt: (imagePrompt || '').trim(),
            imageUrl: 'prompt_ready',
            brandAlignment: null,
            brandAlignmentStatus: 'idle',
        };
    }
    
    const [mainContent, hashtagsString] = rawText.split('###HASHTAGS###');
    const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter(h => h.startsWith('#')) : [];
    const brandAlignmentProps = { brandAlignment: null, brandAlignmentStatus: 'idle' as const };

    switch (postType) {
        case 'text':
            return { type: 'text', content: mainContent.trim(), hashtags, ...brandAlignmentProps };
        case 'guided':
            return { type: 'guided', content: mainContent.trim(), hashtags, monetizationFeature: guidedInput.monetizationFeature, ...brandAlignmentProps };
        case 'grounded_text':
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as Source[] || [];
            return { type: 'grounded_text', content: mainContent.trim(), sources, hashtags, ...brandAlignmentProps };
        case 'video':
            const [title, message] = mainContent.split('###MESSAGE###');
            return { type: 'video', title: title.trim(), message: (message || '').trim(), hashtags, ...brandAlignmentProps };
        case 'image':
            const [caption, imagePrompt] = mainContent.split('###IMAGEPROMPT###');
            return { type: 'image', caption: caption.trim(), imageUrl: 'prompt_ready', imagePrompt: (imagePrompt || '').trim(), hashtags, ...brandAlignmentProps };
        case 'analysis':
            return { type: 'analysis', content: mainContent.trim(), sourceUrl: url, hashtags, ...brandAlignmentProps };
        case 'strategy':
            return { type: 'strategy', strategy: JSON.parse(rawText.trim()) };
        case 'ad': {
            const [headlineAndPrimaryText, adImagePrompt] = mainContent.split('###IMAGEPROMPT###');
            const [headline, primaryText] = headlineAndPrimaryText.split('###PRIMARYTEXT###');
            return { 
                type: 'ad', 
                headline: headline.trim(), 
                primaryText: (primaryText || '').trim(), 
                callToAction: adCreativeInput.callToAction, 
                hashtags,
                imagePrompt: (adImagePrompt || '').trim(),
                imageUrl: 'prompt_ready',
                ...brandAlignmentProps
            };
        }
        case 'alliance_ad': {
            const [headlineAndPrimaryText, adImagePrompt] = mainContent.split('###IMAGEPROMPT###');
            const [headline, primaryText] = headlineAndPrimaryText.split('###PRIMARYTEXT###');
            const allyCypher = allianceAdInput.keystone.substring(9 + 12 + 1, 9 + 12 + 1 + 19);
            const ally = SIMULATED_ALLIES[allyCypher];
             return { 
                type: 'alliance_ad', 
                headline: headline.trim(), 
                primaryText: (primaryText || '').trim(), 
                callToAction: allianceAdInput.callToAction, 
                hashtags,
                imagePrompt: (adImagePrompt || '').trim(),
                imageUrl: 'prompt_ready',
                ally,
                keystone: allianceAdInput.keystone,
                ...brandAlignmentProps
            };
        }
        case 'voice_dialog':
            const parsedDialog = JSON.parse(rawText.trim());
            return { type: 'voice_dialog', dialogType: voiceDialogInput.dialogType, scenario: voiceDialogInput.scenario, dialog: parsedDialog.dialog };
        case 'comment_analysis':
            const parsedAnalysis = JSON.parse(rawText.trim());
            return { type: 'comment_analysis', analysis: parsedAnalysis };
        default:
            throw new Error(`Unsupported post type for parsing: ${postType}`);
    }
};

export const useContentGenerator = ({ showToast, brandContext }: UseContentGeneratorProps) => {
    const [contentVariations, setContentVariations] = useState<GeneratedContent[]>([]);
    const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    // Initialize the AI client here to use for chat
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const startNewChat = useCallback((context: string) => {
        const systemInstruction = BRAND_CHAT_SYSTEM_INSTRUCTION(context);
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChat(newChat);
        setContentVariations([{
            type: 'brand_chat',
            messages: [],
            context: context
        }]);
        setCurrentVariationIndex(0);
    }, [ai]);

    const sendChatMessage = useCallback(async (message: string) => {
        if (!chat) return;

        setIsLoading(true);
        setError(null);
        
        // Add user message immediately
        const userMessage: ChatMessage = { author: 'user', content: message };
        setContentVariations(prev => {
            const currentPost = prev[0];
            if (currentPost.type === 'brand_chat') {
                return [{ ...currentPost, messages: [...currentPost.messages, userMessage] }];
            }
            return prev;
        });

        try {
            const responseStream = await chat.sendMessageStream({ message });
            
            // Add an empty model message to start appending to
            setContentVariations(prev => {
                const currentPost = prev[0];
                if (currentPost.type === 'brand_chat') {
                    return [{ ...currentPost, messages: [...currentPost.messages, { author: 'model', content: '' }] }];
                }
                return prev;
            });

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                setContentVariations(prev => {
                    const currentPost = prev[0];
                    if (currentPost.type === 'brand_chat') {
                        const newMessages = [...currentPost.messages];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage.author === 'model') {
                            lastMessage.content += chunkText;
                        }
                        return [{ ...currentPost, messages: newMessages }];
                    }
                    return prev;
                });
            }

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }

    }, [chat, showToast]);

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
            // Comment analysis doesn't need variations
            const variationsToRun = params.postType === 'comment_analysis' ? 1 : numVariations;
            const promises = Array(variationsToRun).fill(0).map(() => generateAndParseSinglePost(restParams));
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
            if (currentPost && (currentPost.type === 'image' || currentPost.type === 'ad' || currentPost.type === 'google_business_post' || currentPost.type === 'alliance_ad')) {
                const updatedPost = { ...currentPost, imagePrompt: newPrompt };
                newVariations[currentVariationIndex] = updatedPost;
            }
            return newVariations;
        });
    };
    
    const handleFinalImageGeneration = useCallback(async () => {
        const currentPost = contentVariations[currentVariationIndex];
        if (!currentPost || (currentPost.type !== 'image' && currentPost.type !== 'ad' && currentPost.type !== 'google_business_post' && currentPost.type !== 'alliance_ad')) {
            return;
        }

        setIsGeneratingImage(true);
        setError(null);

        try {
            const imagePrompt = currentPost.imagePrompt;
            if (!imagePrompt) {
                throw new Error("Image prompt is empty.");
            }
            const base64Image = await generateImage(imagePrompt);
            const imageUrl = `data:image/jpeg;base64,${base64Image}` as const;

            setContentVariations(prev => {
                const newVariations = [...prev];
                const postToUpdate = newVariations[currentVariationIndex];
                if (postToUpdate && (postToUpdate.type === 'image' || postToUpdate.type === 'ad' || postToUpdate.type === 'google_business_post' || postToUpdate.type === 'alliance_ad')) {
                    const updatedPost = { ...postToUpdate, imageUrl: imageUrl };
                    newVariations[currentVariationIndex] = updatedPost;
                }
                return newVariations;
            });

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unexpected error occurred during image generation.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsGeneratingImage(false);
        }
    }, [contentVariations, currentVariationIndex, showToast]);

    const handleBrandReview = useCallback(async (variationIndex: number) => {
        const postToReview = contentVariations[variationIndex];
        if (!postToReview || !('brandAlignmentStatus' in postToReview)) return;

        setContentVariations(prev => {
            const newVariations = [...prev];
            const currentPost = { ...newVariations[variationIndex] } as GeneratedContent & { brandAlignmentStatus: string };
            currentPost.brandAlignmentStatus = 'loading';
            newVariations[variationIndex] = currentPost;
            return newVariations;
        });
        setError(null);

        let textToAnalyze = '';
        switch (postToReview.type) {
            case 'text':
            case 'guided':
            case 'grounded_text':
            case 'analysis':
                textToAnalyze = postToReview.content;
                break;
            case 'video':
                textToAnalyze = `${postToReview.title}\n\n${postToReview.message}`;
                break;
            case 'image':
                textToAnalyze = postToReview.caption;
                break;
            case 'ad':
            case 'alliance_ad':
                textToAnalyze = `Headline: ${postToReview.headline}\n\n${postToReview.primaryText}`;
                break;
            case 'google_business_post':
                textToAnalyze = postToReview.postContent;
                break;
            default:
                console.error("This post type cannot be reviewed for brand alignment.");
                 setContentVariations(prev => {
                    const newVariations = [...prev];
                    (newVariations[variationIndex] as any).brandAlignmentStatus = 'idle';
                    return newVariations;
                });
                return;
        }
        
        const hashtagsText = 'hashtags' in postToReview ? postToReview.hashtags.join(' ') : '';
        const fullContent = `${textToAnalyze}\n\n${hashtagsText}`;

        try {
            const response = await generateContent('gemini-2.5-flash', fullContent, {
                systemInstruction: BRAND_ALIGNMENT_SYSTEM_INSTRUCTION(brandContext),
                responseMimeType: 'application/json',
                responseSchema: BRAND_ALIGNMENT_SCHEMA,
            });
            const alignmentData = JSON.parse(response.text.trim());

            setContentVariations(prev => {
                const newVariations = [...prev];
                const currentPost = { ...newVariations[variationIndex] } as any;
                currentPost.brandAlignment = alignmentData;
                currentPost.brandAlignmentStatus = 'success';
                newVariations[variationIndex] = currentPost;
                return newVariations;
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Brand review failed.';
            setError(msg);
            showToast(msg, 'error');
            setContentVariations(prev => {
                const newVariations = [...prev];
                (newVariations[variationIndex] as any).brandAlignmentStatus = 'error';
                return newVariations;
            });
        }
    }, [contentVariations, brandContext, showToast]);

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
        handleBrandReview,
        setCurrentVariationIndex,
        setContentVariations,
        startNewChat,
        sendChatMessage,
    };
};