import React from 'react';

// =================================================================
// TYPE & INTERFACE DEFINITIONS
// =================================================================

export type ModelType = 'gemini-2.5-flash' | 'aiko-360m-instruct';
export type TaskType = 'Social Media' | 'Accessibility' | 'Marketing' | 'Visual Q&A';

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

export type GeneratedImageState = 'prompt_ready' | `data:image/jpeg;base64,${string}`;

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

export interface BrandReviewable {
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

export interface PagePerformanceAnalysisData {
    strategic_summary: string;
    recommendations: string[];
    top_post_insight: string;
}

export interface AllyData {
  id: string;
  name: string;
  avatarUrl: string;
  persona: string;
}

export interface ResponderFlow {
    welcomeMessage: string;
    quickReplies: Array<{
        label: string;
        response: string;
    }>;
    fallbackMessage: string;
}

export interface PageImportAnalysisResult {
  brandName: string;
  brandBio: string;
  toneOfVoice: string[];
  keyThemes: string[];
  nextPostSuggestion: string;
}

export interface DashboardImportAnalysisResult {
    todo_list: string[];
    weekly_goals: Array<{
        task: string;
        progress: number;
        target: number;
    }>;
    performance_summary: {
        metric: string;
        value: string;
        trend: string;
    };
    monetization_status: {
        status: string;
        details: string;
    };
    latest_post_summary: string;
}

export interface WhatsAppAutoResponderFlow {
  system_prompt: string;
  welcome_message: string;
  common_questions: Array<{
    question_pattern: string;
    response: string;
  }>;
  fallback_message: string;
}

export interface EngagementStrategy {
    simulatedComments: Array<{
        username: string;
        comment: string;
        type: 'Positive' | 'Negative' | 'Question';
    }>;
    suggestedReplies: Array<{
        type: 'Positive' | 'Negative' | 'Question';
        reply: string;
    }>;
    boostStrategy: {
        recommendation: string;
        simulatedOutcome: string;
    };
    followUpPostIdea: string;
}

export type GeneratedContent = 
  | ({ 
      type: 'text'; 
      caption: string; 
      hashtags: string[]; 
      imageUrl?: GeneratedImageState | null; 
      safetyAnalysis: { isSafe: boolean; reasoning: string; };
      vqaResult?: { question: string; answer: string; reasoning: string; };
    } & BrandReviewable)
  | ({ type: 'guided'; content: string; hashtags: string[]; monetizationFeature: string; } & BrandReviewable)
  | ({ type: 'grounded_text'; content: string; sources: Source[]; hashtags: string[] } & BrandReviewable)
  | ({ type: 'video'; title: string; message: string; hashtags: string[] } & BrandReviewable)
  | ({ type: 'image'; caption: string; imageUrl: GeneratedImageState | null; hashtags: string[]; imagePrompt: string; is360?: boolean; } & BrandReviewable)
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
  | { type: 'page_performance'; analysis: PagePerformanceAnalysisData }
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
    } & BrandReviewable)
  | ({ type: 'email_subject'; subject: string } & BrandReviewable)
  | ({ type: 'email_body'; body: string } & BrandReviewable)
  | { type: 'character_dossier' }
  | { type: 'engagement_hooks'; topic: string; hooks: string[] }
  | { type: 'rewritten_text'; originalText: string; rewrittenText: string }
  | { 
      type: 'brand_voice_analysis'; 
      analysis: {
        brandSummary: string;
        coreKeywords: string[];
        personaInANutshell: string;
      }
    }
  | { type: 'content_lifecycle' }
  | ({ type: 'automated_responder'; flow: ResponderFlow } & BrandReviewable)
  | ({ type: 'whatsapp_auto_responder'; flow: WhatsAppAutoResponderFlow } & BrandReviewable)
  | { type: 'page_import_analysis'; analysis: PageImportAnalysisResult }
  | { type: 'dashboard_importer'; analysis: DashboardImportAnalysisResult }
  | { 
      type: 'post_engagement_strategist'; 
      basePost: Extract<GeneratedContent, { type: 'text' }>;
      engagementStrategy: EngagementStrategy;
    };


export interface HistoryItem {
    id: string;
    timestamp: number;
    prompt: string;
    preview: string;
    postType: PostType;
    variations: GeneratedContent[];
}


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

export interface EmailSubjectInput {
    campaignType: 'Product Launch' | 'Weekly Newsletter' | 'Promotional Offer' | 'Event Invitation' | 'Re-engagement';
    keyInfo: string;
}

export interface EmailBodyInput {
    campaignType: EmailSubjectInput['campaignType'];
    targetAudience: string;
    keyPoints: string;
    tone: 'Professional' | 'Friendly & Casual' | 'Enthusiastic' | 'Formal' | 'Humorous';
}

export interface EngagementBoosterInput {
    mode: 'hooks' | 'rewrite';
    topic: string;
    textToRewrite: string;
}

export interface BrandVoiceInput {
    missionStatement: string;
    coreValues: string; // comma-separated
    targetAudiencePersona: string;
    brandVoiceTone: 'Visionary' | 'Empathetic' | 'Authoritative' | 'Witty' | 'Formal';
}

export interface ContentLifecycleInput {
    mainTopic: string;
}

export interface AutomatedResponderInput {
  goal: string;
  platform: 'Instagram DMs' | 'Facebook Messenger' | 'Website Chatbot';
}

export interface WhatsAppAutoResponderInput {
  goal: string;
  businessInfo: string;
  tone: 'Friendly' | 'Professional' | 'Witty' | 'Formal';
}

export interface PostEngagementStrategistInput {
    topic: string;
}


export interface PublishPostParams {
  page: FacebookPage;
  message?: string;
  scheduledPublishTime?: Date;
  imageBase64?: string;
  is360?: boolean;
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
  emailDetails?: {
      subject?: string;
      htmlBody?: string;
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


export type PostType = 'text' | 'guided' | 'grounded_text' | 'video' | 'image' | 'analysis' | 'strategy' | 'gantt' | 'ad' | 'alliance_ad' | 'video_generation' | 'voice_dialog' | 'brand_chat' | 'comment_analysis' | 'google_business_post' | 'blog' | 'all_tools' | 'professional_dashboard' | 'skills_dashboard' | 'math_equation' | 'json_workflow' | 'crypto_simulator' | 'stella_assistant' | 'prototype' | 'monetized_article_campaign' | 'seo_blog_post' | 'ai_data_provenance' | 'ethical_protocol' | 'aiko_model_card' | 'history' | 'email_subject' | 'email_body' | 'character_dossier' | 'phone_verification' | 'engagement_booster' | 'brand_kit' | 'page_performance' | 'predictive_engine' | 'content_lifecycle' | 'automated_responder' | 'whatsapp_auto_responder' | 'strategic_roadmap' | 'page_import_analysis' | 'dashboard_importer' | 'symbiotic_feedback_loop' | 'post_engagement_strategist';

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

export interface AppMetadata {
    appName: string;
    signature: {
        algorithm: string;
        value: string;
    };
    permissions: string[];
}

export interface PagePerformanceDailyMetric {
  date: string;
  impressions: number;
  interactions: number;
  net_follows: number;
  shares: number;
  reactions: number;
  reach: number;
  views: number;
}


declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: any;
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
