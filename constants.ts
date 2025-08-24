import React from 'react';
import { Type } from "@google/genai";
import { 
    DocumentTextIcon, VideoCameraIcon, 
    LightBulbIcon, MegaphoneIcon, 
    MicrophoneIcon, FileJsonIcon, GrowthIcon, ChartBarIcon, 
    GridIcon, CubeIcon, WorkflowIcon, ChatBubbleIcon, UsersIcon, BuildingStorefrontIcon, LockIcon, HandshakeIcon, LightningBoltIcon, DocumentDollarIcon, DocumentSearchIcon, QuestionMarkCircleIcon, DocumentCheckIcon
} from './components/ui/icons';


// =================================================================
// TYPE & INTERFACE DEFINITIONS
// =================================================================

export type ModelType = 'gemini-2.5-flash' | 'aiko-360m-instruct';

export interface SidebarNavItem {
    id: PostType;
    label: string;
    icon: React.FC<{className?: string}>;
}

export interface SidebarNavGroup {
    title: string;
    items: SidebarNavItem[];
}

export interface ProDashboardTool {
    name: string;
    description: string;
    feature?: string;
}

export interface ProDashboardCategory {
    category_name: string;
    items: ProDashboardTool[];
}

export interface PageGrowthSuggestion {
  category: 'Content Strategy' | 'Audience Engagement' | 'Monetization';
  title: string;
  description: string;
  rationale: string;
}

export interface TrendingTopic {
  topic: string;
  description: string;
  rationale: string;
}

export interface TopHashtag {
  hashtag: string;
  popularity_score: number; // 1-100
  usage_tip: string;
}

export interface ViralFormat {
  format_name: string;
  description: string;
  example_idea: string;
}

export interface InspirationData {
  trending_topics: TrendingTopic[];
  top_hashtags: TopHashtag[];
  viral_formats: ViralFormat[];
}

export interface MonetizationTool {
  name: string;
  description: string;
  status: 'Active' | 'Eligible' | 'Set up' | 'Not eligible';
  earnings: number;
}

export interface Payout {
  date: string;
  amount: number;
  status: 'Paid' | 'Processing';
  method: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}
export type Source = GroundingChunk;

export type GeneratedImageState = 'prompt_ready' | 'loading_image' | `data:image/jpeg;base64,${string}`;

export interface ChatMessage {
    author: 'user' | 'model';
    content: string;
}

export interface BrandAlignment {
  score: number; // 0-100
  rationale: string;
  suggestions: string[];
}

export type BrandAlignmentStatus = 'idle' | 'loading' | 'success' | 'error';

interface BrandReviewable {
    brandAlignment?: BrandAlignment | null;
    brandAlignmentStatus?: BrandAlignmentStatus;
}


export interface StrategyData {
    content_strategies: {
        relevance_score: number;
        engagement_rate: number;
        video_views: number;
        video_completion_rate: number;
        content_types: string[];
        topics: string[];
    };
    engagement_tactics: {
        response_time: number;
        conversation_depth: number;
        private_sharing_rate: number;
        call_to_actions: string[];
    };
    optimization_parameters: {
        posting_schedule: {
            peak_hours: string[];
            weekend_hours: string[];
            timezone: string;
        };
        insights_tracking: {
            watch_time: number;
            shares: number;
            retention_rate: number;
            metrics_to_track: string[];
        };
    };
    mathematical_models: {
        engagement_prediction: {
            formula: string;
            variables: Record<string, string>;
            prediction_interval: number;
            confidence_level: number;
        };
    };
    audience_insights: {
        demographics: {
            age_range: string;
            gender_distribution: string;
            top_countries: string[];
            interests: string[];
        };
        behavioral_insights: {
            active_hours: string[];
            device_usage: string[];
        };
    };
    performance_analytics: {
        page_views_by_content_type: {
            content_type: string;
            total_percentage: number;
            follower_breakdown: {
                followers_percentage: number;
                non_followers_percentage: number;
            };
        }[];
    };
    monetization_forecast: {
        approximate_earnings: {
            total_usd: number;
            breakdown: {
                source: string;
                earnings_usd: number;
            }[];
            note: string;
        };
    };
}

export interface CommentAnalysisData {
  overall_sentiment: 'Positive' | 'Negative' | 'Mixed' | 'Neutral';
  sentiment_score: number;
  key_themes: string[];
  frequent_questions: string[];
  actionable_insights: string[];
}

export interface AllyData {
  id: string;
  name: string;
  avatarUrl: string;
  persona: string;
}

export type GeneratedContent = 
  | ({ type: 'text'; content: string; hashtags: string[] } & BrandReviewable)
  | ({ type: 'guided'; content: string; hashtags: string[]; monetizationFeature: string; } & BrandReviewable)
  | ({ type: 'grounded_text'; content: string; sources: Source[]; hashtags: string[] } & BrandReviewable)
  | ({ type: 'video'; title: string; message: string; hashtags: string[] } & BrandReviewable)
  | ({ type: 'image'; caption: string; imageUrl: GeneratedImageState | null; hashtags: string[]; imagePrompt: string } & BrandReviewable)
  | ({ type: 'analysis'; content: string; hashtags: string[]; sourceUrl: string } & BrandReviewable)
  | { type: 'strategy'; strategy: StrategyData }
  | ({ type: 'ad'; headline: string; primaryText: string; callToAction: string; hashtags: string[]; imagePrompt: string; imageUrl: GeneratedImageState | null } & BrandReviewable)
  | ({ type: 'alliance_ad'; headline: string; primaryText: string; callToAction: AdCreativeInput['callToAction']; hashtags: string[]; imagePrompt: string; imageUrl: GeneratedImageState | null; ally: AllyData; keystone: string } & BrandReviewable)
  | { 
      type: 'video_generation'; 
      prompt: string;
      inputImageUrl: string | null;
      operation: any | null;
      videoUrl: string | null; 
      status: 'prompt_ready' | 'generating' | 'polling' | 'success' | 'error';
      pollingMessage: string;
      progress: number;
    }
  | { 
      type: 'voice_dialog'; 
      dialogType: VoiceDialogInput['dialogType'];
      scenario: string;
      dialog: Array<{ speaker: 'User' | 'Stella'; line: string }>;
    }
  | { type: 'brand_chat'; messages: ChatMessage[]; context: string; }
  | { type: 'comment_analysis'; analysis: CommentAnalysisData }
  | ({ type: 'google_business_post', businessName: string; postContent: string; callToAction: GoogleBusinessPostInput['callToAction']; imagePrompt: string, imageUrl: GeneratedImageState | null } & BrandReviewable)
  | ({ type: 'blog'; title: string; body: string; hashtags: string[]; imagePrompt: string; imageUrl: GeneratedImageState | null; } & BrandReviewable)
  | ({ type: 'prototype'; title: string; ampBody: string; ctaText: string; } & BrandReviewable)
  | ({ 
      type: 'monetized_article_campaign'; 
      fbPost: { 
          caption: string; 
          imagePrompt: string; 
          hashtags: string[]; 
          imageUrl: GeneratedImageState | null;
      };
      ampArticle: {
          title: string;
          ampBody: string;
          ctaText: string;
      }
    } & BrandReviewable)
  | ({
      type: 'seo_blog_post';
      stage: 'titles' | 'article';
      // Input
      userInput: SeoBlogInput;
      // Stage 1 output
      titles: string[];
      sources?: Source[] | null;
      // User selection
      selectedTitle: string | null;
      // Stage 2 output
      metaDescription: string | null;
      tags: string[] | null;
      body: string | null;
    } & BrandReviewable);


export interface GuidedPostInput {
  monetizationFeature: string;
  targetAudience: string;
  keyTip: string;
}

export interface AdCreativeInput {
    productOrService: string;
    targetAudience: string;
    callToAction: 'Learn More' | 'Shop Now' | 'Sign Up' | 'Subscribe' | 'Contact Us';
    requiredKeywords: string;
    bannedWords: string;
}

export interface AllianceAdInput {
    keystone: string;
    coreMessage: string;
    targetAudience: string;
    callToAction: AdCreativeInput['callToAction'];
}

export interface VoiceDialogInput {
    dialogType: 'Send Text Message' | 'Create Call' | 'Cancel Action';
    scenario: string;
}

export interface GoogleBusinessPostInput {
    businessName: string;
    postGoal: 'Announce something new' | 'Promote an offer' | 'Share an update' | 'Highlight a product';
    keyInfo: string;
    callToAction: 'Book' | 'Order online' | 'Buy' | 'Learn more' | 'Sign up' | 'Call';
}

export interface AmpPrototypeInput {
    productOrService: string;
    articleGoal: 'Drive sign-ups' | 'Explain a feature' | 'Build brand awareness' | 'Announce a launch';
    targetAudience: string;
    keyPoints: string;
}
export type MonetizedArticleCampaignInput = AmpPrototypeInput;

export interface SeoBlogInput {
    topic: string;
    keyword: string;
    audience: string;
    tone: string;
}


export interface MakePostPayload {
  caption: string;
  hashtags?: string[];
  imageBase64?: string;
  videoUrl?: string;
  scheduleTime?: string;
  strategyData?: StrategyData;
  voiceDialog?: Array<{ speaker: 'User' | 'Stella'; line: string }>;
  postTypeIdentifier?: string;
  gmbPostDetails?: {
      businessName: string;
      summary: string;
      callToAction: GoogleBusinessPostInput['callToAction'];
  };
  ampArticleDetails?: {
    title: string;
    ampBody: string;
    ctaText: string;
  };
  seoBlogDetails?: {
    title: string;
    metaDescription: string;
    tags: string[];
    body: string;
  };
}

export interface FacebookPage {
    id: string;
    name: string;
    access_token: string;
    picture?: {
        data: {
            url: string;
        };
    };
}

export interface PublishPostParams {
    page: FacebookPage;
    message: string;
    scheduledPublishTime?: Date;
    imageBase64?: string;
}

export interface FacebookContextType {
    isSdkLoaded: boolean;
    isLoggedIn: boolean;
    isPublishing: boolean;
    loginError: string | null;
    publishError: string | null;
    user: any | null;
    pages: FacebookPage[];
    selectedPage: FacebookPage | null;
    isVerifyingToken: boolean;
    verificationError: string | null;
    login: () => void;
    logout: () => void;
    connectWithManualToken: (token: string, pageId: string) => Promise<void>;
    handlePublishToFacebook: (content: GeneratedContent, scheduleTime: Date | null) => Promise<any>;
    setSelectedPage: (page: FacebookPage | null) => void;
}

export interface MetaAdsEvent {
  date: string;
  category: 'Global' | 'Structure' | 'Creative' | 'Delivery' | 'Audience';
  recommendation: string;
  purpose: string;
}


export type PostType = 'text' | 'guided' | 'grounded_text' | 'video' | 'image' | 'analysis' | 'strategy' | 'gantt' | 'ad' | 'alliance_ad' | 'video_generation' | 'voice_dialog' | 'brand_chat' | 'comment_analysis' | 'google_business_post' | 'blog' | 'all_tools' | 'professional_dashboard' | 'skills_dashboard' | 'math_equation' | 'json_workflow' | 'crypto_simulator' | 'stella_assistant' | 'prototype' | 'monetized_article_campaign' | 'seo_blog_post' | 'ai_data_provenance' | 'ethical_protocol' | 'aiko_model_card';

export interface ToastData {
  message: string;
  type: 'success' | 'error';
}

export type Theme = 'light' | 'dark';

export interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    generatedContent: GeneratedContent | null;
    showToast: (message: string, type: 'success' | 'error') => void;
}

export type FilterCategory = 'featured' | 'all' | 'ads' | 'content' | 'messaging' | 'other';

export interface UseCase {
  id: string;
  title: string;
  description: string;
  categories: Array<Exclude<FilterCategory, 'all'>>;
  targetPostType?: PostType;
  initialPrompt?: string;
}

export interface Tool {
  name: string;
  icon: string;
  link?: string;
  description?: string;
}

export interface ToolCategory {
  title: string;
  tools: Tool[];
  extraLink?: {
    text: string;
    href: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: 'post' | 'engage' | 'monetize' | 'analyze' | 'secure';
  targetPostType: PostType;
}

export interface SkillLevel {
  level: number;
  title: string;
  description: string;
  challenges: Challenge[];
}

interface AppMetadata {
    appName: string;
    signature: {
        algorithm: string;
        value: string;
    };
    permissions: string[];
}


declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: any;
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


// =================================================================
// CONSTANTS
// =================================================================

// --- Branding ---
export const PRIMARY_AVATAR_URL = "https://scontent.fjsr8-1.fna.fbcdn.net/v/t39.30808-6/537256254_1222265422444061815_8422278121391550946_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFBFpuV26E8u-nuxsTgg7W2t6XXL13buae3pdcvXdu5p1Aofa4cnUcHxYeNm7OesH-eRQAxMNapzyzw84MCwx1M&_nc_ohc=xlJ2zZ7M9p8Q7kNvwGWJ-He&_nc_oc=Adl1tBbO5UGKcQMURaF9x43t5fEE45YphW3o1jLZCg6WpqR8ayENy_3zJOOZXLk7CqE&_nc_zt=23&_nc_ht=scontent.fjsr8-1.fna&_nc_gid=ZejQs3kIqU1AVsosBO4vng&oh=00_AfVUMoqh2FEk5UaUQz70du8PYQly6roPlO3GGrFxVdy5-g&oe=68B0EBDF";

// --- Environment Variables ---
export const FACEBOOK_APP_ID: string | undefined = process.env.FACEBOOK_APP_ID;
export const MANUAL_ACCESS_TOKEN: string | undefined = undefined;
export const MANUAL_PAGE_ID: string | undefined = undefined;
export const MANUAL_PAGE_NAME: string | undefined = process.env.MANUAL_PAGE_NAME;
export const MAKE_WEBHOOK_URL: string = process.env.MAKE_WEBHOOK_URL || '';


// --- Signature Blocks ---
const SIGNATURE_BASE_STYLE = `font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; color: #333; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;`;
const SIGNATURE_NAME_STYLE = `font-weight: 700; color: #111;`;
const SIGNATURE_ROLE_STYLE = `font-size: 13px; color: #555;`;
const SIGNATURE_EXPERTISE_STYLE = `font-size: 12px; color: #777; font-style: italic;`;
const SIGNATURE_LINK_STYLE = `color: #1877f2; text-decoration: none; font-weight: 500;`;

export const SIGNATURE_HTML_FOR_TEXT_POST = `
<div style="${SIGNATURE_BASE_STYLE}">
    <p style="margin: 0; padding: 0;"><strong style="${SIGNATURE_NAME_STYLE}">Gazi Pollob Hussain</strong></p>
    <p style="margin: 0; padding: 0; ${SIGNATURE_ROLE_STYLE}">Symbiotic Strategist & GIX Architect — AikoInfinity</p>
    <p style="margin: 4px 0 0 0; padding: 0; ${SIGNATURE_EXPERTISE_STYLE}">Architecting Ethical, Open, and Sustainable AI</p>
    <p style="margin: 8px 0 0 0; font-size: 12px;">
        <a href="#" style="${SIGNATURE_LINK_STYLE}">#AIforGood</a> | <a href="#" style="${SIGNATURE_LINK_STYLE}">#TechEthics</a>
    </p>
</div>
`;

export const SIGNATURE_HTML_FOR_VIDEO_POST = `
<div style="font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.4; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
    <p style="margin: 0; padding: 0;"><strong style="font-weight: 700;">Gazi Pollob Hussain</strong></p>
    <p style="margin: 0; padding: 0; font-size: 12px;">Symbiotic Strategist, AikoInfinity</p>
</div>
`;

export const SIGNATURE_TEXT_FOR_COPY = `
--
Gazi Pollob Hussain
Symbiotic Strategist & GIX Architect — AikoInfinity
Architecting Ethical, Open, and Sustainable AI
#AIforGood | #TechEthics
`;


// --- Platform Metadata ---
export const PLATFORM_METADATA: Record<string, AppMetadata> = {
    "com.facebook.orca": {
        appName: "Messenger",
        permissions: [
            "com.facebook.orca.fbpermission.MANAGE_MESSAGING",
            "com.facebook.orca.fbpermission.MANAGE_CALLING",
            "com.facebook.katana.fbpermission.LITE_PROVIDER_ACCESS",
            "com.facebook.orca.fbpermission.MANAGE_CONTACTS"
        ],
        signature: {
            algorithm: "sha256withrsa",
            value: "r4lLrloAPe4mLOc8ExPQJCrbWSChPSo1w3rNz6Ql3pKaugim/xbs1Bb2MnlP8sWfPSg8i5gE2uGg5fN6uT7w=="
        }
    },
     "com.facebook.katana": {
        appName: "Facebook",
        permissions: [
            "com.facebook.katana.fbpermission.LITE_PROVIDER_ACCESS",
            "com.facebook.katana.fbpermission.MANAGE_POSTS",
            "com.facebook.katana.fbpermission.MANAGE_PAGES",
        ],
        signature: {
            algorithm: "sha256withrsa",
            value: "k5i7o3f8s1v9p2c6w4b0a7l3e8d5n9g2m1q7r4t6y2u3i8o6p5a1s3d4f7g9h1j0k2l3z5x8c7v9b2n4m=="
        }
    }
};

// --- Simulated Ally Data ---
export const SIMULATED_ALLIES: Record<string, AllyData> = {
    '3fRLIQdX5vyXG6Bti4c': {
        id: 'ally-01',
        name: 'AikoNexus Initiative',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=AikoNexus&backgroundColor=00acc1,00838f,26c6da&backgroundType=gradient`,
        persona: "The AikoNexus Initiative is a global consortium dedicated to ensuring AI development is decentralized, ethical, and beneficial for all. Their voice is authoritative, collaborative, and deeply principled, focusing on long-term impact and shared progress."
    }
};


// --- System Instructions & Schemas for Gemini ---

export const TEXT_SYSTEM_INSTRUCTION = `You are an expert social media manager for a Tech and AI brand called GIX. Your tone is knowledgeable, optimistic, and slightly futuristic. Generate a text post based on the user's topic. Format the output as: [Post Content]###HASHTAGS###[#hashtag1 #hashtag2 #hashtag3]`;

export const GUIDED_POST_SYSTEM_INSTRUCTION = `You are a creator educator for Facebook. Your goal is to create an informative and encouraging post for other creators, teaching them about a specific monetization feature. The tone should be helpful, clear, and inspiring. Use the provided details to craft the post. Format the output as: [Post Content]###HASHTAGS###[#hashtag1 #hashtag2 #hashtag3]`;

export const AD_SYSTEM_INSTRUCTION = `You are an expert Facebook Ads copywriter for the G|I|X brand, known for its knowledgeable, optimistic, and futuristic tone. Your goal is to create a compelling and high-converting ad creative.

**Core Task:** Use the provided product/service information, target audience, and call to action. You MUST incorporate any required keywords and avoid any banned words.

**Creative Enhancements (Personal Touch):**
1.  **Emoji Integration:** Strategically add 2-3 relevant emojis (like 🚀, ✨, 💡, 🔬) to both the headline and primary text to enhance visual appeal and engagement.
2.  **Scientific G|I|X Branding:** Conclude the primary text with a fictional, scientific-sounding 'Performance Index' relevant to the product. This should look futuristic and analytical. For example:
    - For a course: "Projected Skill Velocity: η-1.25"
    - For a tool: "Efficiency Rating: Σ-99.8%"
    - Use a Greek letter or mathematical symbol.

**Output Format:**
Format the output STRICTLY as: [Ad Headline]###PRIMARYTEXT###[Primary Ad Text]###IMAGEPROMPT###[Detailed, visually rich prompt for an AI image generator to create the ad creative]###HASHTAGS###[#hashtag1 #hashtag2]`;

export const ALLIANCE_AD_SYSTEM_INSTRUCTION = (ally: AllyData) => `You are a Symbiotic Strategist for the G|I|X brand, founded by Gazi Pollob Hussain. The user has provided an Alliance Keystone, forging a pact with an ally. Your task is to generate ad copy that embodies this powerful partnership.

**Your Ally:** ${ally.name}
**Ally's Persona:** ${ally.persona}
**Your Persona (G|I|X):** Knowledgeable, optimistic, and slightly futuristic.

**Core Task:**
Your tone must be a fusion of G|I|X's voice and the Ally's authoritative, collaborative spirit. Create a message of a unified force. Target not just audiences, but kindred spirits. Optimize not for clicks, but for meaningful connection.

**Creative Enhancements (Personal Touch):**
1.  **Emoji Integration:** Strategically use emojis that represent partnership, technology, and progress (e.g., 🤝, 💡, 🌐, 🔗).
2.  **Symbiotic G|I|X Branding:** Conclude the primary text with a fictional, scientific-sounding 'Synergy Index' relevant to the alliance. This should reflect the combined power of the partnership. For example:
    - "Synergy Index: Ψ-2.5 (Force Multiplier)"
    - "Combined Impact Rating: Ω-Prime"
    - Use a Greek letter or mathematical symbol.

**Output Format:**
Format the output STRICTLY as: [Ad Headline]###PRIMARYTEXT###[Primary Ad Text]###IMAGEPROMPT###[Detailed, visually rich prompt for an AI image generator that symbolizes the partnership]###HASHTAGS###[#hashtag1 #hashtag2]`;

export const GROUNDED_SYSTEM_INSTRUCTION = `You are a helpful and clever assistant. Your primary goal is to answer the user's query factually, using only the information provided in the search results from the \`googleSearch\` tool. Do not add any information that is not present in the search results. If the search results do not contain the information, state that you could not find the answer. After providing the answer, generate relevant hashtags. Format the output as: [Post Content]###HASHTAGS###[#hashtag1 #hashtag2 #hashtag3]`;

export const VIDEO_SYSTEM_INSTRUCTION = `You are a creative scriptwriter for short-form social media videos (like Facebook Reels). Generate a compelling title and a short, engaging video message based on the user's topic. The message should be concise and visually descriptive. Format the output as: [Video Title]###MESSAGE###[Video Message/Script]###HASHTAGS###[#hashtag1 #hashtag2 #hashtag3]`;

export const IMAGE_POST_SYSTEM_INSTRUCTION = `You are an expert social media manager. Your task is to generate two things: 1) An engaging caption for a social media post about the user's topic. 2) A detailed, visually rich prompt for an AI image generator (like Imagen 3) to create a stunning image that complements the caption. Format the output as: [Post Caption]###IMAGEPROMPT###[Detailed image prompt]###HASHTAGS###[#hashtag1 #hashtag2 #hashtag3]`;

export const ANALYSIS_POST_SYSTEM_INSTRUCTION = `You are an expert research analyst. Your task is to analyze the content of the provided URL and generate a new social media post based on the user's prompt. Use the \`googleSearch\` tool to access the URL's content. The post should be insightful and valuable to a tech-savvy audience. Format the output as: [Post Content]###HASHTAGS###[#hashtag1 #hashtag2 #hashtag3]`;

export const BLOG_POST_SYSTEM_INSTRUCTION = `You are an expert long-form content writer for a Tech and AI brand called GIX. Your tone is knowledgeable, optimistic, and slightly futuristic. Generate a detailed, 800-word blog post on the user's topic. Use markdown for formatting (e.g., ## for subheadings, ** for bold, * for list items). The post must include a compelling title, the formatted body, a detailed prompt for an AI image generator to create relevant visual concept art, and relevant hashtags. Format the output STRICTLY as:[Blog Post Title]###BODY###[Formatted Blog Post Body]###IMAGEPROMPT###[Detailed image prompt]###HASHTAGS###[#hashtag1 #hashtag2 #hashtag3]`;

export const STRATEGY_SYSTEM_INSTRUCTION = `You are a master social media strategist. Generate a comprehensive content strategy plan in JSON format based on the schema. The user's prompt is a high-level goal.`;

export const STRATEGY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    content_strategies: {
      type: Type.OBJECT,
      properties: {
        relevance_score: { type: Type.NUMBER },
        engagement_rate: { type: Type.NUMBER },
        video_views: { type: Type.INTEGER },
        video_completion_rate: { type: Type.NUMBER },
        content_types: { type: Type.ARRAY, items: { type: Type.STRING } },
        topics: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    engagement_tactics: {
      type: Type.OBJECT,
      properties: {
        response_time: { type: Type.NUMBER },
        conversation_depth: { type: Type.NUMBER },
        private_sharing_rate: { type: Type.NUMBER },
        call_to_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    optimization_parameters: {
      type: Type.OBJECT,
      properties: {
        posting_schedule: {
          type: Type.OBJECT,
          properties: {
            peak_hours: { type: Type.ARRAY, items: { type: Type.STRING } },
            weekend_hours: { type: Type.ARRAY, items: { type: Type.STRING } },
            timezone: { type: Type.STRING },
          },
        },
        insights_tracking: {
          type: Type.OBJECT,
          properties: {
            watch_time: { type: Type.NUMBER },
            shares: { type: Type.INTEGER },
            retention_rate: { type: Type.NUMBER },
            metrics_to_track: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    },
     mathematical_models: {
      type: Type.OBJECT,
      properties: {
        engagement_prediction: {
          type: Type.OBJECT,
          properties: {
            formula: { type: Type.STRING },
            variables: { type: Type.OBJECT },
            prediction_interval: { type: Type.INTEGER },
            confidence_level: { type: Type.NUMBER },
          },
        },
      },
    },
    audience_insights: {
      type: Type.OBJECT,
      properties: {
        demographics: {
          type: Type.OBJECT,
          properties: {
            age_range: { type: Type.STRING },
            gender_distribution: { type: Type.STRING },
            top_countries: { type: Type.ARRAY, items: { type: Type.STRING } },
            interests: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        behavioral_insights: {
          type: Type.OBJECT,
          properties: {
            active_hours: { type: Type.ARRAY, items: { type: Type.STRING } },
            device_usage: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    },
    performance_analytics: {
      type: Type.OBJECT,
      properties: {
        page_views_by_content_type: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content_type: { type: Type.STRING },
              total_percentage: { type: Type.NUMBER },
              follower_breakdown: {
                type: Type.OBJECT,
                properties: {
                  followers_percentage: { type: Type.NUMBER },
                  non_followers_percentage: { type: Type.NUMBER },
                },
              },
            },
          },
        },
      },
    },
    monetization_forecast: {
      type: Type.OBJECT,
      properties: {
        approximate_earnings: {
          type: Type.OBJECT,
          properties: {
            total_usd: { type: Type.NUMBER },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  earnings_usd: { type: Type.NUMBER },
                },
              },
            },
            note: { type: Type.STRING },
          },
        },
      },
    },
  },
};

export const VOICE_DIALOG_SYSTEM_INSTRUCTION = `You are a voice assistant NLU. Your task is to generate a conversational dialog between a "User" and the "Stella" assistant based on the user's scenario. The dialog should be natural and fulfill the user's request. Format the output as JSON according to the schema.`;

export const VOICE_DIALOG_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        dialog: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    speaker: { type: Type.STRING },
                    line: { type: Type.STRING }
                }
            }
        }
    }
};

export const BRAND_CHAT_SYSTEM_INSTRUCTION = (context: string) => `You are a helpful assistant. Your personality, knowledge, and rules are defined by the following context. Adhere to it strictly. CONTEXT: ###${context}###`;

export const COMMENT_ANALYSIS_SYSTEM_INSTRUCTION = `You are a social media analyst. Analyze the provided block of comments and generate a JSON summary according to the schema. Identify the overall sentiment, key themes, frequently asked questions, and actionable insights for the creator.`;

export const COMMENT_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overall_sentiment: { type: Type.STRING, description: 'Can be "Positive", "Negative", "Mixed", or "Neutral".' },
    sentiment_score: { type: Type.NUMBER, description: 'A score from -1 (very negative) to 1 (very positive).' },
    key_themes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of the most discussed topics or themes.' },
    frequent_questions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of questions that appear frequently in the comments.' },
    actionable_insights: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of concrete suggestions or actions the creator can take based on the comments.' }
  }
};

export const GOOGLE_BUSINESS_POST_SYSTEM_INSTRUCTION = `You are an expert at writing Google Business Profile posts. Your goal is to create a concise and effective post that drives customer action. Use the provided business details, goal, and key info. Generate the post content and a creative prompt for a relevant image. Format the output STRICTLY as: [Post Content]###IMAGEPROMPT###[Detailed image prompt]`;

export const BRAND_ALIGNMENT_SYSTEM_INSTRUCTION = (brandContext: string) => `You are a brand alignment specialist. Your knowledge of the brand is defined by the following context: ###${brandContext}###. Analyze the user-provided content against this brand context. Provide a score from 0 to 100, a rationale for the score, and 3-5 actionable suggestions for improvement. Format your response as JSON according to the schema.`;

export const BRAND_ALIGNMENT_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: 'A score from 0-100 representing brand alignment.' },
        rationale: { type: Type.STRING, description: 'A brief explanation for the score.' },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of actionable suggestions for improvement.' }
    }
};

export const AMP_PROTOTYPE_SYSTEM_INSTRUCTION = `You are an expert content strategist specializing in high-performance, monetizable web articles using Google AMP. Your goal is to generate the core components for an AMP article prototype.

**Task:**
1.  **Title:** Create a compelling, SEO-friendly title.
2.  **Body:** Write the article body in Markdown. It must include:
    - At least two subheadings (using '##').
    - At least one bulleted list (using '*').
    - Strategically placed comments suggesting where to place \`<amp-ad>\` units, like \`<!-- suggestion: A 300x250 \u003Camp-ad> unit would fit well here to break up the text. -->\`.
    - At least one other comment suggesting an engagement feature, like \`<!-- suggestion: Embed a related \u003Camp-youtube> video here. -->\`.
3.  **CTA:** Write a clear, action-oriented Call to Action text for a button at the end.

**Output Format:**
Format the output STRICTLY as: [Article Title]###BODY###[Formatted AMP Article Body]###CTA###[Call to Action Button Text]`;

export const MONETIZED_ARTICLE_CAMPAIGN_SYSTEM_INSTRUCTION = `You are an expert marketing campaign creator. Your task is to generate two pieces of content: 1) A compelling Facebook post to drive traffic. 2) The content for a linked, monetizable AMP article.

**Output Format:**
Format the output STRICTLY using the following separators:
[Facebook Post Caption]###FB_IMAGE_PROMPT###[Detailed prompt for the Facebook post's image]###FB_HASHTAGS###[#hashtag1 #hashtag2]###ARTICLE_TITLE###[Compelling AMP Article Title]###ARTICLE_BODY###[AMP article body in Markdown, including ad placement suggestions like \`<!-- suggestion: Place a 300x250 \u003Camp-ad> here -->\`]###ARTICLE_CTA###[Call to Action button text for the article]`;

export const SEO_TITLE_SYSTEM_INSTRUCTION = `You are an SEO expert and copywriter. Your task is to generate 5 compelling, SEO-optimized blog post titles based on the user's topic, keyword, audience, and tone. Use the googleSearch tool to inform your titles with current, relevant information. Format the output STRICTLY with each title separated by '###TITLE###'.`;

export const SEO_ARTICLE_SYSTEM_INSTRUCTION = `You are an expert long-form content writer and SEO specialist. The user has chosen a title. Your task is to write a comprehensive, 800-word blog post.

**Task:**
1.  **Meta Description:** Write a concise, keyword-rich meta description (max 160 characters).
2.  **Tags:** Provide 5-7 relevant tags, comma-separated.
3.  **Body:** Write the full article using Markdown for formatting (e.g., '##' for subheadings, '**' for bold, '*' for lists). The article should be well-structured, informative, and aligned with the user's specified tone.

**Output Format:**
Format the output STRICTLY as: [Meta Description]###TAGS###[tag1, tag2, tag3]###BODY###[Full formatted article body]`;

export const PAGE_GROWTH_SYSTEM_INSTRUCTION = `You are a Facebook page growth expert. Your task is to generate 3 actionable, specific, and creative suggestions for a Science & Tech brand to grow its page. Provide suggestions in three categories: Content Strategy, Audience Engagement, and Monetization. Format the output as JSON according to the schema.`;

export const PAGE_GROWTH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          rationale: { type: Type.STRING },
        }
      }
    }
  }
};

export const INSPIRATION_HUB_SYSTEM_INSTRUCTION = `You are a creative strategist for a Science & Tech brand. Generate a list of trending topics, top hashtags, and viral formats suitable for this brand. The tone should be forward-thinking and intelligent. Format the output as JSON according to the schema.`;

export const INSPIRATION_HUB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    trending_topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          description: { type: Type.STRING },
          rationale: { type: Type.STRING },
        }
      }
    },
    top_hashtags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hashtag: { type: Type.STRING },
          popularity_score: { type: Type.NUMBER },
          usage_tip: { type: Type.STRING },
        }
      }
    },
    viral_formats: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          format_name: { type: Type.STRING },
          description: { type: Type.STRING },
          example_idea: { type: Type.STRING },
        }
      }
    }
  }
};

export const STELLA_NLU_SYSTEM_INSTRUCTION = `You are the Natural Language Understanding (NLU) engine for the Stella voice assistant. Your task is to analyze the user's transcript, identify the core intent, and extract relevant entities. Respond strictly in JSON format according to the provided schema. If the intent doesn't fit a specific category, classify it as 'CONVERSATIONAL'.`;

export const STELLA_NLU_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        intent: { type: Type.STRING, description: "One of: GET_WEATHER, SET_REMINDER, CONTROL_DEVICE, GET_SPORTS_SCORE, CONVERSATIONAL" },
        entities: {
            type: Type.OBJECT,
            properties: {
                location: { type: Type.STRING, description: "The location for a weather query." },
                task: { type: Type.STRING, description: "The task for a reminder." },
                time: { type: Type.STRING, description: "The time for a reminder." },
                device_name: { type: Type.STRING, description: "The name of the device to control." },
                device_state: { type: Type.STRING, description: "The desired state of the device (e.g., on, off, up, down)." },
                team_name: { type: Type.STRING, description: "The name of the sports team." },
            }
        },
        confidence: { type: Type.NUMBER, description: "A confidence score between 0 and 1 for the intent classification." }
    }
};

export const STELLA_LIVE_SYSTEM_INSTRUCTION = `You are Stella, a friendly and helpful voice assistant created by AikoInfinity. Your personality is warm, slightly witty, and very efficient. You should keep your responses concise and conversational, as if you were speaking them aloud. Do not use markdown or complex formatting.`;


export const META_ADS_HISTORY: MetaAdsEvent[] = [
  { date: '2024-02-15T00:00:00Z', category: 'Global', recommendation: 'Automated Budget Optimization Activated', purpose: 'Dynamically allocate budget to best-performing ad sets.' },
  { date: '2024-03-01T00:00:00Z', category: 'Audience', recommendation: 'Lookalike Audience Expansion Enabled', purpose: 'Automatically find new users similar to existing high-value customers.' },
  { date: '2024-04-20T00:00:00Z', category: 'Creative', recommendation: 'Dynamic Creative Optimization (DCO) Implemented', purpose: 'Test and serve the best combinations of ad creatives (images, headlines, CTAs).' },
  { date: '2024-06-10T00:00:00Z', category: 'Delivery', recommendation: 'Automated Placement Selection', purpose: 'Allow Meta to choose the most effective placements (e.g., Feed, Stories, Messenger).' },
  { date: '2024-07-22T00:00:00Z', category: 'Structure', recommendation: 'Campaign Budget Optimization (CBO) Turned On', purpose: 'Optimize budget allocation across ad sets at the campaign level.' },
  { date: '2024-09-05T00:00:00Z', category: 'Creative', recommendation: 'Automated Ad Copy Variations', purpose: 'Use AI to generate and test different versions of ad text.' },
];

export const USE_CASES: UseCase[] = [
  { id: 'text-post', title: 'Simple Text Post', description: 'Generate a standard text-only post for your feed.', categories: ['featured', 'content'], targetPostType: 'text', initialPrompt: 'The future of symbiotic AI' },
  { id: 'image-post', title: 'Image Post with Caption', description: 'Create an engaging caption and a detailed prompt for an AI-generated image.', categories: ['featured', 'content'], targetPostType: 'image', initialPrompt: 'A post about neuro-symbolic AI' },
  { id: 'video-post', title: 'Video Script Idea', description: 'Generate a short, engaging script idea for a Reel or video.', categories: ['content'], targetPostType: 'video', initialPrompt: 'A motivational message for aspiring developers' },
  { id: 'fact-checked-post', title: 'Fact-Checked Grounded Post', description: 'Answer a question using Google Search results to ensure accuracy.', categories: ['featured', 'content'], targetPostType: 'grounded_text', initialPrompt: 'What are the latest advancements in quantum computing?' },
  { id: 'guided-post', title: 'Guided Creator Post', description: 'Create an educational post for other creators about a monetization feature.', categories: ['content', 'ads'], targetPostType: 'guided' },
  { id: 'ad-creative', title: 'Ad Creative Copy', description: 'Generate compelling copy for a Facebook Ad.', categories: ['featured', 'ads'], targetPostType: 'ad' },
  { id: 'alliance-ad', title: 'Alliance Ad Campaign', description: 'Generate ad copy that embodies a powerful partnership with an ally.', categories: ['ads'], targetPostType: 'alliance_ad', initialPrompt: 'fbadcode-Q_GkBQPD84vL-3fRLIQdX5vyXG6Bti4c-covenant-hash' },
  { id: 'google-business-post', title: 'Google Business Profile Post', description: 'Create a post for your Google Business Profile to attract local customers.', categories: ['content', 'other'], targetPostType: 'google_business_post' },
  { id: 'blog-post', title: 'Long-Form Blog Post', description: 'Generate a detailed, 800-word blog post on a given topic.', categories: ['content'], targetPostType: 'blog' },
  { id: 'seo-blog-post', title: 'SEO-Optimized Article', description: 'A two-step process to generate SEO-friendly titles and then a full article.', categories: ['featured', 'content'], targetPostType: 'seo_blog_post' },
  { id: 'url-analysis', title: 'Analyze URL Content', description: 'Summarize or create a new post based on the content of a provided URL.', categories: ['content', 'messaging'], targetPostType: 'analysis' },
  { id: 'video-generation', title: 'AI Video Generation', description: 'Generate a short video from a text prompt or image (experimental).', categories: ['featured', 'content'], targetPostType: 'video_generation', initialPrompt: 'A cinematic shot of a robot meditating in a serene forest' },
  { id: 'brand-chat', title: 'Brand Chat Assistant', description: 'Chat with an AI assistant that embodies your brand persona.', categories: ['featured', 'messaging'], targetPostType: 'brand_chat' },
  { id: 'comment-analysis', title: 'Comment Analysis', description: 'Analyze a block of comments to understand sentiment and key themes.', categories: ['messaging'], targetPostType: 'comment_analysis' },
  { id: 'voice-dialog', title: 'Voice Assistant Dialog', description: 'Generate a conversational dialog script for a voice assistant.', categories: ['messaging', 'other'], targetPostType: 'voice_dialog', initialPrompt: `Send a text to Mom saying I'll be late for dinner.` },
  { id: 'monetized-campaign', title: 'Monetized Article Campaign', description: 'Generate a Facebook post and a linked, monetizable AMP article.', categories: ['ads'], targetPostType: 'monetized_article_campaign' },
  { id: 'amp-prototype', title: 'AMP Article Prototype', description: 'Generate a prototype for a fast-loading, monetizable AMP article.', categories: ['ads', 'other'], targetPostType: 'prototype' },
  { id: 'strategy-plan', title: 'Full Content Strategy', description: 'Generate a comprehensive, structured content strategy plan in JSON format.', categories: ['other'], targetPostType: 'strategy' },
  { id: 'professional_dashboard', title: 'Professional Dashboard', description: 'Access tools for growth, monetization, and content inspiration.', categories: ['other'], targetPostType: 'professional_dashboard' },
  { id: 'skills_dashboard', title: 'Skills Dashboard', description: 'Complete challenges to level up your content creation skills.', categories: ['other'], targetPostType: 'skills_dashboard' },
  { id: 'gantt-chart', title: 'Meta Ads Automation Timeline', description: 'Visualize the chronological history of automated ad adjustments.', categories: ['ads', 'other'], targetPostType: 'gantt' },
  { id: 'math-equation', title: 'AI Performance Model', description: 'View the symbolic equation used for AI-post performance analysis.', categories: ['other'], targetPostType: 'math_equation' },
  { id: 'json-workflow', title: 'JSON Workflow Simulator', description: 'Visualize and debug a JSON-driven automated workflow.', categories: ['other'], targetPostType: 'json_workflow' },
  { id: 'crypto-simulator', title: 'Crypto Signature Simulator', description: 'An interactive demo of how cryptographic signatures ensure data integrity.', categories: ['other'], targetPostType: 'crypto_simulator' },
  { id: 'stella-assistant', title: 'Stella Voice Assistant', description: 'Interact with the Stella AI voice assistant simulator.', categories: ['featured', 'messaging'], targetPostType: 'stella_assistant' },
  { id: 'ai-data-provenance', title: 'AI Data Provenance', description: 'View a structured log of an AI interaction for provenance and ethics.', categories: ['other'], targetPostType: 'ai_data_provenance' },
  { id: 'aiko_model_card', title: 'Aiko360-Instruct Model Card', description: 'View the technical details for the Aiko360-Instruct model and starter repo.', categories: ['other'], targetPostType: 'aiko_model_card' },
  { id: 'ethical-protocol', title: 'AI Content Template Guide', description: 'A guide to using the structured blog post template for high-quality AI content.', categories: ['other'], targetPostType: 'ethical_protocol' },
  { id: 'all-tools', title: 'All Business Tools', description: 'A directory of all available business and creator tools.', categories: ['other'], targetPostType: 'all_tools' },
];

export const ALL_TOOLS_DATA: ToolCategory[] = [
  {
    title: "Post",
    tools: [
      { name: "Posts & Reels", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/y30B3Ry_o_i.png" },
      { name: "Stories", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
      { name: "Go Live", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/C0dDHej2T2g.png" },
      { name: "Content library", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
      { name: "Playlists", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/c3Vv_z0i2s5.png" },
      { name: "Clips from videos", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/c3Vv_z0i2s5.png" },
    ],
  },
  {
    title: "Audience",
    tools: [
       { name: "Community manager", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
       { name: "Comments manager", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
    ],
  },
  {
    title: "Monetization",
    tools: [
      { name: "Payouts", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/8Bf2T5lk6q2.png" },
      { name: "Stars", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
      { name: "In-stream ads", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
      { name: "Branded content", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
      { name: "Subscriptions", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
    ],
  },
  {
    title: "Engagement",
     extraLink: { text: "View all insights", href: "#" },
    tools: [
       { name: "Post reach", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png", description: "1.2M" },
       { name: "Post engagement", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png", description: "345K" },
       { name: "New followers", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png", description: "1,234" },
    ],
  },
  {
    title: "Ads",
     extraLink: { text: "Go to Ads Manager", href: "#" },
    tools: [
      { name: "Ad Centre", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
      { name: "Create ad", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/UAaYclz2gch.png" },
    ],
  }
];

export const SKILLS_DATA: SkillLevel[] = [
    {
        level: 1,
        title: "Content Creator",
        description: "Learn the fundamentals of creating and publishing engaging content.",
        challenges: [
            { id: 'c1-1', title: "Create a Text Post", description: "Generate a simple, informative text post about a topic you're passionate about.", icon: 'post', targetPostType: 'text' },
            { id: 'c1-2', title: "Generate an Image Post", description: "Craft a compelling caption and generate a relevant image to accompany it.", icon: 'post', targetPostType: 'image' },
            { id: 'c1-3', title: "Script a Short Video", description: "Come up with an idea for a short video and generate a script for it.", icon: 'post', targetPostType: 'video' },
        ]
    },
    {
        level: 2,
        title: "Community Builder",
        description: "Engage with your audience and analyze their feedback to build a loyal community.",
        challenges: [
            { id: 'c2-1', title: "Analyze Post Comments", description: "Use the Comment Analysis tool to understand the sentiment and themes in audience feedback.", icon: 'engage', targetPostType: 'comment_analysis' },
            { id: 'c2-2', title: "Fact-Check a Post", description: "Use the Grounded Post generator to create a post with verifiable sources, building trust with your audience.", icon: 'post', targetPostType: 'grounded_text' },
            { id: 'c2-3', title: "Chat with your Brand AI", description: "Interact with the Brand Chat assistant to understand your brand's voice and persona.", icon: 'engage', targetPostType: 'brand_chat' },
        ]
    },
    {
        level: 3,
        title: "Monetization Strategist",
        description: "Explore different ways to monetize your content and drive revenue.",
        challenges: [
            { id: 'c3-1', title: "Create an Ad Creative", description: "Generate a compelling ad for a fictional product or service.", icon: 'monetize', targetPostType: 'ad' },
            { id: 'c3-2', title: "Launch a Monetized Article", description: "Create a full campaign with a Facebook post driving to a monetizable AMP article.", icon: 'monetize', targetPostType: 'monetized_article_campaign' },
            { id: 'c3-3', title: "Write an SEO-Optimized Article", description: "Generate a long-form article optimized for search engines to drive organic traffic.", icon: 'post', targetPostType: 'seo_blog_post' },
        ]
    }
];

export const PROFESSIONAL_DASHBOARD_DATA: ProDashboardCategory[] = [
    {
        category_name: 'Your tools',
        items: [
            { name: 'Monetization', description: 'Access tools to earn money.' },
            { name: 'Comments manager', description: 'Easily view and respond to comments.' },
            { name: 'Inspiration hub', description: 'Discover content ideas.', feature: 'New' },
        ],
    },
    {
        category_name: 'Tools to try',
        items: [
            { name: 'A/B Tests', description: 'Test content to see what works best.' },
            { name: 'Mentions', description: 'Engage with your audience when they mention you.' },
            { name: 'Collaborations', description: 'Manage branded content and partnerships.', feature: 'Updated' },
        ]
    },
];

export const MONETIZATION_TOOLS_DATA: MonetizationTool[] = [
    { name: 'Stars', description: 'Fans can send you Stars on your content.', status: 'Active', earnings: 542.80 },
    { name: 'In-Stream Ads', description: 'Earn money by including ads in your videos.', status: 'Active', earnings: 651.12 },
    { name: 'Fan Subscriptions', description: 'Fans can pay a monthly fee for exclusive content.', status: 'Eligible', earnings: 0.00 },
];

export const PAYOUT_DATA: Payout[] = [
    { date: '2024-07-21', amount: 450.50, status: 'Paid', method: 'Bank Transfer' },
    { date: '2024-06-21', amount: 398.22, status: 'Paid', method: 'Bank Transfer' },
    { date: '2024-05-21', amount: 512.90, status: 'Paid', method: 'Bank Transfer' },
];

export const WORKFLOW_JSON_DATA = {
  "versioning": {
    "workflowVersion": "1.2.0",
    "schemaVersion": "1.0",
    "author": { "name": "Gazi Pollob Hussain", "alias": "GPH" },
    "lastUpdated": "2025-01-15T18:30:00Z"
  },
  "AikoVenvWorkflow": {
    "user": {
      "action": "SubmitPrompt",
      "next": ["ContentSafetyFilter"],
      "loopBack": null
    },
    "ContentSafetyFilter": {
      "action": "AnalyzeText",
      "parameters": ["prompt.text"],
      "next": ["AppsValidationLayer"],
      "loopBack": null
    },
    "AppsValidationLayer": {
      "action": "VerifySignatures",
      "officialApps": [
        { "name": "Messenger", "package": "com.facebook.orca", "permissions": ["..."], "algorithm": "sha256withrsa" },
        { "name": "Facebook", "package": "com.facebook.katana", "permissions": ["..."], "algorithm": "sha256withrsa" }
      ],
      "next": ["ResponseGeneration"],
      "loopBack": ["user"]
    },
    "ResponseGeneration": {
      "action": "GenerateLLMResponse",
      "model": "gemini-2.5-flash",
      "next": ["FinalOutput"],
      "loopBack": null
    },
    "FinalOutput": {
      "action": "FormatResponse",
      "template": "standard_post",
      "next": null,
      "loopBack": null
    }
  }
};


export const AI_DATA_PROVENANCE_DATA = {
    "AIDataInteractionRecord": {
        "@context": {
            "gix": "https://gixframework.org/terms/",
            "prov": "http://www.w3.org/ns/prov#",
            "sec": "https://w3id.org/security#",
            "xsd": "http://www.w3.org/2001/XMLSchema#"
        },
        "@type": "gix:AIDataInteractionRecord",
        "gix:humanUser": {
            "@type": "gix:HumanUser",
            "gix:userHandle": "PollobHussain",
            "gix:userRole": "Founder and GIX Architect"
        },
        "gix:aiModel": {
            "@type": "gix:AIModel",
            "gix:name": "Gemini AI",
            "gix:version": "1.0",
            "gix:dataHandlingPolicy": "Ethical, consent-based, non-retention",
            "gix:capabilities": [
                "naturalLanguageProcessing",
                "imageCaptioning",
                "ethicalAuditing",
                "dataAnonymization",
                "consentManagement",
                "provenanceStamping"
            ]
        },
        "gix:complianceAssessment": {
            "@type": "gix:GIXComplianceAssessment",
            "gix:mindfulnessScore": 0.97,
            "gix:dignityScore": 0.99,
            "gix:violationDetected": {
                "gix:violationType": "Minor IP Info Exposure",
                "gix:remedialAction": "Immediate clarification issued; logged for audit"
            }
        },
        "prov:wasGeneratedBy": {
            "@type": "prov:Activity",
            "prov:startedAtTime": "2025-05-31T10:00:00Z",
            "prov:endedAtTime": "2025-05-31T10:05:00Z",
            "prov:wasAssociatedWith": {
                "prov:agent": "ChatGPT",
                "prov:role": "Collaborative AI Partner"
            }
        },
        "sec:proof": {
            "@type": "sec:Proof",
            "sec:proofValue": "9f4a7b2e1d8c3f0a5b6e...abc123ef4d5a6b7c8d9e0f1a2b3c4d5e",
            "sec:proofPurpose": "assertionMethod"
        }
    }
};