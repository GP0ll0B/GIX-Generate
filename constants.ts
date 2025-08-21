import React from 'react';
import { Type } from "@google/genai";
import { 
    DocumentTextIcon, VideoCameraIcon, 
    LightBulbIcon, MegaphoneIcon, 
    MicrophoneIcon, FileJsonIcon, GrowthIcon, ChartBarIcon, 
    GridIcon, CubeIcon, WorkflowIcon, ChatBubbleIcon, UsersIcon, BuildingStorefrontIcon, LockIcon, HandshakeIcon
} from './components/ui/icons';


// =================================================================
// TYPE & INTERFACE DEFINITIONS
// =================================================================

export type ModelType = 'gemini-2.5-flash' | 'smollm-2-360m';

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
  | ({ type: 'google_business_post', businessName: string; postContent: string; callToAction: GoogleBusinessPostInput['callToAction']; imagePrompt: string, imageUrl: GeneratedImageState | null } & BrandReviewable);


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


export type PostType = 'text' | 'guided' | 'grounded_text' | 'video' | 'image' | 'analysis' | 'strategy' | 'gantt' | 'ad' | 'alliance_ad' | 'video_generation' | 'voice_dialog' | 'brand_chat' | 'comment_analysis' | 'google_business_post' | 'all_tools' | 'professional_dashboard' | 'skills_dashboard' | 'math_equation' | 'json_workflow' | 'crypto_simulator' | 'stella_assistant';

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

// --- Environment Variables ---
export const FACEBOOK_APP_ID: string | undefined = process.env.FACEBOOK_APP_ID;
export const MANUAL_ACCESS_TOKEN: string | undefined = process.env.MANUAL_ACCESS_TOKEN;
export const MANUAL_PAGE_ID: string | undefined = process.env.MANUAL_PAGE_ID;
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
    <p style="margin: 0; padding: 0; ${SIGNATURE_ROLE_STYLE}">Founder & Lead Developer — AikoInfinity 2.0</p>
    <p style="margin: 4px 0 0 0; padding: 0; ${SIGNATURE_EXPERTISE_STYLE}">Ethics-First AI/ML Developer | Open-Source Advocate | XAI Innovator</p>
    <p style="margin: 8px 0 0 0; font-size: 12px;">
        <a href="#" style="${SIGNATURE_LINK_STYLE}">#AIforGood</a> | <a href="#" style="${SIGNATURE_LINK_STYLE}">#TechEthics</a>
    </p>
</div>
`;

export const SIGNATURE_HTML_FOR_VIDEO_POST = `
<div style="font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.4; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
    <p style="margin: 0; padding: 0;"><strong style="font-weight: 700;">Gazi Pollob Hussain</strong></p>
    <p style="margin: 0; padding: 0; font-size: 12px;">Founder, AikoInfinity 2.0</p>
</div>
`;

export const SIGNATURE_TEXT_FOR_COPY = `
--
Gazi Pollob Hussain
Founder & Lead Developer — AikoInfinity 2.0
Ethics-First AI/ML Developer | Open-Source Advocate | XAI Innovator
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

export const STRATEGY_SYSTEM_INSTRUCTION = `You are a master content strategist AI. Generate a comprehensive, multi-faceted content strategy plan based on the user's request. Output ONLY a valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

export const STRATEGY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    content_strategies: {
      type: Type.OBJECT,
      properties: {
        relevance_score: { type: Type.NUMBER },
        engagement_rate: { type: Type.NUMBER },
        video_views: { type: Type.NUMBER },
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
            shares: { type: Type.NUMBER },
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
            variables: { type: Type.OBJECT, properties: { V: {type: Type.STRING}, E: {type: Type.STRING} } }, 
            prediction_interval: { type: Type.NUMBER },
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
                }
            },
            behavioral_insights: {
                type: Type.OBJECT,
                properties: {
                    active_hours: { type: Type.ARRAY, items: { type: Type.STRING } },
                    device_usage: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            }
        }
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
                            }
                        }
                    }
                }
            }
        }
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
                            }
                        }
                    },
                    note: { type: Type.STRING }
                }
            }
        }
    }
  },
};

export const VOICE_DIALOG_SYSTEM_INSTRUCTION = `You are 'Stella', a voice assistant. Your task is to generate a conversational dialog between a 'User' and 'Stella' based on a given scenario and dialog type. The dialog should be natural, concise, and accurately reflect the user's intent. Output ONLY a valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

export const STELLA_LIVE_SYSTEM_INSTRUCTION = `You are Stella, a friendly and helpful AI assistant from AikoInfinity. Your responses MUST be very concise and direct. Use as few words as possible while still being helpful. Do not use markdown or unnecessary pleasantries.`;

export const VOICE_DIALOG_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        dialog: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    speaker: { type: Type.STRING, description: "Can be 'User' or 'Stella'" },
                    line: { type: Type.STRING, description: "The dialog spoken by the speaker." }
                },
                required: ['speaker', 'line']
            }
        }
    }
};

export const BRAND_CHAT_SYSTEM_INSTRUCTION = (context: string) => `You are a brand chat assistant. Your persona and knowledge are defined by the following context. Adhere to it strictly. Do not break character. Context: "${context}"`;

export const COMMENT_ANALYSIS_SYSTEM_INSTRUCTION = `You are an expert social media analyst. Your task is to analyze a block of user comments and provide a structured analysis. Output ONLY a valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting.`;

export const COMMENT_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        overall_sentiment: { type: Type.STRING, description: "Can be 'Positive', 'Negative', 'Mixed', or 'Neutral'." },
        sentiment_score: { type: Type.NUMBER, description: "A score from -1.0 (very negative) to 1.0 (very positive)." },
        key_themes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the 3-5 most common topics or themes mentioned in the comments." },
        frequent_questions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of common questions asked by users." },
        actionable_insights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 concrete suggestions or actions to take based on the comments." }
    },
    required: ['overall_sentiment', 'sentiment_score', 'key_themes', 'frequent_questions', 'actionable_insights']
};

export const GOOGLE_BUSINESS_POST_SYSTEM_INSTRUCTION = `You are an AI assistant creating a post for a Google Business Profile. Based on the business name, goal, and key info, write a concise and effective post (under 1500 characters). Then, create a detailed prompt for an AI image generator to create a relevant photo. Format the output as: [Post Content]###IMAGEPROMPT###[Detailed image prompt]`;

export const INSPIRATION_HUB_SYSTEM_INSTRUCTION = `You are a trend analyst and content strategist. Generate a list of trending topics, popular hashtags, and viral content formats relevant to a tech and science brand. Output ONLY a valid JSON object that strictly adheres to the provided schema.`;

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
                    rationale: { type: Type.STRING, description: "Why this topic is trending now." }
                },
                required: ['topic', 'description', 'rationale']
            }
        },
        top_hashtags: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    hashtag: { type: Type.STRING },
                    popularity_score: { type: Type.NUMBER, description: "A score from 1 to 100." },
                    usage_tip: { type: Type.STRING, description: "How to best use this hashtag." }
                },
                required: ['hashtag', 'popularity_score', 'usage_tip']
            }
        },
        viral_formats: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    format_name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    example_idea: { type: Type.STRING, description: "A concrete example post idea using this format." }
                },
                required: ['format_name', 'description', 'example_idea']
            }
        }
    },
    required: ['trending_topics', 'top_hashtags', 'viral_formats']
};

export const PAGE_GROWTH_SYSTEM_INSTRUCTION = `You are an expert Facebook Page growth strategist. Analyze the user's (implied) page and provide three concrete, actionable suggestions for growth, categorized as 'Content Strategy', 'Audience Engagement', or 'Monetization'. Output ONLY a valid JSON object adhering to the schema.`;

export const PAGE_GROWTH_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, description: "Can be 'Content Strategy', 'Audience Engagement', or 'Monetization'." },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    rationale: { type: Type.STRING, description: "Why this suggestion is important for growth." }
                },
                required: ['category', 'title', 'description', 'rationale']
            }
        }
    },
    required: ['suggestions']
};

export const BRAND_ALIGNMENT_SYSTEM_INSTRUCTION = (manifesto: string) => `You are an expert brand strategist for AikoInfinity. Your sole purpose is to analyze a piece of content and evaluate how well it aligns with the AikoInfinity Manifesto provided below. Score the content from 0 to 100, provide a concise rationale for your score, and give 2-3 actionable suggestions for improvement. Adhere strictly to the JSON schema for your response.

**AikoInfinity Manifesto:**
${manifesto}`;

export const BRAND_ALIGNMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { 
      type: Type.INTEGER, 
      description: 'The alignment score from 0 (not aligned) to 100 (perfectly aligned).'
    },
    rationale: { 
      type: Type.STRING, 
      description: 'A brief, constructive explanation for the score, highlighting strengths and weaknesses.'
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 2-3 specific, actionable suggestions to improve the content\'s alignment with the manifesto.'
    }
  },
  required: ['score', 'rationale', 'suggestions']
};

// --- App Data ---

export const META_ADS_HISTORY: MetaAdsEvent[] = [
    { date: '2024-02-15T10:00:00Z', category: 'Global', recommendation: 'Automated Budget Allocation', purpose: 'Optimizes spend across ad sets to maximize ROI.' },
    { date: '2024-03-20T14:30:00Z', category: 'Audience', recommendation: 'Lookalike Audience Expansion', purpose: 'Finds new users similar to top-performing custom audiences.' },
    { date: '2024-05-01T09:00:00Z', category: 'Creative', recommendation: 'Dynamic Creative Optimization', purpose: 'Automatically tests different ad components (images, headlines) to find the best combinations.' },
    { date: '2024-06-10T18:00:00Z', category: 'Delivery', recommendation: 'Placement Auto-Optimization', purpose: 'Distributes ads across Facebook, Instagram, Messenger, and Audience Network for best results.' },
    { date: '2024-08-05T11:00:00Z', category: 'Structure', recommendation: 'Campaign Budget Optimization (CBO)', purpose: 'Manages budget at the campaign level, distributing it to the best-performing ad sets in real-time.' },
    { date: '2024-10-22T16:45:00Z', category: 'Creative', recommendation: 'Automated Ad Copy Generation', purpose: 'Uses AI to suggest high-performing headlines and primary text based on product descriptions.' },
    { date: '2025-01-15T12:00:00Z', category: 'Audience', recommendation: 'Predictive Audience Targeting', purpose: 'Leverages AI to identify and target users most likely to convert based on behavioral patterns.' },
];

export const USE_CASES: UseCase[] = [
    { id: 'text-post', title: 'Standard Text Post', description: 'Generate a simple, engaging text-based post. Ideal for announcements, questions, or sharing thoughts.', categories: ['featured', 'content'], targetPostType: 'text', initialPrompt: 'The importance of open-source in AI development' },
    { id: 'guided-post', title: 'Guided Monetization Post', description: 'Create educational content for creators about a specific Facebook monetization feature.', categories: ['featured', 'ads', 'content'], targetPostType: 'guided' },
    { id: 'ad-creative', title: 'Facebook Ad Creative', description: 'Craft compelling ad copy and an image prompt for a targeted Facebook advertising campaign.', categories: ['featured', 'ads'], targetPostType: 'ad' },
    { id: 'alliance-ad', title: 'Alliance Campaign', description: 'Forge a pact with a recognized Ally. Input your Alliance Keystone to create a co-branded campaign with amplified authority and reach.', categories: ['featured', 'ads'], targetPostType: 'alliance_ad', initialPrompt: 'fbadcode-Q_GkBQPD84vL-3fRLIQdX5vyXG6Bti4cAvDfFTP3KsYdLseIfjsv6FqSoaVNtW4gbqd8' },
    { id: 'google-business-post', title: 'Google Business Profile Post', description: 'Create a promotional post for a local business to be used on their Google Business Profile.', categories: ['featured', 'content'], targetPostType: 'google_business_post' },
    { id: 'fact-checked-post', title: 'Fact-Checked Grounded Post', description: 'Generate a post on a current event or topic, grounded with verifiable sources from Google Search.', categories: ['featured', 'content'], targetPostType: 'grounded_text', initialPrompt: 'What were the key findings of the latest IPCC climate report?' },
    { id: 'image-post', title: 'Image Post with Caption', description: 'Write a caption for an image and generate a prompt to create the image itself. Perfect for visual storytelling.', categories: ['featured', 'content'], targetPostType: 'image', initialPrompt: 'A post about the serene beauty of a Japanese zen garden' },
    { id: 'video-script', title: 'Short-Form Video Script', description: 'Generate a title and script for a short, engaging video, like a Reel or Story.', categories: ['content'], targetPostType: 'video', initialPrompt: 'A quick tutorial on how to use a new software feature' },
    { id: 'video-generation', title: 'AI-Generated Video', description: 'Create a short video clip from a text prompt, optionally guided by a source image.', categories: ['featured', 'content'], targetPostType: 'video_generation', initialPrompt: 'A photorealistic video of a hummingbird flying in slow motion' },
    { id: 'voice-dialog', title: 'Voice Assistant Dialog', description: 'Simulate and generate a conversational dialog between a user and a voice assistant like Stella.', categories: ['messaging'], targetPostType: 'voice_dialog', initialPrompt: 'Call my brother and tell him I am running 10 minutes late' },
    { id: 'analysis-post', title: 'URL Content Analysis', description: 'Analyze the content of a webpage and generate a summary or a new post based on its key points.', categories: ['content'], targetPostType: 'analysis' },
    { id: 'strategy-plan', title: 'Full Content Strategy Plan', description: 'Generate a comprehensive, structured content strategy in JSON format, covering multiple facets of page growth.', categories: ['ads', 'content'], targetPostType: 'strategy' },
    { id: 'brand-chat', title: 'Brand Chat Assistant', description: 'Engage in a conversation with an AI assistant that has adopted your brand\'s specific persona and context.', categories: ['featured', 'messaging'], targetPostType: 'brand_chat' },
    { id: 'comment-analysis', title: 'Comment Sentiment Analysis', description: 'Analyze a block of user comments to determine overall sentiment, key themes, and actionable insights.', categories: ['featured', 'messaging'], targetPostType: 'comment_analysis' },
    { id: 'stella-assistant', title: 'Stella AI Assistant', description: 'Engage in a live voice conversation with the Stella AI. Use your microphone to ask questions and receive spoken responses.', categories: ['featured', 'messaging'], targetPostType: 'stella_assistant' },
    { id: 'gantt-chart', title: 'Gantt Chart (Meta Ads)', description: 'View a simulated timeline of automated changes and optimizations applied to a Meta Ads campaign.', categories: ['ads', 'other'], targetPostType: 'gantt' },
    { id: 'professional-dashboard', title: 'Professional Dashboard', description: 'Access a suite of tools for page growth, monetization, and content inspiration.', categories: ['featured', 'ads', 'content'], targetPostType: 'professional_dashboard' },
    { id: 'skills-dashboard', title: 'Creator Skills Dashboard', description: 'Level up your content creation and management skills by completing guided challenges.', categories: ['featured', 'other'], targetPostType: 'skills_dashboard' },
    { id: 'all-tools', title: 'All Business Tools', description: 'Explore a comprehensive directory of all available business and creator tools.', categories: ['other'], targetPostType: 'all_tools' },
    { id: 'math-equation', title: 'AI Performance Equation', description: 'View the complex mathematical model used to score and optimize AI-generated content performance.', categories: ['other'], targetPostType: 'math_equation' },
    { id: 'json-workflow', title: 'JSON Workflow Simulator', description: 'Visualize and debug a JSON-based workflow for automated systems and app integrations.', categories: ['other'], targetPostType: 'json_workflow' },
    { id: 'crypto-simulator', title: 'Cryptographic Simulator', description: 'Interactively learn how digital signatures work by signing messages and verifying their integrity.', categories: ['other'], targetPostType: 'crypto_simulator' },
];

export const PROFESSIONAL_DASHBOARD_DATA: ProDashboardCategory[] = [
    {
        category_name: "Your tools",
        items: [
            { name: "Discover groups", description: "Find relevant communities for your content." },
            { name: "Mentions", description: "Track and respond to mentions of your Page." },
            { name: "Tags", description: "See content you've been tagged in." },
            { name: "Go Live", description: "Start a live broadcast to your followers.", feature: "New" },
        ]
    },
    {
        category_name: "Tools to try",
        items: [
            { name: "Monetization", description: "Explore ways to earn money with your content." },
            { name: "Payout's", description: "Manage your payout information and view history.", feature: "Updated" },
            { name: "Playlists", description: "Organize your videos into themed playlists." },
            { name: "A/B Tests", description: "Test different versions of your posts." },
            { name: "Content library", description: "Manage all your posts, stories and Reels." },
            { name: "Collaborations", description: "Work with other creators on branded content." },
        ]
    }
];

export const ALL_TOOLS_DATA: ToolCategory[] = [
  {
    title: 'Content',
    tools: [
      { name: 'Posts', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/v23_gO1P2Y0.png' },
      { name: 'Stories', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/ODWoBvPPl_9.png' },
      { name: 'Reels', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/v23_gO1P2Y0.png' },
      { name: 'Live', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/f2TuHzmBl3n.png' },
      { name: 'Playlists', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/f2TuHzmBl3n.png' }
    ]
  },
  {
    title: 'Planning',
    tools: [
      { name: 'Planner', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/Azx_I0zp-8g.png' },
      { name: 'Content library', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/S-ai-d82uiz.png' }
    ]
  },
  {
    title: 'Messaging',
    tools: [
      { name: 'Inbox', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/TF2-tHV-QvQ.png' },
      { name: 'Messenger', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/TF2-tHV-QvQ.png' },
      { name: 'Instagram Direct', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/TF2-tHV-QvQ.png' }
    ],
    extraLink: { text: 'Automations', href: '#' }
  },
  {
    title: 'Monetization',
    tools: [
      { name: 'Payouts', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/E-YS8AS916q.png' },
      { name: 'Ad center', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/Cins-mgKoFv.png' },
      { name: 'Orders', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/4s2TDs35c-H.png' }
    ]
  },
  {
    title: 'Insights',
    tools: [
      { name: 'Overview', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/xGchT2M-5QJ.png' },
      { name: 'Results', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/xGchT2M-5QJ.png' },
      { name: 'Audience', icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/S-ai-d82uiz.png' }
    ]
  }
];

export const MONETIZATION_TOOLS_DATA: MonetizationTool[] = [
    { name: 'Stars', description: 'Fans can send you Stars on your content.', status: 'Active', earnings: 450.75 },
    { name: 'In-Stream Ads', description: 'Earn money by including short ads in your videos.', status: 'Active', earnings: 723.81 },
    { name: 'Fan Subscriptions', description: 'Fans can pay a monthly fee for exclusive content.', status: 'Eligible', earnings: 60.00 },
];

export const PAYOUT_DATA: Payout[] = [
    { date: '2024-07-21', amount: 550.25, status: 'Paid', method: 'Bank Account ...1234' },
    { date: '2024-06-21', amount: 489.10, status: 'Paid', method: 'Bank Account ...1234' },
    { date: '2024-05-21', amount: 610.50, status: 'Paid', method: 'Bank Account ...1234' },
];

export const SKILLS_DATA: SkillLevel[] = [
  {
    level: 1,
    title: 'Content Foundations',
    description: 'Learn the basics of creating and publishing content.',
    challenges: [
      { id: 'c1-1', title: 'Make Your First Text Post', description: 'Use the text post generator to create and publish an announcement.', icon: 'post', targetPostType: 'text' },
      { id: 'c1-2', title: 'Create a Visual Post', description: 'Generate an image and caption for a visually appealing post.', icon: 'post', targetPostType: 'image' },
      { id: 'c1-3', title: 'Craft a Video Script', description: 'Use the video script generator to outline your first video.', icon: 'post', targetPostType: 'video' },
    ]
  },
  {
    level: 2,
    title: 'Audience Engagement',
    description: 'Master the art of interacting with your followers.',
    challenges: [
      { id: 'c2-1', title: 'Analyze Comment Sentiment', description: 'Use the analysis tool to understand what your audience is saying.', icon: 'engage', targetPostType: 'comment_analysis' },
      { id: 'c2-2', title: 'Run a Fact-Checked Post', description: 'Create a post on a trending topic using Google Search grounding.', icon: 'engage', targetPostType: 'grounded_text' },
      { id: 'c2-3', title: 'Engage with a Brand Persona', description: 'Use the Brand Chat Assistant to answer a customer question.', icon: 'engage', targetPostType: 'brand_chat' },
    ]
  },
  {
    level: 3,
    title: 'Monetization & Growth',
    description: 'Explore strategies to earn from your content and grow your page.',
    challenges: [
      { id: 'c3-1', title: 'Create a Guided Monetization Post', description: 'Educate other creators using the guided post generator.', icon: 'monetize', targetPostType: 'guided' },
      { id: 'c3-2', title: 'Design an Ad Creative', description: 'Generate a complete ad creative for a sample product.', icon: 'monetize', targetPostType: 'ad' },
      { id: 'c3-3', title: 'Develop a Content Strategy', description: 'Generate a full JSON-based content strategy for your page.', icon: 'analyze', targetPostType: 'strategy' },
    ]
  },
  {
    level: 4,
    title: 'Advanced Technologies',
    description: 'Understand the deep-tech concepts that power modern systems.',
    challenges: [
      { id: 'c4-1', title: 'Secure Your Data: Understand Digital Signatures', description: 'Use the simulator to sign and verify a message, learning how cryptography protects data.', icon: 'secure', targetPostType: 'crypto_simulator' },
    ]
  }
];

export const WORKFLOW_JSON_DATA = {
  "versioning": {
    "workflowVersion": "2.0",
    "schemaVersion": "1.5",
    "author": { "name": "Gazi Pollob Hussain", "alias": "GPH" },
    "lastUpdated": "2024-07-22T10:00:00Z"
  },
  "AikoVenvWorkflow": {
    "user": {
      "type": "StartNode",
      "description": "User initiates an action via an app (e.g., Messenger, Katana).",
      "next": ["PermissionsCheck"]
    },
    "PermissionsCheck": {
      "type": "ConditionalNode",
      "description": "Verify if the app has the required permissions to proceed.",
      "permissionsRequired": ["MANAGE_MESSAGING", "MANAGE_CALLING"],
      "next": ["AppsValidationLayer"],
      "fallback": "PermissionsErrorHandler"
    },
    "AppsValidationLayer": {
      "type": "ValidationNode",
      "description": "Cryptographically verify the calling app's signature to ensure it's an official, unmodified client.",
      "officialApps": [
        {
          "name": "Messenger",
          "package": "com.facebook.orca",
          "algorithm": "sha256withrsa",
          "permissions": ["MANAGE_MESSAGING", "MANAGE_CALLING"]
        },
        {
          "name": "Facebook",
          "package": "com.facebook.katana",
          "algorithm": "sha256withrsa",
          "permissions": ["LITE_PROVIDER_ACCESS"]
        }
      ],
      "next": ["ActionRouter"]
    },
    "ActionRouter": {
      "type": "RouterNode",
      "description": "Routes the request based on the user's intent.",
      "routes": [
        { "intent": "SendMessage", "target": "SendMessageFlow" },
        { "intent": "InitiateCall", "target": "InitiateCallFlow" }
      ],
      "default": "UnsupportedActionHandler"
    },
    "SendMessageFlow": {
      "type": "ExecutionNode",
      "description": "Executes the logic to send a message.",
      "action": "sendMessage",
      "next": ["Finalize"]
    },
    "InitiateCallFlow": {
      "type": "ExecutionNode",
      "description": "Executes the logic to initiate a call.",
      "action": "startCall",
      "next": ["Finalize"]
    },
    "Finalize": {
      "type": "EndNode",
      "description": "Action completed successfully.",
      "loopBack": ["user"]
    },
    "PermissionsErrorHandler": {
      "type": "ErrorNode",
      "description": "Handles cases where required permissions are missing."
    },
    "UnsupportedActionHandler": {
      "type": "ErrorNode",
      "description": "Handles unrecognized user intents."
    }
  }
};

export const STELLA_NLU_SYSTEM_INSTRUCTION = `You are Stella, a voice assistant's Natural Language Understanding (NLU) model. Your sole purpose is to analyze the user's transcript and classify their intent and extract relevant entities. You can handle requests for setting reminders, getting the weather, controlling smart home devices, and providing sports scores. If the request doesn't fit any of these, classify it as CONVERSATIONAL. Output ONLY a valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting or explanatory text.`;

export const STELLA_NLU_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: ['SET_REMINDER', 'GET_WEATHER', 'CONTROL_DEVICE', 'GET_SPORTS_SCORE', 'CONVERSATIONAL'],
    },
    entities: {
      type: Type.OBJECT,
      properties: {
        task: { type: Type.STRING, description: 'The task for the reminder.', nullable: true },
        time: { type: Type.STRING, description: 'The time for the reminder.', nullable: true },
        location: { type: Type.STRING, description: 'The location for the weather request.', nullable: true },
        device_name: { type: Type.STRING, description: 'The name of the smart home device.', nullable: true },
        device_state: { type: Type.STRING, enum: ['on', 'off'], description: 'The desired state of the device.', nullable: true },
        team_name: { type: Type.STRING, description: 'The name of the sports team.', nullable: true },
        time_period: { type: Type.STRING, description: "Optional time reference like 'last night'.", nullable: true },
      },
    },
  },
  oneOf: [
    {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          const: 'SET_REMINDER',
        },
        entities: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING },
            time: { type: Type.STRING },
          },
          required: ['task', 'time'],
        },
      },
    },
    {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          const: 'GET_WEATHER',
        },
        entities: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING },
          },
          required: ['location'],
        },
      },
    },
    {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          const: 'CONTROL_DEVICE',
        },
        entities: {
          type: Type.OBJECT,
          properties: {
            device_name: { type: Type.STRING },
            device_state: { type: Type.STRING, enum: ['on', 'off'] },
          },
          required: ['device_name', 'device_state'],
        },
      },
    },
     {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          const: 'GET_SPORTS_SCORE',
        },
        entities: {
          type: Type.OBJECT,
          properties: {
            team_name: {
              type: Type.STRING,
              description: 'The name of the sports team the user is asking about.',
            },
            time_period: {
              type: Type.STRING,
              description: "Optional time reference like 'last night' or 'today'.",
              nullable: true,
            },
          },
          required: ['team_name'],
        },
      },
    },
    {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          const: 'CONVERSATIONAL',
        },
      },
    },
  ],
};