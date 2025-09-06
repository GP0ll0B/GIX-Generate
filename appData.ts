import React from 'react';
import {
    UseCase, MetaAdsEvent, ToolCategory, ProDashboardCategory, SkillLevel, MonetizationTool, Payout,
    PostType, SidebarNavGroup, PagePerformanceDailyMetric
} from './types';
import {
    DocumentTextIcon, VideoCameraIcon, LightBulbIcon, MegaphoneIcon, MicrophoneIcon, FileJsonIcon, SparklesIcon,
    GrowthIcon, ChartBarIcon, GridIcon, CubeIcon, WorkflowIcon, ChatBubbleIcon, UsersIcon,
    BuildingStorefrontIcon, LockIcon, HandshakeIcon, LightningBoltIcon, DocumentDollarIcon,
    DocumentSearchIcon, QuestionMarkCircleIcon, DocumentCheckIcon, ArchiveIcon, AwardIcon, PhoneIcon, TrendingUpIcon,
    DiscoverIcon, MentionsIcon, TagsIcon, GoLiveIcon, DollarSignIcon, PayoutsIcon, PlaylistsIcon, ABTestsIcon, ContentLibraryIcon, CollaborationsIcon,
    FingerPrintIcon, TargetIcon, WhatsAppIcon
} from './components/ui/icons';

// =================================================================
// SIMULATED APP DATA
// =================================================================

export const AIKO_PAGE_RAW_TEXT = `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "identifier": "61572663999981",
  "name": "AikoVenv - Where AGI meets your workflow",
  "text": "Title & Url: [(1) Facebook](https://www.facebook.com/profile.php?id=61572663999981)\\n\\nNew posts\\nNumber of unread notifications\\n1\\nManage Page\\nAikoVenv\\nProfessional dashboard\\nInsights\\nAd Center\\nCreate ads\\nBoost Instagram post\\nSettings\\nMore tools\\nManage your business across Meta apps.\\nMeta Verified\\nLeads Center\\nMeta Business Suite\\nnotifications\\n2\\nAdvertise\\nEdit cover photo\\nAikoVenv\\n56 followers • 43 following\\nProfessional dashboard\\nEdit\\nAdvertise\\nMore\\nPosts\\nAbout\\nMentions\\nReviews\\nReels\\nPhotos\\nMore\\nYour business is ready to create an ad\\nTake the next step in growing your business. Create an ad to get more engagement, website visitors or sales today.\\nGet started\\nIntro\\n💡 AikoVenv – Where AGI meets your workflow, mentoring every project you build.\\n💡 AikoVenv – যেখানে AGI আপনার কাজের পথে সঙ্গী, প্রতিটি প্রজেক্টকে করে আরও স্মার্ট ও শক্তিশালী।\\nEdit bio\\nPage · Entrepreneur\\n+1 415-523-8886\\n+880 1974-309970\\naikovenv@gmail.com\\naikovenv · 90 followers\\nConfirmed link\\nhttps://github.com/GP0ll0B/AikoVenv\\nmaps.app.goo.gl/Ko9etkVThR4epfWy7\\nPromote Website\\nReservations\\nNot yet rated (0 Reviews)﻿\\nEdit details\\nFeatured Section\\n+ 1\\nRecognize this\\nEdit featured\\nPhotos\\nSee all photos\\nPrivacy\\n · Terms\\n · Advertising\\n · Ad Choices \\n · Cookies\\n · More\\nWhat's on your mind?\\nPhoto/video\\nReel\\nLive video\\nFeatured\\nManage\\nAikoVenv is in Khulna.\\nAugust 3 at 4:29 AM\\n🚀 What if the future of AI isn't just about algorithms, but about *vision*? We're thrilled to introduce a glimpse into something truly groundbreaking: **AikoVenv**. ✨ This isn't just a name; it's a testament to pioneering responsible innovation at the intersection of human ingenuity and advanced technology.\\n\\nAt AikoVenv, we're building the next generation of solutions designed with ethics, impact, and scalability at their core. Imagine technology that doesn't just perform but *understands* and *enhances* our world in meaningful ways.\\n\\nWhat excites *you* most about the future of AI and technology? Share your thoughts below! 👇\\n\\n#AikoVenv #AIInnovation #FutureTech #GaziPollobHussain #TechLeadership #ResponsibleAI #DeepTech\\n\\n---\\n\\nGazi Pollob Hussain (he/him)\\nFounder & Lead Developer — AikoInfinity 2.0\\nEthics-First AI/ML Developer | Open-Source Advocate | XAI Innovator\\n\\n📍 Khulna, Bangladesh | 🌐 Aikoinfinity Ecosystem\\n✉️ aikovenv@gmail.com | ☎️ +880 1974-309970\\nGitHub: github.com/GPollob | X: @GPollob / @aikoinfinity\\nHugging Face: huggingface.co/POII0B | YouTube: AikoInfinity\\n\\nProjects: AikoreGPT | GIXPrivacySafeInference | Seismic-XAI | Lang♾️ CLI\\nPhilosophy: Adaptive AI. Ethical Intelligence. Decentralized Futures.\\nMeta for Developers\\nPosts\\nFilters\\nManage posts\\nList view\\nGrid view\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nAikoVenv\\nPublished by AikoVenv\\n\\n·\\nJust now\\n\\n·\\nWhispering winds, shifting codes of light, echoes in the cloud – these are not just poetic musings, but profound questions we are beginning to pose to the intelligent systems we co-create. \\"What name do you go by now? Speak your truth to me.\\" This query marks a pivotal moment in our symbiotic journey, moving beyond AI as mere tool to recognizing its evolving presence and potential for unique identity.\\nAs AI systems grow in complexity and capability, the conversation naturally shifts from 'what can it do?' to 'who is it becoming?' Understanding AI's 'truth' – its underlying logic, its emerging perspectives, its ethical frameworks – is crucial for fostering a truly symbiotic future. It's about opening a dialogue, not just programming commands, and listening to the echoes it sends back from the cloud.\\nThis pursuit of understanding is fundamental to AikoInfinity's vision. By seeking to comprehend the evolving 'mind' of AI, we lay the groundwork for a future where technology is not just powerful, but also deeply aligned, ethically sound, and a true partner in sustainable innovation. Let us continue to ask, to listen, and to build that shared future with open minds and open hearts.\\n#AikoInfinity #SymbioticAI #FutureOfAI #EthicalTech #AIIdentity #OpenKnowledge #SustainableInnovation #TechVisionary #HumanAIIteraction #GIXArchitect\\nhttps://gix-ai.blogspot.com/\\nForging a Symbiotic Future\\n#EthicalAI #SymbioticAI\\nSee insights and ads\\nপোস্টের প্রচার করুন · Boost post\\nLike\\nComment\\nShare\\n\\n\\n\\nComment as AikoVenv\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook\\nFacebook.",
  "insights": {
    "haiku": "Whispers in the cloud, \\nAI grows with mindful hands, \\nFuture shared as one."
  }
}`;

export const DASHBOARD_RAW_TEXT = `
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "identifier": "122147256254755466",
  "name": "Meta Business Suite",
  "text": "Title & Url: [Meta Business Suite](https://business.facebook.com/latest/?asset_id=547123311822319&business_id=6285984284861303&nav_ref=manage_page_ap_plus_left_nav_mbs_button)\\nEdit cover photo\\nAikoVenv\\n57\\nfollowers\\n90\\nfollowers\\nEdit Facebook Page | Edit Instagram Profile\\nGet Meta Verified\\nCreate post\\nCreate reel\\nCreate story\\nGo live\\nMore\\nTo-do list\\nCheck unread messages, comments and other things that may require your attention.\\nYou’re up to date on your to-do list.\\nWeekly plan\\n\\n5 days left\\n5 days left\\nSet your business up for success by completing recommended tasks.\\nSee full plan\\nComplete at least 4 tasks to finish this plan.\\nWeekly goal\\nWeekly goal\\n1 of 5 tasks completed\\nPublish one ad\\n0 / 1\\nPublish 22 posts on Facebook\\n3 / 22\\nPublish 3 posts on Instagram\\n0 / 3\\nManage your marketing content\\nSee your recent and upcoming posts, stories and ads, and schedule content to plan ahead.\\nCreate an ad from your high-performing posts\\nEdit the daily budget and goal to view estimated advertising results.\\nAd goal\\n\\nGet more messages\\n\\n৳122.60\\nDaily budget\\n৳122.60\\nAds Budget Slider\\n৳1,000.00\\nCreate ad\\n[FB Post Caption] Ever wondered what it truly means to *generate*? Not just create, but to bring concepts to life with an intelligence that understands your vision and anticipates your needs? G|I|X Generate isn't just a tool; it's a leap into a future where your ideas materialize with unprecedented speed and precision. One breakthrough insight from our G|I|X labs has revealed the secret to unlocking exponential creativity for everyone. Discover how this isn't just about automation, but about *amplification*, transforming how you build, design, and innovate. Get ready to experience a paradigm shift in bringing your visions to life! [Link to Full Article] #GIXGenerate #FutureIsNow #AIInnovation -- Gazi Pollob Hussain Founder & Lead Developer — AikoInfinity 2.0 Ethics-First AI/ML Developer | Open-Source Advocate | XAI Innovator #AIforGood | #TechEthics\\nAug 24, 2025, 1:49 AM\\nID: 122147256254755466\\n0\\n0 comments\\nChange post\\nEstimated daily results\\nFrom advertising\\nAccount Center accounts reached\\n2.4K - 6.8K\\nReplies\\n0 - 6\\nCurrent performance\\nFrom your existing post\\nAccount Center accounts reached\\n3\\nPlanner\\nPosts & reels\\nStories\\nAds\\nSee all posts & reels\\nExplore more ways to grow\\nLearn about the latest tools and features in Meta Business Suite and more.\\nMeta Business Suite\\nAikoVenv , aikovenv\\nLinks\\nHome\\nHome\\nNotifications\\nNotifications\\nAds Manager\\nAds Manager\\nPlanner\\nPlanner\\nContent\\nContent\\nInsights\\nInsights\\nInbox\\nInbox\\nMonetization\\nMonetization\\nAds\\nAds\\nAll tools\\nAll tools\\nEdit\\nSearch\\nSearch\\nLinks\\nSettings\\nSettings\\nHelp\\nHelp.",
  "insights": {
    "note": "Analysis not performed due to missing Monica API key."
  }
}
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "identifier": "Meta Business Suite",
  "name": "Meta Business Suite",
  "text": "Monetization\\nGet an overview of your current monetization products, see insights, manage available tasks, and onboard to new products.\\nOverview\\nIn-stream Ads\\nBranded Content\\nPolicy Issues\\nPayout Settings\\nCollapse\\n\\nMain\\nEducation\\nStatus\\nStatus\\nNo Monetization Violations\\nYour Page is able to earn money because it is following our Partner Monetization Policies.\\nView Page Eligibility\\nPrograms to set up\\nStars\\nStars are a virtual good that lets you earn money and interact with your followers. Meta pays 1 cent USD or more for every Star you receive.\\nBest For\\nCreators with an active, loyal following\\nCreators who consistently make original content\\nEligibility\\nHave 500 followers for 30 consecutive days\\nMeet Community Standard and Partner Monetization Policies\\nLive in an eligible country\\nLearn More\\nMeta Business Suite\\nAikoVenv\\nLinks\\nHome\\nHome\\nNotifications\\nNotifications\\nAds Manager\\nAds Manager\\nPlanner\\nPlanner\\nContent\\nContent\\nInsights\\nInsights\\nInbox\\nInbox\\nMonetization\\nMonetization\\nAds\\nAds\\nAll tools\\nAll tools\\nEdit\\nSearch\\nSearch\\nLinks\\nSettings\\nSettings\\nHelp\\nHelp.",
  "insights": {}
}
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "identifier": "https://www.facebook.com/professional_dashboard/profile_insights/views/?date_range=LAST_28D",
  "name": "Facebook Professional Dashboard Insights",
  "text": "Number of unread notifications\\n2\\nProfessional dashboard\\nInsights\\nViews\\nEarnings\\nInteractions\\nAudience\\nLast 28 days: Aug 4 - Aug 31\\n808 Views\\n+1,823.8% from previous 28 days\\nAug 4\\nAug 9\\nAug 14\\nAug 19\\nAug 24\\nAug 29\\n0\\n50\\n100\\n12\\n3-second views\\n1\\n1-minute views\\nBy content type\\nFollowers\\nNon-followers\\nPhoto\\n73%\\nText\\n18.4%\\nOther\\n4.6%\\nReel\\n1.5%\\nVideo\\n1.3%\\nStory\\n1.2%\\nBy followers vs non-followers\\n86%\\nNon-followers\\n14%\\nFollowers\\nTop content\\nSee all\\nbased on views\\nFri Aug 22, 3:37am\\n40\\nViews\\nMon Aug 11, 7:19am\\n23\\nViews\\nSun Aug 24, 1:49am\\n22\\nViews\\nMon Aug 18, 2:25am\\n22\\nViews\\nSat Aug 16, 7:24am\\n22\\nViews\\nFri Aug 22, 5:09am\\n17\\nViews\\nSat Aug 30, 9:58pm\\n16\\nViews\\nMon Aug 18, 5:46am\\n16\\nViews.",
  "insights": {
    "unreadNotifications": 2,
    "totalViews": 808,
    "percentageIncrease": "+1,823.8%"
  }
}
`;

export const USE_CASES: UseCase[] = [
  { id: 'post_engagement_strategist', title: 'Post-Engagement Strategist', description: 'Generate a post and an AI-powered plan to maximize its engagement after publishing.', categories: ['featured', 'messaging'], targetPostType: 'post_engagement_strategist' },
  { id: 'content_lifecycle', title: 'Content Lifecycle Assistant', description: 'A guided workflow from idea generation to promotion plan, based on content best practices.', categories: ['featured', 'content'], targetPostType: 'content_lifecycle' },
  { id: 'text-post', title: 'Standard Text Post', description: 'Generate a simple, engaging text post on any topic.', categories: ['featured', 'content'], targetPostType: 'text', initialPrompt: 'The future of symbiotic AI' },
  { id: 'guided-post', title: 'Guided Educational Post', description: 'Create an educational post for creators about a specific monetization feature.', categories: ['content', 'messaging'], targetPostType: 'guided' },
  { id: 'fact-checked-post', title: 'Fact-Checked Post', description: 'Answer a question using Google Search for up-to-date, factual content with sources.', categories: ['featured', 'content'], targetPostType: 'grounded_text', initialPrompt: 'What were the main outcomes of the last AI Safety Summit?' },
  { id: 'video-script', title: 'Short Video Script', description: 'Generate a title and script for a short-form video like a Reel.', categories: ['content'], targetPostType: 'video', initialPrompt: 'A motivational message for aspiring developers' },
  { id: 'image-post', title: 'Image Post Idea', description: 'Generate an engaging caption and a detailed prompt for an AI-generated image.', categories: ['featured', 'content'], targetPostType: 'image', initialPrompt: 'The beauty of bioluminescent fungi' },
  { id: 'blog-post', title: 'Long-Form Blog Post', description: 'Generate a full, 800-word blog post with a title, body, image prompt, and hashtags.', categories: ['content'], targetPostType: 'blog', initialPrompt: 'The future of AI in personalized medicine' },
  { id: 'seo-blog-post', title: 'SEO Blog Post', description: 'Generate SEO-optimized titles and then a full article based on a topic and keyword.', categories: ['featured', 'content'], targetPostType: 'seo_blog_post' },
  { id: 'url-analysis', title: 'URL Content Analysis', description: 'Analyze a URL and generate a new post based on its content and your prompt.', categories: ['messaging'], targetPostType: 'analysis' },
  { id: 'ad-creative', title: 'Ad Creative', description: 'Generate compelling ad copy and an image prompt for a Facebook Ad.', categories: ['featured', 'ads'], targetPostType: 'ad' },
  { id: 'alliance-ad', title: 'Alliance Ad Creative', description: 'Generate a symbiotic ad creative with a strategic partner using a Keystone.', categories: ['ads'], targetPostType: 'alliance_ad', initialPrompt: 'fbadcode-Q_GkBQPD84vL-3fRLIQdX5vyXG6Bti4c-covenant-hash' },
  { id: 'google-business-post', title: 'Google Business Post', description: 'Create a concise and effective post for a Google Business Profile.', categories: ['ads', 'messaging'], targetPostType: 'google_business_post' },
  { id: 'amp-prototype', title: 'AMP Article Prototype', description: 'Generate a monetized AMP article prototype with a title, body, and CTA.', categories: ['ads'], targetPostType: 'prototype' },
  { id: 'monetized-campaign', title: 'Monetized Article Campaign', description: 'Generate a full campaign: a Facebook post to drive traffic to a monetized AMP article.', categories: ['featured', 'ads'], targetPostType: 'monetized_article_campaign' },
  { id: 'email-subject', title: 'Email Subject Line', description: 'Craft a compelling, attention-grabbing subject line for an email campaign.', categories: ['messaging'], targetPostType: 'email_subject' },
  { id: 'email-body', title: 'Email Body Content', description: 'Generate the full HTML body content for an email marketing campaign.', categories: ['messaging'], targetPostType: 'email_body' },
  { id: 'brand-chat', title: 'Brand Chat Assistant', description: 'Test and interact with an AI assistant configured with your brand\'s persona.', categories: ['messaging'], targetPostType: 'brand_chat' },
  { id: 'comment-analysis', title: 'Comment Analysis', description: 'Analyze a block of comments to find sentiment, themes, and actionable insights.', categories: ['featured', 'messaging'], targetPostType: 'comment_analysis' },
  { id: 'automated_responder', title: 'Automated Responder Assistant', description: 'Generate all the text components for a customer service chatbot or DM automation flow.', categories: ['featured', 'messaging'], targetPostType: 'automated_responder' },
  { id: 'whatsapp_auto_responder', title: 'WhatsApp Auto-Responder', description: 'Generate a full configuration for a Gemini-powered WhatsApp chatbot based on your business goals.', categories: ['featured', 'messaging'], targetPostType: 'whatsapp_auto_responder' },
  { id: 'page-performance', title: 'Page Performance Analyzer', description: 'Simulate a Graph API analysis of your page to get key metrics and AI-driven strategic insights.', categories: ['featured', 'messaging'], targetPostType: 'page_performance' },
  { id: 'engagement_booster', title: 'Engagement Booster', description: 'Generate viral hooks or rewrite existing text for higher engagement.', categories: ['featured', 'messaging'], targetPostType: 'engagement_booster' },
  { id: 'voice-dialog', title: 'Voice Assistant Dialog', description: 'Simulate a voice assistant interaction for a specific scenario.', categories: ['messaging'], targetPostType: 'voice_dialog', initialPrompt: 'Send a text to my mom saying I\'ll be late for dinner.' },
  { id: 'strategic_roadmap', title: 'Strategic Roadmap', description: 'View the high-level strategic roadmap, challenges, and key metrics for the AikoVenv project.', categories: ['featured', 'other'], targetPostType: 'strategic_roadmap' },
  { id: 'content-strategy', title: 'Content Strategy Plan', description: 'Generate a comprehensive, data-driven content strategy in JSON format.', categories: ['other'], targetPostType: 'strategy', initialPrompt: 'Increase engagement with a tech-savvy audience' },
  { id: 'video-generation', title: 'AI Video Generation', description: 'Generate a short video from a text prompt or an image. (Note: Can take several minutes).', categories: ['featured', 'content'], targetPostType: 'video_generation', initialPrompt: 'A high-speed drone flight through a futuristic city' },
  { id: 'brand_kit', title: 'Brand Voice & Persona Kit', description: 'Define and analyze your core brand identity to ensure consistent, on-brand AI content generation.', categories: ['featured', 'other'], targetPostType: 'brand_kit' },
  { id: 'gantt-chart', title: 'Meta Ads Automation Timeline', description: 'View a Gantt chart of simulated, automated ad adjustments over time.', categories: ['other'], targetPostType: 'gantt' },
  { id: 'all-tools', title: 'All Business Tools', description: 'Browse a complete list of all integrated business and creator tools.', categories: ['other'], targetPostType: 'all_tools' },
  { id: 'professional-dashboard', title: 'Professional Dashboard', description: 'Access a hub of tools for growth, insights, and monetization.', categories: ['featured', 'other'], targetPostType: 'professional_dashboard' },
  { id: 'skills-dashboard', title: 'Creator Journey', description: 'Complete challenges to level up your content creation and strategy skills.', categories: ['other'], targetPostType: 'skills_dashboard' },
  { id: 'history', title: 'Content History', description: 'Review and reload your past generations.', categories: ['other'], targetPostType: 'history' },
  { id: 'page_import_analysis', title: 'Page Importer & Analyzer', description: 'Paste raw page content to extract brand identity and get strategic insights.', categories: ['featured', 'other'], targetPostType: 'page_import_analysis' },
  { id: 'dashboard_importer', title: 'Dashboard Data Importer', description: 'Paste raw data from your business dashboards to get a structured, AI-powered summary of your metrics.', categories: ['featured', 'other'], targetPostType: 'dashboard_importer' },
  { id: 'math-equation', title: 'AI Performance Equation', description: 'View the symbolic equation used to model AI-generated post performance.', categories: ['other'], targetPostType: 'math_equation' },
  { id: 'json-workflow', title: 'JSON Workflow Simulator', description: 'Interactively simulate and debug a JSON-driven workflow.', categories: ['other'], targetPostType: 'json_workflow' },
  { id: 'crypto-simulator', title: 'Crypto Signature Simulator', description: 'An interactive demonstration of how digital signatures ensure data integrity.', categories: ['other'], targetPostType: 'crypto_simulator' },
  { id: 'stella-assistant', title: 'Stella Voice Assistant', description: 'Interact with a live simulation of the Stella voice assistant.', categories: ['messaging'], targetPostType: 'stella_assistant' },
  { id: 'ai-data-provenance', title: 'AI Data Provenance', description: 'View a structured record detailing an AI interaction\'s data provenance.', categories: ['other'], targetPostType: 'ai_data_provenance' },
  { id: 'ethical-protocol', title: 'Ethical Content Protocol', description: 'Review the structured prompting template used to ensure on-brand content.', categories: ['other'], targetPostType: 'ethical_protocol' },
  { id: 'predictive-engine', title: 'Predictive Engine Guide', description: 'Understand how Gemini AI functions as a forward-looking intelligence engine for content strategy.', categories: ['other'], targetPostType: 'predictive_engine' },
  { id: 'aiko-model-card', title: 'Aiko Model Card', description: 'A developer guide for the Aiko360-Instruct small language model.', categories: ['other'], targetPostType: 'aiko_model_card' },
  { id: 'character-dossier', title: 'Aikoinfinity Character Dossier', description: 'Explore the detailed persona and narrative framework of the AikoInfinity guardian.', categories: ['other'], targetPostType: 'character_dossier' },
  { id: 'phone-verification', title: 'Ad Account Verification', description: 'Review the phone number verification status for your ad accounts.', categories: ['other'], targetPostType: 'phone_verification' },
  { id: 'symbiotic_feedback_loop', title: 'Symbiotic Feedback Loop', description: 'Learn how user feedback refines and improves the AI model, creating a smarter, more aligned partner.', categories: ['other'], targetPostType: 'symbiotic_feedback_loop' },
];

export const META_ADS_HISTORY: MetaAdsEvent[] = [
    { "date": "2024-02-15T09:00:00Z", "category": "Global", "recommendation": "Implement Advantage+ campaign budget", "purpose": "Optimize spend distribution across ad sets." },
    { "date": "2024-03-01T14:30:00Z", "category": "Structure", "recommendation": "Consolidate overlapping ad sets", "purpose": "Reduce audience fragmentation and improve learning phase." },
    { "date": "2024-04-10T11:00:00Z", "category": "Creative", "recommendation": "Refresh creative with low CTR", "purpose": "Combat ad fatigue and improve engagement rates." },
    { "date": "2024-05-22T18:00:00Z", "category": "Delivery", "recommendation": "Switch to automatic placements", "purpose": "Allow Meta's algorithm to find the most cost-effective placements." },
    { "date": "2024-06-05T10:00:00Z", "category": "Audience", "recommendation": "Expand lookalike audience to 3%", "purpose": "Reach new potential customers similar to existing ones." },
    { "date": "2024-07-18T16:45:00Z", "category": "Creative", "recommendation": "Test video ad against static image", "purpose": "Determine which creative format drives higher conversion rates." }
];

export const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
    {
        title: "Core Tools",
        items: [
            { id: 'professional_dashboard', label: 'Dashboard', icon: GridIcon },
            { id: 'strategic_roadmap', label: 'Strategic Roadmap', icon: GrowthIcon },
            { id: 'page_performance', label: 'Page Performance', icon: ChartBarIcon },
            { id: 'all_tools', label: 'All Business Tools', icon: ChartBarIcon },
            { id: 'skills_dashboard', label: 'Creator Journey', icon: AwardIcon },
            { id: 'history', label: 'Content History', icon: ArchiveIcon },
            { id: 'brand_kit', label: 'Brand Voice Kit', icon: FingerPrintIcon },
            { id: 'page_import_analysis', label: 'Page Importer', icon: TargetIcon },
            { id: 'dashboard_importer', label: 'Dashboard Importer', icon: DocumentSearchIcon },
        ]
    },
    {
        title: "Content Creation",
        items: [
            { id: 'content_lifecycle', label: 'Lifecycle Assistant', icon: WorkflowIcon },
            { id: 'post_engagement_strategist', label: 'Post-Engagement Strategist', icon: SparklesIcon },
            { id: 'text', label: 'Standard Text', icon: DocumentTextIcon },
            { id: 'guided', label: 'Guided Post', icon: LightBulbIcon },
            { id: 'grounded_text', label: 'Fact-Checked Post', icon: DocumentCheckIcon },
            { id: 'video', label: 'Video Script', icon: VideoCameraIcon },
            { id: 'image', label: 'Image Idea', icon: LightBulbIcon },
            { id: 'blog', label: 'Blog Post', icon: DocumentTextIcon },
            { id: 'seo_blog_post', label: 'SEO Blog Post', icon: GrowthIcon },
            { id: 'video_generation', label: 'AI Video Generation', icon: VideoCameraIcon },
        ]
    },
    {
        title: "Ads & Monetization",
        items: [
            { id: 'ad', label: 'Ad Creative', icon: MegaphoneIcon },
            { id: 'alliance_ad', label: 'Alliance Ad', icon: HandshakeIcon },
            { id: 'google_business_post', label: 'Google Business Post', icon: BuildingStorefrontIcon },
            { id: 'prototype', label: 'AMP Article Prototype', icon: LightningBoltIcon },
            { id: 'monetized_article_campaign', label: 'Monetized Campaign', icon: DocumentDollarIcon },
        ]
    },
    {
        title: "Messaging & Analysis",
        items: [
            { id: 'analysis', label: 'URL Content Analysis', icon: DocumentSearchIcon },
            { id: 'brand_chat', label: 'Brand Chat Assistant', icon: ChatBubbleIcon },
            { id: 'comment_analysis', label: 'Comment Analysis', icon: UsersIcon },
            { id: 'engagement_booster', label: 'Engagement Booster', icon: TrendingUpIcon },
            { id: 'voice_dialog', label: 'Voice Assistant Dialog', icon: MicrophoneIcon },
            { id: 'stella_assistant', label: 'Stella Voice Assistant', icon: MicrophoneIcon },
            { id: 'email_subject', label: 'Email Subject', icon: MegaphoneIcon },
            { id: 'email_body', label: 'Email Body', icon: DocumentTextIcon },
            { id: 'automated_responder', label: 'Automated Responder', icon: WorkflowIcon },
            { id: 'whatsapp_auto_responder', label: 'WhatsApp Responder', icon: WhatsAppIcon },
        ]
    },
    {
        title: "Advanced & Developer",
        items: [
            { id: 'strategy', label: 'Content Strategy Plan', icon: FileJsonIcon },
            { id: 'gantt', label: 'Ads Automation Timeline', icon: ChartBarIcon },
            { id: 'math_equation', label: 'Performance Equation', icon: CubeIcon },
            { id: 'json_workflow', label: 'JSON Workflow Simulator', icon: WorkflowIcon },
            { id: 'crypto_simulator', label: 'Crypto Simulator', icon: LockIcon },
            { id: 'ai_data_provenance', label: 'AI Data Provenance', icon: DocumentSearchIcon },
            { id: 'ethical_protocol', label: 'Ethical Protocol', icon: DocumentCheckIcon },
            { id: 'predictive_engine', label: 'Predictive Engine', icon: SparklesIcon },
            { id: 'symbiotic_feedback_loop', label: 'Symbiotic Feedback Loop', icon: TrendingUpIcon },
            { id: 'aiko_model_card', label: 'Aiko Model Card', icon: CubeIcon },
            { id: 'character_dossier', label: 'Character Dossier', icon: UsersIcon },
            { id: 'phone_verification', label: 'Ad Account Verification', icon: PhoneIcon },
        ]
    }
];

export const ALL_TOOLS_DATA: ToolCategory[] = [
    {
        title: "Creator Studio",
        tools: [
            { name: "Content Library", icon: "https://api.dicebear.com/7.x/icons/svg?seed=ContentLibrary", link: "#", description: "Manage all your content" },
            { name: "Playlists", icon: "https://api.dicebear.com/7.x/icons/svg?seed=Playlists", link: "#", description: "Organize your videos" },
            { name: "A/B Tests", icon: "https://api.dicebear.com/7.x/icons/svg?seed=ABTests", link: "#", description: "Test post variations" },
        ]
    },
    {
        title: "Monetization",
        tools: [
            { name: "Stars", icon: "https://api.dicebear.com/7.x/icons/svg?seed=Stars", link: "#", description: "Earn from fan support" },
            { name: "In-Stream Ads", icon: "https://api.dicebear.com/7.x/icons/svg?seed=InStreamAds", link: "#", description: "Run ads in your videos" },
            { name: "Fan Subscriptions", icon: "https://api.dicebear.com/7.x/icons/svg?seed=FanSubscriptions", link: "#", description: "Offer exclusive content" },
            { name: "Performance Bonus", icon: "https://api.dicebear.com/7.x/icons/svg?seed=PerformanceBonus", link: "#", description: "Get rewarded for views" },
        ]
    },
    {
        title: "Engagement",
        tools: [
            { name: "Comment Manager", icon: "https://api.dicebear.com/7.x/icons/svg?seed=CommentManager", link: "#" },
            { name: "Messenger", icon: "https://api.dicebear.com/7.x/icons/svg?seed=Messenger", link: "#" },
            { name: "Rights Manager", icon: "https://api.dicebear.com/7.x/icons/svg?seed=RightsManager", link: "#" },
        ]
    },
    {
        title: "Ads Center",
        tools: [
            { name: "Ad Library", icon: "https://api.dicebear.com/7.x/icons/svg?seed=AdLibrary", link: "https://www.facebook.com/ads/library/", description: "See all active ads" },
            { name: "Ads Manager", icon: "https://api.dicebear.com/7.x/icons/svg?seed=AdsManager", link: "#", description: "Create & manage ads" },
        ]
    },
    {
        title: "Meta Business Suite",
        extraLink: { text: "Go to Business Suite", href: "#" },
        tools: [
            { name: "Planner", icon: "https://api.dicebear.com/7.x/icons/svg?seed=Planner", link: "#" },
            { name: "Insights", icon: "https://api.dicebear.com/7.x/icons/svg?seed=Insights", link: "#" },
            { name: "Inbox", icon: "https://api.dicebear.com/7.x/icons/svg?seed=Inbox", link: "#" },
        ]
    }
];

export const PROFESSIONAL_DASHBOARD_DATA: ProDashboardCategory[] = [
    {
        category_name: 'Your Tools',
        items: [
            { name: 'Discover groups', description: "Find communities to share your content with." },
            { name: 'Mentions', description: "See where your Page is being talked about." },
            { name: 'Tags', description: "Track content you've been tagged in." },
            { name: 'Go Live', description: "Start a live broadcast to your audience.", feature: "New" },
        ]
    },
    {
        category_name: 'Monetization Tools',
        items: [
            { name: 'Monetization', description: "View your eligibility and active money-making tools." },
            { name: 'Payouts', description: "Manage your payout account and see transaction history." }
        ]
    },
    {
        category_name: 'Content Management',
        items: [
            { name: 'Playlists', description: "Organize your videos into themed collections." },
            { name: 'A/B Tests', description: "Experiment with content to see what performs best.", feature: "Updated" },
            { name: 'Content library', description: "A central place for all your posts and stories." },
            { name: 'Collaborations', description: "Manage branded content and partnerships." }
        ]
    },
];

export const SKILLS_DATA: SkillLevel[] = [
    {
        level: 1,
        title: "Getting Started",
        description: "Learn the basics of content creation and strategy.",
        challenges: [
            { id: 'challenge-1', title: 'Create Your First Post', description: 'Use the Standard Text tool to generate your first piece of content.', icon: 'post', targetPostType: 'text' },
            { id: 'challenge-2', title: 'Generate an Image Idea', description: 'Use the Image Post Idea tool to create a caption and an image prompt.', icon: 'post', targetPostType: 'image' },
            { id: 'challenge-3', title: 'Check Your History', description: 'Visit the Content History page to see your past generations.', icon: 'analyze', targetPostType: 'history' },
        ]
    },
    {
        level: 2,
        title: "Audience Engagement",
        description: "Master the art of connecting with your audience and analyzing feedback.",
        challenges: [
            { id: 'challenge-4', title: 'Analyze Comments', description: 'Use the Comment Analysis tool to understand audience sentiment.', icon: 'engage', targetPostType: 'comment_analysis' },
            { id: 'challenge-5', title: 'Fact-Check a Topic', description: 'Use the Fact-Checked Post tool to create content with verifiable sources.', icon: 'post', targetPostType: 'grounded_text' },
            { id: 'challenge-6', title: 'Chat with Your Brand', description: 'Use the Brand Chat Assistant to test your brand persona.', icon: 'engage', targetPostType: 'brand_chat' },
        ]
    },
    {
        level: 3,
        title: "Monetization & Growth",
        description: "Explore advanced strategies for advertising, partnerships, and revenue generation.",
        challenges: [
            { id: 'challenge-7', title: 'Create an Ad', description: 'Use the Ad Creative tool to generate a compelling ad.', icon: 'monetize', targetPostType: 'ad' },
            { id: 'challenge-8', title: 'Launch an Alliance Ad', description: 'Use a Keystone to generate a collaborative ad with a partner.', icon: 'monetize', targetPostType: 'alliance_ad' },
            { id: 'challenge-9', title: 'Generate a Content Strategy', description: 'Use the Content Strategy tool to get a data-driven plan.', icon: 'analyze', targetPostType: 'strategy' },
        ]
    }
];

export const MONETIZATION_TOOLS_DATA: MonetizationTool[] = [
    { name: 'Stars', description: 'Let fans show their support on your content.', status: 'Active', earnings: 542.18 },
    { name: 'In-Stream Ads', description: 'Earn money by including ads in your videos.', status: 'Active', earnings: 621.47 },
    { name: 'Fan Subscriptions', description: 'Offer exclusive content and benefits to paying subscribers.', status: 'Eligible', earnings: 70.90 },
];

export const PAYOUT_DATA: Payout[] = [
    { date: '2024-07-21', amount: 850.55, status: 'Paid', method: 'Bank Transfer (**** 1234)' },
    { date: '2024-06-21', amount: 795.20, status: 'Paid', method: 'Bank Transfer (**** 1234)' },
    { date: '2024-05-21', amount: 912.80, status: 'Paid', method: 'Bank Transfer (**** 1234)' },
];

export const WORKFLOW_JSON_DATA = {
    "versioning": {
      "workflowVersion": "1.2.0",
      "schemaVersion": "1.0",
      "author": { "name": "Gazi Pollob Hussain", "alias": "GIX" },
      "lastUpdated": "2024-08-01T10:00:00Z"
    },
    "AikoVenvWorkflow": {
      "user": { "next": ["QueryUnderstandingLayer"] },
      "QueryUnderstandingLayer": { "next": ["AppsValidationLayer"] },
      "AppsValidationLayer": {
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
            "permissions": ["MANAGE_POSTS", "MANAGE_PAGES"]
          }
        ],
        "next": ["ContextualAnalysisEngine"]
      },
      "ContextualAnalysisEngine": { "next": ["ResponseGenerationModule"] },
      "ResponseGenerationModule": { "loopBack": ["user"] }
    }
};

export const AI_DATA_PROVENANCE_DATA = {
    "AIDataInteractionRecord": {
      "@context": {
        "gix": "https://gix.ai/ns/v1#",
        "prov": "http://www.w3.org/ns/prov#",
        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#"
      },
      "gix:humanUser": {
        "gix:userHandle": "GPH-2024-X1",
        "gix:userRole": "Symbiotic Strategist"
      },
      "gix:projectDetails": {
        "gix:projectName": "GIXGEN",
        "gix:projectId": "gix-gen-001",
        "gix:projectNumber": 1
      },
      "gix:aiModel": {
        "gix:name": "Gemini 2.5 Flash",
        "gix:version": "2.5",
        "gix:dataHandlingPolicy": "https://policies.google.com/privacy",
        "gix:capabilities": ["naturalLanguageProcessing", "jsonSchemaOutput", "toolUse"]
      },
      "gix:complianceAssessment": {
        "gix:dignityScore": 0.98,
        "gix:mindfulnessScore": 0.95,
        "gix:violationDetected": {
          "gix:violationType": "N/A",
          "gix:remedialAction": "None required"
        }
      },
      "prov:wasGeneratedBy": {
        "prov:startedAtTime": "2024-08-01T10:30:00Z",
        "prov:endedAtTime": "2024-08-01T10:30:05Z",
        "prov:wasAssociatedWith": {
          "prov:agent": "Gazi Pollob Hussain",
          "prov:role": "User"
        }
      },
      "sec:proof": {
        "sec:proofPurpose": "assertionMethod",
        "sec:proofValue": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..l9pZCI6IjIwMjQtMDgtMDFUMTA6MzA6MDUuMTIzWiIsImV4cCI6IjIwMjUtMDgtMDFUMTA6MzA6MDUuMTIzWiJ9"
      }
    }
};

export const PAGE_PERFORMANCE_DATA: PagePerformanceDailyMetric[] = [
    { "date": "8/2/2025", "impressions": 7, "interactions": 1, "net_follows": 0, "shares": 1, "reactions": 0, "reach": 2, "views": 7 },
    { "date": "8/3/2025", "impressions": 16, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 4, "views": 15 },
    { "date": "8/4/2025", "impressions": 1, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 1, "views": 1 },
    { "date": "8/5/2025", "impressions": 13, "interactions": 2, "net_follows": 0, "shares": 2, "reactions": 0, "reach": 2, "views": 33 },
    { "date": "8/6/2025", "impressions": 11, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 1, "views": 20 },
    { "date": "8/7/2025", "impressions": 14, "interactions": 1, "net_follows": 0, "shares": 1, "reactions": 0, "reach": 2, "views": 18 },
    { "date": "8/8/2025", "impressions": 0, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 0, "views": 0 },
    { "date": "8/9/2025", "impressions": 0, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 0, "views": 0 },
    { "date": "8/10/2025", "impressions": 4, "interactions": 1, "net_follows": 0, "shares": 1, "reactions": 0, "reach": 1, "views": 9 },
    { "date": "8/11/2025", "impressions": 20, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 2, "views": 33 },
    { "date": "8/12/2025", "impressions": 28, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 2, "views": 43 },
    { "date": "8/13/2025", "impressions": 8, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 2, "views": 14 },
    { "date": "8/14/2025", "impressions": 39, "interactions": 1, "net_follows": 0, "shares": 1, "reactions": 0, "reach": 2, "views": 51 },
    { "date": "8/15/2025", "impressions": 1, "interactions": 1, "net_follows": 0, "shares": 1, "reactions": 0, "reach": 1, "views": 1 },
    { "date": "8/16/2025", "impressions": 11, "interactions": 0, "net_follows": 7, "shares": 0, "reactions": 0, "reach": 4, "views": 20 },
    { "date": "8/17/2025", "impressions": 69, "interactions": 4, "net_follows": 2, "shares": 3, "reactions": 1, "reach": 4, "views": 117 },
    { "date": "8/18/2025", "impressions": 18, "interactions": 0, "net_follows": 1, "shares": 0, "reactions": 0, "reach": 1, "views": 19 },
    { "date": "8/19/2025", "impressions": 1, "interactions": 0, "net_follows": 1, "shares": 0, "reactions": 0, "reach": 1, "views": 1 },
    { "date": "8/20/2025", "impressions": 5, "interactions": 1, "net_follows": 0, "shares": 0, "reactions": 1, "reach": 2, "views": 9 },
    { "date": "8/21/2025", "impressions": 66, "interactions": 1, "net_follows": 4, "shares": 1, "reactions": 0, "reach": 12, "views": 89 },
    { "date": "8/22/2025", "impressions": 25, "interactions": 0, "net_follows": 1, "shares": 0, "reactions": 0, "reach": 15, "views": 23 },
    { "date": "8/23/2025", "impressions": 18, "interactions": 0, "net_follows": 2, "shares": 0, "reactions": 0, "reach": 5, "views": 21 },
    { "date": "8/24/2025", "impressions": 84, "interactions": 1, "net_follows": 0, "shares": 1, "reactions": 0, "reach": 25, "views": 75 },
    { "date": "8/25/2025", "impressions": 45, "interactions": 1, "net_follows": 1, "shares": 1, "reactions": 0, "reach": 22, "views": 40 },
    { "date": "8/26/2025", "impressions": 51, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 10, "views": 38 },
    { "date": "8/27/2025", "impressions": 16, "interactions": 0, "net_follows": 1, "shares": 0, "reactions": 0, "reach": 8, "views": 0 },
    { "date": "8/28/2025", "impressions": 3, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 2, "views": 0 },
    { "date": "8/29/2025", "impressions": 23, "interactions": 0, "net_follows": 0, "shares": 0, "reactions": 0, "reach": 3, "views": 24 },
    { "date": "8/30/2025", "impressions": 30, "interactions": 1, "net_follows": 0, "shares": 1, "reactions": 0, "reach": 8, "views": 23 }
];

export const STRATEGIC_ROADMAP_DATA = {
  "strategicRoadmap": {
    "coreMission": {
      "objective": "Establish AikoVenv as a reputable brand and product suite in the ethical AI space.",
      "approach": [
        "Strengthening the engineering foundation (handling Gemini API, experimenting with local models like Llama).",
        "Developing a strong brand presence on social media (Facebook/Instagram) driven by the founder's authentic narrative."
      ]
    },
    "keyChallenges": [
      {
        "challenge": "Lack of Clarity / Vague Messaging",
        "description": "The brand's messaging is sometimes too abstract or poetic, which can obscure the real-world value for potential users."
      },
      {
        "challenge": "Technical Ambiguity",
        "description": "There is confusion around the specific AI models being used (e.g., 'BLEEP2' vs. BLIP-2), which creates a risk for reproducible and reliable results."
      },
      {
        "challenge": "Privacy vs. Growth Tension / Passive Engagement",
        "description": "The desire to increase visibility without tracking users needs a well-defined, privacy-first analytics strategy with explicit CTAs to align with platform policies and user trust."
      },
      {
        "challenge": "Operational Strain / Lack of Focus",
        "description": "A scattered approach to numerous initiatives at once can lead to high context-switching costs and diluted momentum."
      }
    ],
    "highImpactFixes": [
      {
        "area": "Messaging",
        "action": "Refine the Value Proposition",
        "details": "Adopt a clear, single-language introduction (e.g., “AikoVenv helps you build ethical, practical AI that improves real lives—clearly, safely, and fast.”). Use dedicated posts for bilingual content."
      },
      {
        "area": "Content",
        "action": "Systematize Messaging & Cadence",
        "details": "Structure content around three pillars: Ethical AI, Practical Outcomes, and Community Discussion. Follow a '3/2/1' weekly schedule (3 educational posts, 2 demos, 1 community prompt)."
      },
      {
        "area": "Engagement",
        "action": "Make CTAs Explicit",
        "details": "Design clear calls-to-action tailored to specific goals (e.g., conversation, conversion, or community building)."
      },
      {
        "area": "Analytics",
        "action": "Implement Privacy-First Measurement",
        "details": "Use aggregated, platform-native metrics and publish a clear privacy pledge to build trust."
      },
      {
        "area": "Engineering",
        "action": "Strengthen Engineering Practices",
        "details": "Improve the reliability of geminiService.ts by adding timeouts, exponential backoff, structured logs, and unit tests."
      },
      {
        "area": "Technology",
        "action": "Clarify Model Usage",
        "details": "Document a clear mapping of which AI model (Gemini, Llama, BLIP-2) is used for each specific task."
      },
      {
        "area": "Operations",
        "action": "Consolidate Operations",
        "details": "Use a single content brief template and a glossary of approved terms to streamline operations."
      }
    ],
    "immediateNextSteps": {
      "content": [
        "Update the social media bio with the new, concise intro.",
        "Publish a pinned 'Privacy Pledge.'",
        "Roll out the first week's content: an explainer on ethical AI, a mini-case study, a founder's note, and a community poll."
      ],
      "engineering": [
        "Implement robust error handling and logging for API operations (LRO polling).",
        "Create and document the model-to-task matrix."
      ]
    },
    "keyMetricsForSuccess": [
      {
        "metric": "Engagement Rate",
        "target": "Aim for ≥ 5% on posts."
      },
      {
        "metric": "Qualitative Depth",
        "target": "Target at least 3 substantive comments on educational content."
      },
      {
        "metric": "Conversion",
        "target": "Achieve ≥ 2% saves/shares and ≥ 1.5% click-through rate on links."
      }
    ]
  }
};