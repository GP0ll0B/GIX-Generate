import { useState } from 'react';
import { 
    PostType, GuidedPostInput, AdCreativeInput, VoiceDialogInput, GoogleBusinessPostInput, 
    ModelType, AllianceAdInput, AmpPrototypeInput, MonetizedArticleCampaignInput, SeoBlogInput,
    EmailSubjectInput, EmailBodyInput, EngagementBoosterInput, BrandVoiceInput, ContentLifecycleInput,
    AutomatedResponderInput, WhatsAppAutoResponderInput, TaskType, PostEngagementStrategistInput
} from '../types';
import {
    INITIAL_GUIDED_INPUT, INITIAL_AD_CREATIVE_INPUT, INITIAL_ALLIANCE_AD_INPUT, 
    INITIAL_VOICE_DIALOG_INPUT, INITIAL_GOOGLE_BUSINESS_POST_INPUT, INITIAL_AMP_PROTOTYPE_INPUT, 
    INITIAL_MONETIZED_ARTICLE_CAMPAIGN_INPUT, INITIAL_SEO_BLOG_INPUT,
    INITIAL_EMAIL_SUBJECT_INPUT, INITIAL_EMAIL_BODY_INPUT, INITIAL_ENGAGEMENT_BOOSTER_INPUT,
    INITIAL_BRAND_VOICE_INPUT, INITIAL_CONTENT_LIFECYCLE_INPUT, INITIAL_AUTOMATED_RESPONDER_INPUT,
    INITIAL_WHATSAPP_AUTO_RESPONDER_INPUT, INITIAL_POST_ENGAGEMENT_STRATEGIST_INPUT
} from '../constants';
import { BRAND_CONTEXT_TEXT } from '../prompts';

export const useFormState = () => {
    // Input State
    const [topic, setTopic] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [inputImage, setInputImage] = useState<{ data: string; type: string; } | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
    const [guidedInput, setGuidedInput] = useState<GuidedPostInput>(INITIAL_GUIDED_INPUT);
    const [adCreativeInput, setAdCreativeInput] = useState<AdCreativeInput>(INITIAL_AD_CREATIVE_INPUT);
    const [allianceAdInput, setAllianceAdInput] = useState<AllianceAdInput>(INITIAL_ALLIANCE_AD_INPUT);
    const [voiceDialogInput, setVoiceDialogInput] = useState<VoiceDialogInput>(INITIAL_VOICE_DIALOG_INPUT);
    const [googleBusinessPostInput, setGoogleBusinessPostInput] = useState<GoogleBusinessPostInput>(INITIAL_GOOGLE_BUSINESS_POST_INPUT);
    const [ampPrototypeInput, setAmpPrototypeInput] = useState<AmpPrototypeInput>(INITIAL_AMP_PROTOTYPE_INPUT);
    const [monetizedArticleInput, setMonetizedArticleInput] = useState<MonetizedArticleCampaignInput>(INITIAL_MONETIZED_ARTICLE_CAMPAIGN_INPUT);
    const [seoBlogInput, setSeoBlogInput] = useState<SeoBlogInput>(INITIAL_SEO_BLOG_INPUT);
    const [emailSubjectInput, setEmailSubjectInput] = useState<EmailSubjectInput>(INITIAL_EMAIL_SUBJECT_INPUT);
    const [emailBodyInput, setEmailBodyInput] = useState<EmailBodyInput>(INITIAL_EMAIL_BODY_INPUT);
    const [engagementBoosterInput, setEngagementBoosterInput] = useState<EngagementBoosterInput>(INITIAL_ENGAGEMENT_BOOSTER_INPUT);
    const [brandVoiceInput, setBrandVoiceInput] = useState<BrandVoiceInput>(INITIAL_BRAND_VOICE_INPUT);
    const [contentLifecycleInput, setContentLifecycleInput] = useState<ContentLifecycleInput>(INITIAL_CONTENT_LIFECYCLE_INPUT);
    const [automatedResponderInput, setAutomatedResponderInput] = useState<AutomatedResponderInput>(INITIAL_AUTOMATED_RESPONDER_INPUT);
    const [whatsAppAutoResponderInput, setWhatsAppAutoResponderInput] = useState<WhatsAppAutoResponderInput>(INITIAL_WHATSAPP_AUTO_RESPONDER_INPUT);
    const [postEngagementStrategistInput, setPostEngagementStrategistInput] = useState<PostEngagementStrategistInput>(INITIAL_POST_ENGAGEMENT_STRATEGIST_INPUT);
    const [brandContext, setBrandContext] = useState<string>(BRAND_CONTEXT_TEXT);
    const [commentsText, setCommentsText] = useState<string>('');
    const [task, setTask] = useState<TaskType>('Social Media');
    
    // Model Config State
    const [numVariations, setNumVariations] = useState<number>(1);
    const [temperature, setTemperature] = useState<number>(0.7);
    const [model, setModel] = useState<ModelType>('gemini-2.5-flash');
    const [autoLinkKeywords, setAutoLinkKeywords] = useState<boolean>(true);
    
    const resetFormStates = () => {
        setTopic('');
        setUrl('');
        setInputImage(null);
        setIsUploadingImage(false);
        setGuidedInput(INITIAL_GUIDED_INPUT);
        setAdCreativeInput(INITIAL_AD_CREATIVE_INPUT);
        setAllianceAdInput(INITIAL_ALLIANCE_AD_INPUT);
        setVoiceDialogInput(INITIAL_VOICE_DIALOG_INPUT);
        setGoogleBusinessPostInput(INITIAL_GOOGLE_BUSINESS_POST_INPUT);
        setAmpPrototypeInput(INITIAL_AMP_PROTOTYPE_INPUT);
        setMonetizedArticleInput(INITIAL_MONETIZED_ARTICLE_CAMPAIGN_INPUT);
        setSeoBlogInput(INITIAL_SEO_BLOG_INPUT);
        setEmailSubjectInput(INITIAL_EMAIL_SUBJECT_INPUT);
        setEmailBodyInput(INITIAL_EMAIL_BODY_INPUT);
        setEngagementBoosterInput(INITIAL_ENGAGEMENT_BOOSTER_INPUT);
        setBrandVoiceInput(INITIAL_BRAND_VOICE_INPUT);
        setContentLifecycleInput(INITIAL_CONTENT_LIFECYCLE_INPUT);
        setAutomatedResponderInput(INITIAL_AUTOMATED_RESPONDER_INPUT);
        setWhatsAppAutoResponderInput(INITIAL_WHATSAPP_AUTO_RESPONDER_INPUT);
        setPostEngagementStrategistInput(INITIAL_POST_ENGAGEMENT_STRATEGIST_INPUT);
        setCommentsText('');
        setTask('Social Media');
    };

    return {
        formStates: {
            topic, url, inputImage, isUploadingImage, guidedInput, adCreativeInput, allianceAdInput,
            voiceDialogInput, googleBusinessPostInput, ampPrototypeInput, monetizedArticleInput,
            seoBlogInput, brandContext, commentsText, emailSubjectInput, emailBodyInput, engagementBoosterInput,
            brandVoiceInput, contentLifecycleInput, automatedResponderInput, whatsAppAutoResponderInput, task,
            postEngagementStrategistInput
        },
        setters: {
            setTopic, setUrl, setInputImage, setIsUploadingImage, setGuidedInput, setAdCreativeInput,
            setAllianceAdInput, setVoiceDialogInput, setGoogleBusinessPostInput, setAmpPrototypeInput,
            setMonetizedArticleInput, setSeoBlogInput, setBrandContext, setCommentsText,
            setEmailSubjectInput, setEmailBodyInput, setEngagementBoosterInput, setBrandVoiceInput,
            setContentLifecycleInput, setAutomatedResponderInput, setWhatsAppAutoResponderInput, setTask,
            setPostEngagementStrategistInput
        },
        modelConfig: {
            numVariations, temperature, model, autoLinkKeywords
        },
        modelConfigSetters: {
            setNumVariations, setTemperature, setModel, setAutoLinkKeywords
        },
        resetFormStates
    };
};