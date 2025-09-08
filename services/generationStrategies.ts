import { GenerateContentParameters } from "@google/genai";
import { 
    PostType, GeneratedContent, GuidedPostInput, AdCreativeInput, Source, VoiceDialogInput, 
    GoogleBusinessPostInput, ModelType, AllianceAdInput, AmpPrototypeInput, 
    MonetizedArticleCampaignInput, SeoBlogInput, BrandVoiceInput, EngagementBoosterInput,
    AutomatedResponderInput,
    WhatsAppAutoResponderInput,
    TaskType,
    PostEngagementStrategistInput
} from '../types';
import { SIMULATED_ALLIES } from '../constants';
import { PAGE_PERFORMANCE_DATA } from '../appData';
import { 
    getTextSystemInstruction, GUIDED_POST_SYSTEM_INSTRUCTION, GROUNDED_SYSTEM_INSTRUCTION,
    VIDEO_SYSTEM_INSTRUCTION, IMAGE_POST_SYSTEM_INSTRUCTION, ANALYSIS_POST_SYSTEM_INSTRUCTION,
    STRATEGY_SYSTEM_INSTRUCTION, AD_SYSTEM_INSTRUCTION, ALLIANCE_AD_SYSTEM_INSTRUCTION, 
    VOICE_DIALOG_SYSTEM_INSTRUCTION, COMMENT_ANALYSIS_SYSTEM_INSTRUCTION, 
    GOOGLE_BUSINESS_POST_SYSTEM_INSTRUCTION, BRAND_ALIGNMENT_SYSTEM_INSTRUCTION, 
    BLOG_POST_SYSTEM_INSTRUCTION, AMP_PROTOTYPE_SYSTEM_INSTRUCTION, 
    MONETIZED_ARTICLE_CAMPAIGN_SYSTEM_INSTRUCTION, SEO_TITLE_SYSTEM_INSTRUCTION, 
    SEO_ARTICLE_SYSTEM_INSTRUCTION, BRAND_VOICE_SYSTEM_INSTRUCTION, 
    PAGE_PERFORMANCE_SYSTEM_INSTRUCTION, ENGAGEMENT_HOOKS_SYSTEM_INSTRUCTION, 
    ENGAGEMENT_REWRITE_SYSTEM_INSTRUCTION, AUTOMATED_RESPONDER_FLOW_INSTRUCTION,
    WHATSAPP_AUTO_RESPONDER_INSTRUCTION,
    POST_AND_ENGAGEMENT_STRATEGY_SYSTEM_INSTRUCTION
} from '../prompts';
import {
    STRATEGY_SCHEMA, VOICE_DIALOG_SCHEMA, COMMENT_ANALYSIS_SCHEMA, 
    BRAND_ALIGNMENT_SCHEMA, BRAND_VOICE_ANALYSIS_SCHEMA, PAGE_PERFORMANCE_SCHEMA, 
    VIRAL_HOOK_SCHEMA, AUTOMATED_RESPONDER_FLOW_SCHEMA,
    WHATSAPP_AUTO_RESPONDER_SCHEMA,
    TEXT_POST_WITH_SAFETY_SCHEMA,
    VQA_SCHEMA,
    POST_WITH_ENGAGEMENT_STRATEGY_SCHEMA
} from '../schemas';

// Re-export for use in the main hook
export interface GeneratePostsParams {
    postType: PostType;
    topic: string;
    url: string;
    guidedInput: GuidedPostInput;
    adCreativeInput: AdCreativeInput;
    allianceAdInput: AllianceAdInput;
    voiceDialogInput: VoiceDialogInput;
    googleBusinessPostInput: GoogleBusinessPostInput;
    ampPrototypeInput: AmpPrototypeInput;
    monetizedArticleInput: MonetizedArticleCampaignInput;
    seoBlogInput: SeoBlogInput;
    brandVoiceInput: BrandVoiceInput;
    engagementBoosterInput: EngagementBoosterInput;
    automatedResponderInput: AutomatedResponderInput;
    whatsAppAutoResponderInput: WhatsAppAutoResponderInput;
    postEngagementStrategistInput: PostEngagementStrategistInput;
    inputImage: { data: string; type: string; } | null;
    commentsText: string;
    numVariations: number;
    temperature: number;
    model: ModelType;
    autoLinkKeywords: boolean;
    task: TaskType;
}

const parseJson = (text: string, context: string): any => {
    try {
        const cleanText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error(`[JSON Parse Error][${context}]`, e, "Raw text:", text);
        throw new Error(`The AI returned an invalid format for the ${context}. Please try again.`);
    }
};

interface GenerationStrategy {
    buildGenerationParams: (params: any) => GenerateContentParameters;
    parseResponse: (response: any, params: any) => GeneratedContent;
    getSystemInstruction?: (context?: any) => string;
    extractTextForReview?: (post: any) => string;
    disableVariations?: boolean;
}

const autoLinkInstruction = `\n\nAlso, identify 5-10 key technical or conceptual terms in the article body and wrap each term in double square brackets, like this: [[Quantum Computing]]. Do not link common words. The links should be relevant and add value for a reader wanting to learn more.`;
const brandAlignmentProps = { brandAlignment: null, brandAlignmentStatus: 'idle' as const };

export const generationStrategies: Partial<Record<PostType, GenerationStrategy>> & { brand_review: GenerationStrategy } = {
    'text': {
        buildGenerationParams: ({ topic, temperature, inputImage, task }: Pick<GeneratePostsParams, 'topic' | 'temperature' | 'inputImage' | 'task'>) => {
             const baseParams: Partial<GenerateContentParameters> = {
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: getTextSystemInstruction(task),
                    temperature
                }
            };
            
            if (task === 'Visual Q&A') {
                if (!inputImage?.data) throw new Error("Visual Q&A requires an image.");
                const parts = inputImage.data.split(',');
                if (parts.length === 2) {
                    const base64Data = parts[1].replace(/(\r\n|\n|\r)/gm, "");
                    const imagePart = { inlineData: { mimeType: inputImage.type, data: base64Data } };
                    const textPart = { text: `My question is: "${topic}"` };
                    return {
                        ...baseParams,
                        contents: { parts: [imagePart, textPart] },
                        config: { ...baseParams.config, responseMimeType: 'application/json', responseSchema: VQA_SCHEMA }
                    } as GenerateContentParameters;
                }
            }

            // For other tasks (Social Media, Accessibility, Marketing)
            if (inputImage?.data && inputImage.type) {
                const parts = inputImage.data.split(',');
                if (parts.length === 2) {
                    const base64Data = parts[1].replace(/(\r\n|\n|\r)/gm, "");
                    const imagePart = { inlineData: { mimeType: inputImage.type, data: base64Data } };
                    const textPart = { text: `The topic is: "${topic}"` };
                    return {
                        ...baseParams,
                        contents: { parts: [imagePart, textPart] },
                        config: { ...baseParams.config, responseMimeType: 'application/json', responseSchema: TEXT_POST_WITH_SAFETY_SCHEMA }
                    } as GenerateContentParameters;
                }
            }
    
            // Text-only prompt for non-VQA tasks
            return {
                ...baseParams,
                contents: `The topic is: "${topic}"`,
                config: { ...baseParams.config, responseMimeType: 'application/json', responseSchema: TEXT_POST_WITH_SAFETY_SCHEMA }
            } as GenerateContentParameters;
        },
        parseResponse: (response: any, params: any): GeneratedContent => {
            const parsed = parseJson(response.text, 'text post');

            if (params.task === 'Visual Q&A') {
                return {
                    type: 'text',
                    caption: parsed.answer, // Use answer as caption for consistency
                    hashtags: [],
                    imageUrl: params.inputImage?.data || null,
                    safetyAnalysis: { isSafe: true, reasoning: "Visual Q&A response." },
                    vqaResult: parsed,
                    ...brandAlignmentProps
                };
            }

            return { 
                type: 'text', 
                caption: parsed.caption, 
                hashtags: parsed.hashtags, 
                imageUrl: params.inputImage?.data || null, 
                safetyAnalysis: parsed.safetyAnalysis,
                ...brandAlignmentProps 
            };
        }
    },
    'guided': {
        buildGenerationParams: ({ guidedInput, temperature, model }) => ({
            model: 'gemini-2.5-flash',
            contents: `Monetization Feature: "${guidedInput.monetizationFeature}"\nTarget Audience: "${guidedInput.targetAudience}"\nKey Tip/CTA: "${guidedInput.keyTip}"`,
            config: {
                systemInstruction: GUIDED_POST_SYSTEM_INSTRUCTION,
                temperature
            }
        }),
        parseResponse: (response, { guidedInput }) => {
            const [content, hashtagsString] = response.text.split('###HASHTAGS###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            return { type: 'guided', content: content.trim(), hashtags, monetizationFeature: guidedInput.monetizationFeature, ...brandAlignmentProps };
        }
    },
    'grounded_text': {
        buildGenerationParams: ({ topic, temperature, model }) => ({
            model: 'gemini-2.5-flash',
            contents: `Using the available search results, generate a fact-checked post about: ${topic}`,
            config: {
                systemInstruction: GROUNDED_SYSTEM_INSTRUCTION,
                temperature,
                tools: [{ googleSearch: {} }]
            }
        }),
        parseResponse: (response) => {
            const [content, hashtagsString] = response.text.split('###HASHTAGS###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as Source[] || [];
            return { type: 'grounded_text', content: content.trim(), sources, hashtags, ...brandAlignmentProps };
        }
    },
    'video': {
        buildGenerationParams: ({ topic, temperature, model }) => ({
            model: 'gemini-2.5-flash',
            contents: `Generate a video script about: ${topic}`,
            config: { systemInstruction: VIDEO_SYSTEM_INSTRUCTION, temperature }
        }),
        parseResponse: (response) => {
            const [raw, hashtagsString] = response.text.split('###HASHTAGS###');
            const [title, message] = raw.split('###MESSAGE###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            return { type: 'video', title: title.trim(), message: (message || '').trim(), hashtags, ...brandAlignmentProps };
        }
    },
    'image': {
        buildGenerationParams: ({ topic, temperature, model }) => ({
            model: 'gemini-2.5-flash',
            contents: `Generate a caption and image prompt for a post about: ${topic}`,
            config: { systemInstruction: IMAGE_POST_SYSTEM_INSTRUCTION, temperature }
        }),
        parseResponse: (response) => {
            const [raw, hashtagsString] = response.text.split('###HASHTAGS###');
            const [caption, imagePrompt] = raw.split('###IMAGEPROMPT###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            return { type: 'image', caption: caption.trim(), imageUrl: 'prompt_ready', imagePrompt: (imagePrompt || '').trim(), hashtags, ...brandAlignmentProps };
        }
    },
     'blog': {
        buildGenerationParams: ({ topic, autoLinkKeywords, temperature, model }) => ({
            model: 'gemini-2.5-flash',
            contents: `Generate a blog post about: ${topic}${autoLinkKeywords ? autoLinkInstruction : ''}`,
            config: { systemInstruction: BLOG_POST_SYSTEM_INSTRUCTION, temperature }
        }),
        parseResponse: (response, { inputImage }) => {
            const [title, rest] = response.text.split('###BODY###');
            const [body, rest2] = (rest || '').split('###IMAGEPROMPT###');
            const [imagePrompt, hashtagsString] = (rest2 || '').split('###HASHTAGS###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            return { type: 'blog', title: title.trim(), body: body.trim(), imagePrompt: (imagePrompt || '').trim(), imageUrl: inputImage?.data || 'prompt_ready', hashtags, ...brandAlignmentProps };
        }
    },
    'seo_blog_post': {
        buildGenerationParams: ({ seoBlogInput, temperature, model, selectedTitle, autoLinkKeywords }) => {
            if (selectedTitle) { // Stage 2: Generate article
                return {
                    model: 'gemini-2.5-flash',
                    contents: `Chosen Title: "${selectedTitle}"\nOriginal Topic/Idea: "${seoBlogInput.topic}"\nPrimary Keyword: "${seoBlogInput.keyword}"\nTarget Audience: "${seoBlogInput.audience}"\nTone: "${seoBlogInput.tone}"${autoLinkKeywords ? autoLinkInstruction : ''}`,
                    config: { systemInstruction: SEO_ARTICLE_SYSTEM_INSTRUCTION, temperature }
                };
            }
            // Stage 1: Generate titles
            return {
                model: 'gemini-2.5-flash',
                contents: `Topic/Idea: "${seoBlogInput.topic}"\nPrimary Keyword: "${seoBlogInput.keyword}"\nTarget Audience: "${seoBlogInput.audience}"\nTone: "${seoBlogInput.tone}"`,
                config: { systemInstruction: SEO_TITLE_SYSTEM_INSTRUCTION, temperature, tools: [{ googleSearch: {} }] }
            };
        },
        parseResponse: (response, { seoBlogInput, selectedTitle }) => {
            if (selectedTitle) { // Stage 2
                const [meta, rest] = response.text.split('###TAGS###');
                const [tagsString, body] = (rest || '').split('###BODY###');
                const tags = tagsString.split(',').map((t:string) => t.trim()).filter(Boolean);
                return { 
                    type: 'seo_blog_post',
                    stage: 'article',
                    userInput: seoBlogInput,
                    titles: [selectedTitle], 
                    sources: null,
                    selectedTitle: selectedTitle,
                    metaDescription: meta.trim(),
                    tags,
                    body: body.trim(),
                    ...brandAlignmentProps
                };
            }
             // Stage 1
            const titles = response.text.split('###TITLE###').map((t:string) => t.trim()).filter(Boolean);
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as Source[] || [];
            return { type: 'seo_blog_post', stage: 'titles', userInput: seoBlogInput, titles, sources, selectedTitle: null, metaDescription: null, tags: null, body: null, ...brandAlignmentProps };
        },
        disableVariations: true,
    },
    'analysis': {
        buildGenerationParams: ({ url, topic, temperature, model }) => ({
            model: 'gemini-2.5-flash',
            contents: `Based on the content from the URL ${url}, fulfill this prompt: ${topic}`,
            config: { systemInstruction: ANALYSIS_POST_SYSTEM_INSTRUCTION, temperature, tools: [{ googleSearch: {} }] }
        }),
        parseResponse: (response, { url }) => {
            const [content, hashtagsString] = response.text.split('###HASHTAGS###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            return { type: 'analysis', content: content.trim(), sourceUrl: url, hashtags, ...brandAlignmentProps };
        }
    },
    'strategy': {
        buildGenerationParams: ({ temperature }) => ({
            model: 'gemini-2.5-flash',
            contents: 'Generate a comprehensive content strategy plan.',
            config: { systemInstruction: STRATEGY_SYSTEM_INSTRUCTION, temperature, responseMimeType: 'application/json', responseSchema: STRATEGY_SCHEMA }
        }),
        parseResponse: (response) => ({ type: 'strategy', strategy: parseJson(response.text, 'strategy plan') })
    },
    'ad': {
        buildGenerationParams: ({ adCreativeInput, temperature, model }: GeneratePostsParams) => ({
            model: 'gemini-2.5-flash',
            contents: `Product/Service: "${adCreativeInput.productOrService}"\nTarget Audience: "${adCreativeInput.targetAudience}"\nCall to Action: "${adCreativeInput.callToAction}"\nRequired Keywords: ${adCreativeInput.requiredKeywords}\nBanned Words: ${adCreativeInput.bannedWords}`,
            config: { systemInstruction: AD_SYSTEM_INSTRUCTION(), temperature }
        }),
        parseResponse: (response: any, { adCreativeInput }: GeneratePostsParams) => {
            const [raw, hashtagsString] = response.text.split('###HASHTAGS###');
            const [headlineAndPrimaryText, adImagePrompt] = raw.split('###IMAGEPROMPT###');
            const [headline, primaryText] = headlineAndPrimaryText.split('###PRIMARYTEXT###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            return { type: 'ad', headline: headline.trim(), primaryText: (primaryText || '').trim(), callToAction: adCreativeInput.callToAction, hashtags, imagePrompt: (adImagePrompt || '').trim(), imageUrl: 'prompt_ready', ...brandAlignmentProps };
        }
    },
    'alliance_ad': {
        buildGenerationParams: ({ allianceAdInput, temperature, model }: GeneratePostsParams) => {
            const keystone = allianceAdInput.keystone;
            if (!keystone.startsWith('fbadcode-') || keystone.length < 9 + 12 + 1 + 19 + 1) throw new Error("Invalid or incomplete Alliance Keystone.");
            const allyCypher = keystone.substring(9 + 12 + 1, 9 + 12 + 1 + 19);
            const ally = SIMULATED_ALLIES[allyCypher];
            if (!ally) throw new Error("Alliance Keystone is not recognized.");
            return {
                model: 'gemini-2.5-flash',
                contents: `Core Message: "${allianceAdInput.coreMessage}"\nTarget Audience: "${allianceAdInput.targetAudience}"\nCall to Action: "${allianceAdInput.callToAction}"`,
                config: { systemInstruction: ALLIANCE_AD_SYSTEM_INSTRUCTION(ally), temperature }
            };
        },
        parseResponse: (response: any, { allianceAdInput }: GeneratePostsParams) => {
            const [raw, hashtagsString] = response.text.split('###HASHTAGS###');
            const [headlineAndPrimaryText, adImagePrompt] = raw.split('###IMAGEPROMPT###');
            const [headline, primaryText] = headlineAndPrimaryText.split('###PRIMARYTEXT###');
            const hashtags = hashtagsString ? hashtagsString.trim().split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            const allyCypher = allianceAdInput.keystone.substring(9 + 12 + 1, 9 + 12 + 1 + 19);
            return { type: 'alliance_ad', headline: headline.trim(), primaryText: (primaryText || '').trim(), callToAction: allianceAdInput.callToAction, hashtags, imagePrompt: (adImagePrompt || '').trim(), imageUrl: 'prompt_ready', ally: SIMULATED_ALLIES[allyCypher], keystone: allianceAdInput.keystone, ...brandAlignmentProps };
        }
    },
    'voice_dialog': {
        buildGenerationParams: ({ voiceDialogInput, temperature }: GeneratePostsParams) => ({
            model: 'gemini-2.5-flash',
            contents: `Dialog type: "${voiceDialogInput.dialogType}". Scenario: "${voiceDialogInput.scenario}"`,
            config: { systemInstruction: VOICE_DIALOG_SYSTEM_INSTRUCTION, temperature, responseMimeType: 'application/json', responseSchema: VOICE_DIALOG_SCHEMA }
        }),
        parseResponse: (response: any, { voiceDialogInput }: GeneratePostsParams) => {
            const parsedDialog = parseJson(response.text, 'voice dialog');
            return { type: 'voice_dialog', dialogType: voiceDialogInput.dialogType, scenario: voiceDialogInput.scenario, dialog: parsedDialog.dialog };
        }
    },
    'comment_analysis': {
        buildGenerationParams: ({ commentsText, temperature }: GeneratePostsParams) => ({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following block of comments:\n\n${commentsText}`,
            config: { systemInstruction: COMMENT_ANALYSIS_SYSTEM_INSTRUCTION, temperature, responseMimeType: 'application/json', responseSchema: COMMENT_ANALYSIS_SCHEMA }
        }),
        parseResponse: (response: any) => ({ type: 'comment_analysis', analysis: parseJson(response.text, 'comment analysis') }),
        disableVariations: true,
    },
    'page_performance': {
        buildGenerationParams: ({ temperature }: GeneratePostsParams) => {
            const totals = PAGE_PERFORMANCE_DATA.reduce((acc, day) => {
                acc.reach += day.reach;
                acc.engagement += day.interactions;
                acc.followers_growth += day.net_follows;
                return acc;
            }, { reach: 0, engagement: 0, followers_growth: 0 });

            const topPost = PAGE_PERFORMANCE_DATA.reduce((top, day) => day.views > top.views ? day : top, PAGE_PERFORMANCE_DATA[0]);

            const simulatedData = {
                metrics: totals,
                top_post: { 
                    type: 'Video',
                    reach: topPost.reach, 
                    engagement_rate: topPost.views > 0 ? (topPost.interactions / topPost.views) : 0, 
                    title: `Highlight from ${new Date(topPost.date).toLocaleDateString()}` 
                },
                audience: { top_country: 'United States', top_age_range: '25-34' }
            };
            return {
                model: 'gemini-2.5-flash',
                contents: `Analyze the following page performance data: ${JSON.stringify(simulatedData, null, 2)}`,
                config: { systemInstruction: PAGE_PERFORMANCE_SYSTEM_INSTRUCTION, temperature, responseMimeType: 'application/json', responseSchema: PAGE_PERFORMANCE_SCHEMA }
            };
        },
        parseResponse: (response: any) => ({ type: 'page_performance', analysis: parseJson(response.text, 'page performance analysis') }),
        disableVariations: true,
    },
    'google_business_post': {
        buildGenerationParams: ({ googleBusinessPostInput, temperature, model }: GeneratePostsParams) => ({
            model: 'gemini-2.5-flash',
            contents: `Business Name: "${googleBusinessPostInput.businessName}"\nPost Goal: "${googleBusinessPostInput.postGoal}"\nKey Information: "${googleBusinessPostInput.keyInfo}"\nCall to Action: "${googleBusinessPostInput.callToAction}"`,
            config: { systemInstruction: GOOGLE_BUSINESS_POST_SYSTEM_INSTRUCTION, temperature }
        }),
        parseResponse: (response: any, { googleBusinessPostInput }: GeneratePostsParams) => {
            const [postContent, imagePrompt] = response.text.split('###IMAGEPROMPT###');
            return { type: 'google_business_post', businessName: googleBusinessPostInput.businessName, postContent: postContent.trim(), callToAction: googleBusinessPostInput.callToAction, imagePrompt: (imagePrompt || '').trim(), imageUrl: 'prompt_ready', ...brandAlignmentProps };
        }
    },
    'prototype': {
        buildGenerationParams: ({ ampPrototypeInput, temperature, model }: GeneratePostsParams) => ({
            model: 'gemini-2.5-flash',
            contents: `Product/Service: "${ampPrototypeInput.productOrService}"\nArticle Goal: "${ampPrototypeInput.articleGoal}"\nTarget Audience: "${ampPrototypeInput.targetAudience}"\nKey Points: "${ampPrototypeInput.keyPoints}"`,
            config: { systemInstruction: AMP_PROTOTYPE_SYSTEM_INSTRUCTION, temperature }
        }),
        parseResponse: (response: any) => {
            const [title, rest] = response.text.split('###BODY###');
            const [ampBody, ctaText] = (rest || '').split('###CTA###');
            return { type: 'prototype', title: title.trim(), ampBody: (ampBody || '').trim(), ctaText: (ctaText || '').trim(), ...brandAlignmentProps };
        }
    },
    'monetized_article_campaign': {
        buildGenerationParams: ({ monetizedArticleInput, temperature, model }: GeneratePostsParams) => ({
            model: 'gemini-2.5-flash',
            contents: `Product/Service: "${monetizedArticleInput.productOrService}"\nArticle Goal: "${monetizedArticleInput.articleGoal}"\nTarget Audience: "${monetizedArticleInput.targetAudience}"\nKey Points: "${monetizedArticleInput.keyPoints}"`,
            config: { systemInstruction: MONETIZED_ARTICLE_CAMPAIGN_SYSTEM_INSTRUCTION, temperature }
        }),
        parseResponse: (response: any) => {
            const parts = response.text.split(/###FB_IMAGE_PROMPT###|###FB_HASHTAGS###|###ARTICLE_TITLE###|###ARTICLE_BODY###|###ARTICLE_CTA###/);
            if (parts.length < 6) throw new Error(`Failed to parse campaign response. Expected 6 parts, but got ${parts.length}.`);
            const [fbCaption, fbImagePrompt, fbHashtagsString, articleTitle, articleBody, articleCta] = parts.map((p:string) => p.trim());
            const fbHashtags = fbHashtagsString ? fbHashtagsString.split(/\s+/).filter((h:string) => h.startsWith('#')) : [];
            return { type: 'monetized_article_campaign', fbPost: { caption: fbCaption, imagePrompt: fbImagePrompt, hashtags: fbHashtags, imageUrl: 'prompt_ready' }, ampArticle: { title: articleTitle, ampBody: articleBody, ctaText: articleCta }, ...brandAlignmentProps };
        }
    },
    'brand_kit': {
        buildGenerationParams: ({ brandVoiceInput, temperature }: GeneratePostsParams) => ({
            model: 'gemini-2.5-flash',
            contents: `Mission Statement: "${brandVoiceInput.missionStatement}"\nCore Values: "${brandVoiceInput.coreValues}"\nTarget Audience Persona: "${brandVoiceInput.targetAudiencePersona}"\nBrand Voice Tone: "${brandVoiceInput.brandVoiceTone}"`,
            config: { systemInstruction: BRAND_VOICE_SYSTEM_INSTRUCTION, temperature, responseMimeType: 'application/json', responseSchema: BRAND_VOICE_ANALYSIS_SCHEMA }
        }),
        parseResponse: (response: any) => ({ type: 'brand_voice_analysis', analysis: parseJson(response.text, 'brand voice analysis') }),
        disableVariations: true,
    },
    'engagement_booster': {
        buildGenerationParams: ({ engagementBoosterInput, temperature }: GeneratePostsParams) => {
            const { mode, topic, textToRewrite } = engagementBoosterInput;
            if (mode === 'hooks') {
                return {
                    model: 'gemini-2.5-flash',
                    contents: `Generate viral hooks for the topic: ${topic}`,
                    config: { systemInstruction: ENGAGEMENT_HOOKS_SYSTEM_INSTRUCTION, temperature, responseMimeType: 'application/json', responseSchema: VIRAL_HOOK_SCHEMA }
                };
            }
            return {
                model: 'gemini-2.5-flash',
                contents: `Rewrite the following text for high engagement:\n\n${textToRewrite}`,
                config: { systemInstruction: ENGAGEMENT_REWRITE_SYSTEM_INSTRUCTION, temperature }
            };
        },
        parseResponse: (response: any, { engagementBoosterInput }: GeneratePostsParams) => {
            if (engagementBoosterInput.mode === 'hooks') {
                const parsed = parseJson(response.text, 'viral hooks');
                return { type: 'engagement_hooks', topic: engagementBoosterInput.topic, hooks: parsed.hooks };
            }
            return { type: 'rewritten_text', originalText: engagementBoosterInput.textToRewrite, rewrittenText: response.text.trim() };
        }
    },
    'automated_responder': {
        buildGenerationParams: ({ automatedResponderInput, temperature }: { automatedResponderInput: AutomatedResponderInput; temperature: number }) => ({
            model: 'gemini-2.5-flash',
            contents: `Goal: "${automatedResponderInput.goal}"\nPlatform: "${automatedResponderInput.platform}"`,
            config: {
                systemInstruction: AUTOMATED_RESPONDER_FLOW_INSTRUCTION,
                temperature,
                responseMimeType: 'application/json',
                responseSchema: AUTOMATED_RESPONDER_FLOW_SCHEMA,
            }
        }),
        parseResponse: (response: any) => {
            const flow = parseJson(response.text, 'automated responder flow');
            return { type: 'automated_responder', flow, ...brandAlignmentProps };
        },
        extractTextForReview: (post: Extract<GeneratedContent, { type: 'automated_responder' }>) => {
            const { flow } = post;
            let text = `Welcome: ${flow.welcomeMessage}\nFallback: ${flow.fallbackMessage}\n`;
            flow.quickReplies.forEach(qr => {
                text += `Reply for "${qr.label}": ${qr.response}\n`;
            });
            return text;
        }
    },
    'whatsapp_auto_responder': {
        buildGenerationParams: ({ whatsAppAutoResponderInput, temperature }: { whatsAppAutoResponderInput: WhatsAppAutoResponderInput; temperature: number }) => ({
            model: 'gemini-2.5-flash',
            contents: `Goal: "${whatsAppAutoResponderInput.goal}"\nBusiness Info: "${whatsAppAutoResponderInput.businessInfo}"\nTone: "${whatsAppAutoResponderInput.tone}"`,
            config: {
                systemInstruction: WHATSAPP_AUTO_RESPONDER_INSTRUCTION,
                temperature,
                responseMimeType: 'application/json',
                responseSchema: WHATSAPP_AUTO_RESPONDER_SCHEMA,
            }
        }),
        parseResponse: (response: any) => {
            const flow = parseJson(response.text, 'WhatsApp auto-responder flow');
            return { type: 'whatsapp_auto_responder', flow, ...brandAlignmentProps };
        }
    },
    'post_engagement_strategist': {
        buildGenerationParams: ({ postEngagementStrategistInput, temperature, model }) => ({
            model: 'gemini-2.5-flash',
            contents: `Generate a post and engagement strategy for the topic: "${postEngagementStrategistInput.topic}"`,
            config: {
                systemInstruction: POST_AND_ENGAGEMENT_STRATEGY_SYSTEM_INSTRUCTION,
                temperature,
                responseMimeType: 'application/json',
                responseSchema: POST_WITH_ENGAGEMENT_STRATEGY_SCHEMA,
            }
        }),
        parseResponse: (response: any, params: any): GeneratedContent => {
            const parsed = parseJson(response.text, 'post and engagement strategy');
            const basePost: Extract<GeneratedContent, { type: 'text' }> = {
                type: 'text',
                caption: parsed.basePost.caption,
                hashtags: parsed.basePost.hashtags,
                safetyAnalysis: parsed.basePost.safetyAnalysis,
                ...brandAlignmentProps
            };
            return {
                type: 'post_engagement_strategist',
                basePost: basePost,
                engagementStrategy: parsed.engagementStrategy
            };
        },
        disableVariations: true,
    },
    'brand_review': { // Not a post type, but a utility strategy
        buildGenerationParams: ({ brandContext, textToAnalyze }: { brandContext: string, textToAnalyze: string }) => ({
            model: 'gemini-2.5-flash',
            contents: textToAnalyze,
            config: { systemInstruction: BRAND_ALIGNMENT_SYSTEM_INSTRUCTION(brandContext), responseMimeType: 'application/json', responseSchema: BRAND_ALIGNMENT_SCHEMA }
        }),
        parseResponse: (response: any, params: any) => parseJson(response.text, 'brand alignment review'),
        extractTextForReview: (post: GeneratedContent) => {
            switch (post.type) {
                case 'text': return post.vqaResult ? `${post.vqaResult.question}\n\n${post.vqaResult.answer}` : post.caption;
                case 'guided': case 'grounded_text': case 'analysis': return post.content;
                case 'video': return `${post.title}\n\n${post.message}`;
                case 'image': return post.caption;
                case 'ad': case 'alliance_ad': return `Headline: ${post.headline}\n\n${post.primaryText}`;
                case 'google_business_post': return post.postContent;
                case 'blog': return `Title: ${post.title}\n\n${post.body}`;
                case 'prototype': return `Title: ${post.title}\n\n${post.ampBody}`;
                case 'monetized_article_campaign': return `Facebook Post: ${post.fbPost.caption}\n\nArticle: ${post.ampArticle.title}\n${post.ampArticle.ampBody}`;
                case 'seo_blog_post': return post.stage === 'article' && post.body ? `Title: ${post.selectedTitle}\n\n${post.body}` : '';
                default: return '';
            }
        }
    }
};