import { GeneratedContent, MakePostPayload, StrategyData } from '../constants';

export const constructMakePayload = (content: GeneratedContent, scheduleTime: Date | null): MakePostPayload => {
    let caption = '';
    let imageBase64: string | undefined = undefined;
    let hashtags: string[] | undefined = undefined;
    let strategyData: StrategyData | undefined = undefined;
    let videoUrl: string | undefined = undefined;
    let voiceDialog: GeneratedContent extends { type: 'voice_dialog' } ? GeneratedContent['dialog'] : undefined;
    let gmbPostDetails: MakePostPayload['gmbPostDetails'] | undefined = undefined;
    let ampArticleDetails: MakePostPayload['ampArticleDetails'] | undefined = undefined;
    let seoBlogDetails: MakePostPayload['seoBlogDetails'] | undefined = undefined;

    switch (content.type) {
        case 'text':
        case 'grounded_text':
        case 'analysis':
        case 'guided':
            caption = content.content;
            hashtags = content.hashtags;
            break;
        case 'video':
            caption = `${content.title}\n\n${content.message}`;
            hashtags = content.hashtags;
            break;
        case 'image':
        case 'ad':
        case 'alliance_ad':
            caption = content.type === 'image' ? content.caption : `**${content.headline}**\n\n${content.primaryText}\n\nCTA: ${content.callToAction}`;
            hashtags = content.hashtags;
            if (content.imageUrl && content.imageUrl.startsWith('data:image/jpeg;base64,')) {
                imageBase64 = content.imageUrl.split(',')[1];
            }
            break;
        case 'strategy':
            caption = "AI-Generated Content Strategy Plan";
            strategyData = content.strategy;
            break;
        case 'video_generation':
            caption = `Video generated with prompt: "${content.prompt}"`;
            videoUrl = content.videoUrl || undefined;
            break;
        case 'voice_dialog':
            caption = `Voice Dialog for "${content.dialogType}": ${content.scenario}`;
            voiceDialog = content.dialog as any;
            break;
        case 'google_business_post':
            caption = content.postContent;
            if (content.imageUrl && content.imageUrl.startsWith('data:image/jpeg;base64,')) {
                imageBase64 = content.imageUrl.split(',')[1];
            }
            gmbPostDetails = {
                businessName: content.businessName,
                summary: content.postContent,
                callToAction: content.callToAction,
            };
            break;
        case 'blog':
            caption = `**${content.title}**\n\n${content.body}`; // Send title and markdown body
            hashtags = content.hashtags;
            if (content.imageUrl && content.imageUrl.startsWith('data:image/jpeg;base64,')) {
                imageBase64 = content.imageUrl.split(',')[1];
            }
            break;
        case 'monetized_article_campaign':
            caption = content.fbPost.caption;
            hashtags = content.fbPost.hashtags;
            if (content.fbPost.imageUrl && content.fbPost.imageUrl.startsWith('data:image/jpeg;base64,')) {
                imageBase64 = content.fbPost.imageUrl.split(',')[1];
            }
            ampArticleDetails = content.ampArticle;
            break;
        case 'prototype':
            caption = `AMP Article Prototype: ${content.title}`;
            ampArticleDetails = {
                title: content.title,
                ampBody: content.ampBody,
                ctaText: content.ctaText,
            };
            break;
        case 'seo_blog_post':
            if (content.stage === 'article' && content.selectedTitle && content.body) {
                caption = `SEO Blog Post: ${content.selectedTitle}`;
                seoBlogDetails = {
                    title: content.selectedTitle,
                    metaDescription: content.metaDescription || '',
                    tags: content.tags || [],
                    body: content.body,
                };
            } else {
                 caption = `SEO Blog Post Titles Generated`;
            }
            break;
    }

    return {
        caption,
        hashtags,
        imageBase64,
        videoUrl,
        scheduleTime: scheduleTime ? scheduleTime.toISOString() : undefined,
        strategyData,
        voiceDialog,
        postTypeIdentifier: content.type,
        gmbPostDetails,
        ampArticleDetails,
        seoBlogDetails,
    };
};

export async function sendToMakeWebhook(webhookUrl: string, payload: MakePostPayload): Promise<void> {
  if (!webhookUrl.trim() || !webhookUrl.startsWith('https://hook.eu2.make.com/')) {
    throw new Error("Invalid Make.com webhook URL specified.");
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const responseText = await response.text();
        if (response.status === 401) {
            throw new Error("Make.com Error (401): The API Key is invalid or missing. Please check your webhook security settings in Make.com and your MAKE_API_KEY environment variable.");
        }
        if (response.status === 410) {
            throw new Error("Make.com Error (410): The webhook is not active. Please ensure the scenario is turned on in your Make.com dashboard.");
        }
        throw new Error(`Failed to send data to Make.com. Status: ${response.status}. Response: ${responseText}`);
    }
    
    const responseText = await response.text();
    if (responseText.trim().toLowerCase() !== 'accepted') {
       console.warn(`Unexpected success response from Make.com: ${responseText}`);
    }
  } catch (error) {
    console.error("Error sending data to Make.com webhook:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('failed to fetch')) {
             throw new Error("Network Error: Could not connect to Make.com. Please check your internet connection.");
        }
        throw error;
    }
    throw new Error("An unexpected error occurred while sending data to Make.com.");
  }
}