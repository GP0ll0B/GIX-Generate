import { GuidedPostInput, AdCreativeInput, AllianceAdInput, VoiceDialogInput, GoogleBusinessPostInput, AmpPrototypeInput, MonetizedArticleCampaignInput, SeoBlogInput, EmailSubjectInput, EmailBodyInput, PostType, AllyData, AppMetadata, EngagementBoosterInput, BrandVoiceInput, ContentLifecycleInput, AutomatedResponderInput, WhatsAppAutoResponderInput, PostEngagementStrategistInput } from './types';

// =================================================================
// CONSTANTS
// =================================================================

// --- Blog URL ---
export const GIX_BLOG_URL = 'https://gix-ai.blogspot.com/';

// --- Initial State for Forms ---
export const INITIAL_GUIDED_INPUT: GuidedPostInput = {
    monetizationFeature: 'Stars',
    targetAudience: 'General Creators',
    keyTip: ''
};

export const INITIAL_AD_CREATIVE_INPUT: AdCreativeInput = {
    productOrService: '',
    targetAudience: '',
    callToAction: 'Learn More',
    requiredKeywords: '',
    bannedWords: '',
};

export const INITIAL_ALLIANCE_AD_INPUT: AllianceAdInput = {
    keystone: '',
    coreMessage: '',
    targetAudience: '',
    callToAction: 'Learn More',
};

export const INITIAL_VOICE_DIALOG_INPUT: VoiceDialogInput = {
    dialogType: 'Send Text Message',
    scenario: ''
};

export const INITIAL_GOOGLE_BUSINESS_POST_INPUT: GoogleBusinessPostInput = {
    businessName: '',
    postGoal: 'Announce something new',
    keyInfo: '',
    callToAction: 'Learn more'
};

export const INITIAL_AMP_PROTOTYPE_INPUT: AmpPrototypeInput = {
    productOrService: '',
    articleGoal: 'Drive sign-ups',
    targetAudience: '',
    keyPoints: '',
};

export const INITIAL_MONETIZED_ARTICLE_CAMPAIGN_INPUT: MonetizedArticleCampaignInput = {
    productOrService: '',
    articleGoal: 'Drive sign-ups',
    targetAudience: '',
    keyPoints: '',
};

export const INITIAL_SEO_BLOG_INPUT: SeoBlogInput = {
    topic: '',
    keyword: '',
    audience: '',
    tone: 'Knowledgeable',
};

export const INITIAL_EMAIL_SUBJECT_INPUT: EmailSubjectInput = {
    campaignType: 'Product Launch',
    keyInfo: '',
};

export const INITIAL_EMAIL_BODY_INPUT: EmailBodyInput = {
    campaignType: 'Product Launch',
    targetAudience: '',
    keyPoints: '',
    tone: 'Professional',
};

export const INITIAL_ENGAGEMENT_BOOSTER_INPUT: EngagementBoosterInput = {
    mode: 'hooks',
    topic: '',
    textToRewrite: '',
};

export const INITIAL_BRAND_VOICE_INPUT: BrandVoiceInput = {
    missionStatement: '',
    coreValues: '',
    targetAudiencePersona: '',
    brandVoiceTone: 'Visionary',
};

export const INITIAL_CONTENT_LIFECYCLE_INPUT: ContentLifecycleInput = {
    mainTopic: '',
};

export const INITIAL_AUTOMATED_RESPONDER_INPUT: AutomatedResponderInput = {
    goal: 'Welcome new followers and answer common questions about products, support, and pricing.',
    platform: 'Instagram DMs',
};

export const INITIAL_WHATSAPP_AUTO_RESPONDER_INPUT: WhatsAppAutoResponderInput = {
    goal: 'Answer customer questions about business hours, location, and services offered.',
    businessInfo: 'We are a cafe called "The Daily Grind". We are open 9am-5pm on weekdays, and 10am-4pm on weekends. Our address is 123 Coffee Lane. We sell coffee, pastries, and sandwiches.',
    tone: 'Friendly',
};

export const INITIAL_POST_ENGAGEMENT_STRATEGIST_INPUT: PostEngagementStrategistInput = {
    topic: '',
};


// --- Layout ---
export const SINGLE_COLUMN_POST_TYPES: Set<PostType> = new Set([
    'strategy', 'gantt', 'all_tools', 'professional_dashboard', 'skills_dashboard', 
    'math_equation', 'json_workflow', 'brand_chat', 'comment_analysis', 
    'crypto_simulator', 'stella_assistant', 'ai_data_provenance', 'ethical_protocol', 
    'aiko_model_card', 'history', 'character_dossier', 'video_generation', 'phone_verification',
    'engagement_booster', 'brand_kit', 'page_performance', 'predictive_engine', 'content_lifecycle',
    'automated_responder', 'whatsapp_auto_responder', 'strategic_roadmap', 'page_import_analysis', 'dashboard_importer',
    'symbiotic_feedback_loop', 'post_engagement_strategist'
]);

// --- Branding ---
export const PRIMARY_AVATAR_URL = "https://scontent.fjsr8-1.fna.fbcdn.net/v/t39.30808-6/537256254_122226542244061815_8422278121391550946_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFBFpuV26E8u-nuxsTgg7W2t6XXL13buae3pdcvXdu5p1Aofa4cnUcHxYeNm7OesH-eRQAxMNapzyzw84MCwx1M&_nc_ohc=xlJ2zZ7M9p8Q7kNvwGWJ-He&nc_oc=Adl1tBbO5UGKcQMURaF9x43t5fEE45YphW3o1jLZCg6WpqR8ayENy_3zJOOZXLk7CqE&nc_zt=23&_nc_ht=scontent.fjsr8-1.fna&_nc_gid=ZejQs3kIqU1AVsosBO4vng&oh=00_AfVUMoqh2FEk5UaUQz70du8PYQly6roPlO3GGrFxVdy5-g&oe=68B0EBDF";

// --- Environment Variables ---
export const FACEBOOK_APP_ID: string | undefined = process.env.FACEBOOK_APP_ID;
export const MANUAL_ACCESS_TOKEN: string | undefined = undefined;
export const MANUAL_PAGE_ID: string | undefined = undefined;
export const MANUAL_PAGE_NAME: string | undefined = process.env.MANUAL_PAGE_NAME;
export const MAKE_WEBHOOK_URL: string = process.env.MAKE_WEBHOOK_URL || '';


// --- Signature Blocks ---
export const SIGNATURE_TEXT_FOR_COPY = `${GIX_BLOG_URL}
Forging a Symbiotic Future
#EthicalAI #SymbioticAI`;


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