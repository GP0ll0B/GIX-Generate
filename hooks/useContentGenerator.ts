import { useState, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { 
    PostType, GeneratedContent, Source, ChatMessage, HistoryItem, GeneratedImageState
} from '../types';
import { generateContent, generateImage, generateVideos, getVideosOperation } from '../services/geminiService';
import { generationStrategies, GeneratePostsParams } from '../services/generationStrategies';

interface UseContentGeneratorProps {
    showToast: (message: string, type: 'success' | 'error') => void;
    brandContext: string;
}

const getPreviewFromContent = (content: GeneratedContent): string => {
    switch(content.type) {
        case 'text':
            return content.caption.substring(0, 100);
        case 'guided':
        case 'grounded_text':
        case 'analysis':
            return content.content.substring(0, 100);
        case 'video':
        case 'blog':
        case 'prototype':
        case 'seo_blog_post':
            if (content.type === 'seo_blog_post' && content.selectedTitle) return content.selectedTitle;
            if ('title' in content) return content.title;
            return 'Blog Post';
        case 'image':
            return content.caption;
        case 'ad':
        case 'alliance_ad':
            return content.headline;
        case 'video_generation':
            return content.prompt;
        case 'google_business_post':
            return content.postContent;
        case 'page_performance':
            return 'Page Performance Analysis';
        case 'monetized_article_campaign':
            return `Campaign: ${content.ampArticle.title}`;
        default:
            return 'Generated Content';
    }
}

const saveToHistory = (variations: GeneratedContent[], prompt: string, postType: PostType) => {
    if (!variations || variations.length === 0) return;
    try {
        const history: HistoryItem[] = JSON.parse(localStorage.getItem('gix-content-history') || '[]');
        const newHistoryItem: HistoryItem = {
            id: new Date().toISOString() + Math.random(),
            timestamp: Date.now(),
            prompt,
            variations: variations,
            postType: postType,
            preview: getPreviewFromContent(variations[0]),
        };
        const newHistory = [newHistoryItem, ...history].slice(0, 50); // Keep latest 50
        localStorage.setItem('gix-content-history', JSON.stringify(newHistory));
    } catch (e) {
        console.error("Failed to save to history:", e);
    }
};

const generateAndParseSinglePost = async (
    params: Omit<GeneratePostsParams, 'numVariations'>
): Promise<GeneratedContent> => {
    const { postType } = params;
    const strategy = generationStrategies[postType];
    
    if (!strategy) {
        throw new Error(`Unsupported post type for generation: ${postType}`);
    }

    const generationParams = strategy.buildGenerationParams(params);
    const response = await generateContent(generationParams);
    
    return strategy.parseResponse(response, params);
};


export const useContentGenerator = ({ showToast, brandContext }: UseContentGeneratorProps) => {
    const [contentVariations, setContentVariations] = useState<GeneratedContent[]>([]);
    const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<string>('');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const startNewChat = useCallback((context: string) => {
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: generationStrategies.brand_chat.getSystemInstruction!(context) },
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

    }, [chat, showToast, setIsLoading, setError, setContentVariations]);
    
    const handleGenerateSeoArticle = useCallback(async (selectedTitle: string, variationIndex: number, autoLinkKeywords: boolean) => {
        const post = contentVariations[variationIndex];
        if (post?.type !== 'seo_blog_post') return;
        
        setIsLoading(true);
        setError(null);
        
        setContentVariations(prev => {
            const newVariations = [...prev];
            const currentPost = { ...newVariations[variationIndex] } as Extract<GeneratedContent, { type: 'seo_blog_post' }>;
            currentPost.selectedTitle = selectedTitle;
            newVariations[variationIndex] = currentPost;
            return newVariations;
        });

        try {
            const { userInput } = post;
            const strategy = generationStrategies.seo_blog_post;
            const generationParams = (strategy.buildGenerationParams as Function)({ ...userInput, selectedTitle, autoLinkKeywords });
            const response = await generateContent(generationParams);
            
            const articleContent = (strategy.parseResponse as Function)(response, { ...userInput, selectedTitle });

            let finalVariations: GeneratedContent[] = [];
            setContentVariations(prev => {
                const newVariations = [...prev];
                const currentPost = { ...newVariations[variationIndex] } as Extract<GeneratedContent, { type: 'seo_blog_post' }>;
                currentPost.stage = 'article';
                currentPost.metaDescription = articleContent.metaDescription;
                currentPost.tags = articleContent.tags;
                currentPost.body = articleContent.body;
                newVariations[variationIndex] = currentPost;
                finalVariations = newVariations;
                return newVariations;
            });
            saveToHistory(finalVariations, post.userInput.topic, 'seo_blog_post');
            
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(msg);
            showToast(msg, 'error');
            setContentVariations(prev => {
                const newVariations = [...prev];
                 const currentPost = { ...newVariations[variationIndex] } as Extract<GeneratedContent, { type: 'seo_blog_post' }>;
                currentPost.selectedTitle = null;
                newVariations[variationIndex] = currentPost;
                return newVariations;
            });
        } finally {
            setIsLoading(false);
        }
    }, [contentVariations, showToast, setIsLoading, setError, setContentVariations]);

    const handleGeneratePost = useCallback(async (params: GeneratePostsParams) => {
        setIsLoading(true);
        setError(null);
        setContentVariations([]);
        setCurrentVariationIndex(0);

        let promptForHistory = params.topic;
        if (params.postType === 'comment_analysis') promptForHistory = params.commentsText;
        else if (params.postType === 'seo_blog_post') promptForHistory = params.seoBlogInput.topic;
        else if (params.postType === 'brand_kit') promptForHistory = 'Brand Voice Analysis';
        else if (params.postType === 'page_performance') promptForHistory = 'Page Performance Analysis';
        setCurrentPrompt(promptForHistory);

        if (params.postType === 'video_generation') {
             const initialPostState: GeneratedContent = {
                type: 'video_generation',
                prompt: params.topic,
                inputImageUrl: params.inputImage?.data || null,
                operation: null,
                videoUrl: null, 
                status: 'generating',
                pollingMessage: 'Warming up the digital director...',
                progress: 0,
            };
            setContentVariations([initialPostState]);

            try {
                const operation = await generateVideos(params.topic, params.inputImage);
                
                setContentVariations([{ ...initialPostState, operation, status: 'polling', pollingMessage: 'Assembling pixels into scenes...' }]);

                const pollOperation = async (op: any) => {
                    let currentOperation = op;
                    while (!currentOperation.done) {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        currentOperation = await getVideosOperation(currentOperation);
                        const progress = currentOperation.metadata?.progressPercentage || 0;
                        const progressMessage = `Rendering the frames: ${progress.toFixed(0)}% complete.`;
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
                
                let finalVariations: GeneratedContent[] = [];
                setContentVariations(prev => {
                    finalVariations = [{ ...prev[0] as any, status: 'success', videoUrl, pollingMessage: 'Video ready!', progress: 100 }];
                    return finalVariations;
                });
                saveToHistory(finalVariations, params.topic, params.postType);
                showToast('Video generated successfully!', 'success');

            } catch (err) {
                const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(msg);
                showToast(msg, 'error');
                setContentVariations(prev => [{ ...prev[0] as any, status: 'error', pollingMessage: msg }]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            const { numVariations, ...restParams } = params;
            const strategy = generationStrategies[params.postType];
            const variationsToRun = strategy.disableVariations ? 1 : numVariations;
            const promises = Array(variationsToRun).fill(0).map(() => generateAndParseSinglePost(restParams));
            const results = await Promise.all(promises);
            setContentVariations(results);
            if (results.length > 0) {
                saveToHistory(results, promptForHistory, params.postType);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast, setCurrentPrompt, setContentVariations, setError, setIsLoading, setCurrentVariationIndex]);

    const handleImagePromptChange = useCallback((newPrompt: string) => {
        setContentVariations(prev => {
            const newVariations = [...prev];
            const currentPost = newVariations[currentVariationIndex];
            if (!currentPost) return prev;

            const updatedPost = { ...currentPost };

            if (updatedPost.type === 'image' || updatedPost.type === 'ad' || updatedPost.type === 'google_business_post' || updatedPost.type === 'alliance_ad' || updatedPost.type === 'blog') {
                updatedPost.imagePrompt = newPrompt;
                newVariations[currentVariationIndex] = updatedPost;
            } else if (updatedPost.type === 'monetized_article_campaign') {
                const newFbPost = { ...updatedPost.fbPost, imagePrompt: newPrompt };
                const newCampaignPost = { ...updatedPost, fbPost: newFbPost };
                newVariations[currentVariationIndex] = newCampaignPost;
            }
            
            return newVariations;
        });
    }, [currentVariationIndex, setContentVariations]);
    
    const handleFinalImageGeneration = useCallback(async (is360: boolean) => {
        const currentPost = contentVariations[currentVariationIndex];
        const postForImage = currentPost?.type === 'monetized_article_campaign' ? currentPost.fbPost : currentPost;

        if (!postForImage || !('imagePrompt' in postForImage)) {
            return;
        }

        setIsGeneratingImage(true);
        setError(null);

        try {
            const imagePrompt = postForImage.imagePrompt;
            if (!imagePrompt) {
                throw new Error("Image prompt is empty.");
            }
            
            const aspectRatio = is360 ? '16:9' : '1:1';
            const finalPrompt = is360
                ? `Generate a highly detailed, photorealistic, 360-degree equirectangular panoramic photo with a 16:9 aspect ratio. The scene is: ${imagePrompt}. Crucially, ensure the left and right edges of the image blend seamlessly to create a perfect, continuous loop for a VR experience.`
                : imagePrompt;

            const base64Image = await generateImage(finalPrompt, aspectRatio);
            const imageUrl = `data:image/jpeg;base64,${base64Image}` as const;

            let finalVariations: GeneratedContent[] = [];
            setContentVariations(prev => {
                const newVariations = [...prev];
                const postToUpdate = newVariations[currentVariationIndex];

                if (!postToUpdate) return prev;

                if (postToUpdate.type === 'monetized_article_campaign') {
                    const updatedPost = { ...postToUpdate, fbPost: { ...postToUpdate.fbPost, imageUrl } };
                    newVariations[currentVariationIndex] = updatedPost;
                } else if (postToUpdate.type === 'image') {
                    const updatedPost = { ...postToUpdate, imageUrl, is360 };
                    newVariations[currentVariationIndex] = updatedPost;
                } else if (
                    postToUpdate.type === 'ad' ||
                    postToUpdate.type === 'alliance_ad' ||
                    postToUpdate.type === 'google_business_post' ||
                    postToUpdate.type === 'blog'
                ) {
                    const updatedPost = { ...postToUpdate, imageUrl: imageUrl };
                    newVariations[currentVariationIndex] = updatedPost;
                }
                finalVariations = newVariations;
                return newVariations;
            });
            saveToHistory(finalVariations, currentPrompt, currentPost.type as PostType);

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unexpected error occurred during image generation.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsGeneratingImage(false);
        }
    }, [contentVariations, currentVariationIndex, showToast, currentPrompt]);

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

        const strategy = generationStrategies.brand_review;
        if (!strategy) return;

        const textToAnalyze = (strategy.extractTextForReview as Function)(postToReview);

        if (!textToAnalyze) {
            showToast("This post type cannot be reviewed for brand alignment.", "error");
             setContentVariations(prev => {
                const newVariations = [...prev];
                const post = newVariations[variationIndex];
                if ('brandAlignmentStatus' in post) {
                    (post as any).brandAlignmentStatus = 'idle';
                }
                return newVariations;
            });
            return;
        }
        
        try {
            const generationParams = strategy.buildGenerationParams({ brandContext, textToAnalyze });
            const response = await generateContent(generationParams);
            const alignmentData = strategy.parseResponse(response, {});
            
            let finalVariations: GeneratedContent[] = [];
            setContentVariations(prev => {
                const newVariations = [...prev];
                const currentPost = { ...newVariations[variationIndex] } as any;
                currentPost.brandAlignment = alignmentData;
                currentPost.brandAlignmentStatus = 'success';
                newVariations[variationIndex] = currentPost;
                finalVariations = newVariations;
                return newVariations;
            });
            saveToHistory(finalVariations, currentPrompt, postToReview.type as PostType);
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
    }, [contentVariations, brandContext, showToast, currentPrompt, setContentVariations, setError]);

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
        handleGenerateSeoArticle,
    };
};