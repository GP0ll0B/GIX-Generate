import React from 'react';
import { PostType, GuidedPostInput, AdCreativeInput, VoiceDialogInput, GoogleBusinessPostInput, ModelType, AllianceAdInput, AmpPrototypeInput, MonetizedArticleCampaignInput, SeoBlogInput, GeneratedContent, EmailSubjectInput, EmailBodyInput, EngagementBoosterInput, BrandVoiceInput, AutomatedResponderInput, TaskType, PostEngagementStrategistInput } from '../../types';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { TopicForm } from '../forms/TopicForm';
import { GuidedPostForm } from '../forms/GuidedPostForm';
import { AdCreativeForm } from '../AdCreativeForm';
import { AnalysisForm } from '../forms/AnalysisForm';
import { VoiceDialogForm } from '../forms/VoiceDialogForm';
import { GoogleBusinessPostForm } from '../forms/GoogleBusinessPostForm';
import { AllianceAdForm } from '../forms/AllianceAdForm';
import { AmpPrototypeForm } from '../forms/AmpPrototypeForm';
import { MonetizedArticleForm } from '../forms/MonetizedArticleForm';
import { SeoBlogForm } from '../forms/SeoBlogForm';
import { EmailSubjectForm } from '../forms/EmailSubjectForm';
import { EmailBodyForm } from '../forms/EmailBodyForm';
import { Tabs } from '../ui/Tabs';
import { SparklesIcon, CubeIcon } from '../ui/icons';
import { AutomatedResponderForm } from '../forms/AutomatedResponderForm';

interface ControlPanelProps {
  postType: PostType;
  onTabSelect: (type: PostType) => void;
  topic: string;
  setTopic: (topic: string) => void;
  url: string;
  setUrl: (url: string) => void;
  guidedInput: GuidedPostInput;
  setGuidedInput: React.Dispatch<React.SetStateAction<GuidedPostInput>>;
  adCreativeInput: AdCreativeInput;
  setAdCreativeInput: React.Dispatch<React.SetStateAction<AdCreativeInput>>;
  allianceAdInput: AllianceAdInput;
  setAllianceAdInput: React.Dispatch<React.SetStateAction<AllianceAdInput>>;
  googleBusinessPostInput: GoogleBusinessPostInput;
  setGoogleBusinessPostInput: React.Dispatch<React.SetStateAction<GoogleBusinessPostInput>>;
  ampPrototypeInput: AmpPrototypeInput;
  setAmpPrototypeInput: React.Dispatch<React.SetStateAction<AmpPrototypeInput>>;
  monetizedArticleInput: MonetizedArticleCampaignInput;
  setMonetizedArticleInput: React.Dispatch<React.SetStateAction<MonetizedArticleCampaignInput>>;
  seoBlogInput: SeoBlogInput;
  setSeoBlogInput: React.Dispatch<React.SetStateAction<SeoBlogInput>>;
  voiceDialogInput: VoiceDialogInput;
  setVoiceDialogInput: React.Dispatch<React.SetStateAction<VoiceDialogInput>>;
  emailSubjectInput: EmailSubjectInput;
  setEmailSubjectInput: React.Dispatch<React.SetStateAction<EmailSubjectInput>>;
  emailBodyInput: EmailBodyInput;
  setEmailBodyInput: React.Dispatch<React.SetStateAction<EmailBodyInput>>;
  engagementBoosterInput: EngagementBoosterInput;
  setEngagementBoosterInput: React.Dispatch<React.SetStateAction<EngagementBoosterInput>>;
  brandVoiceInput: BrandVoiceInput;
  setBrandVoiceInput: React.Dispatch<React.SetStateAction<BrandVoiceInput>>;
  automatedResponderInput: AutomatedResponderInput;
  setAutomatedResponderInput: React.Dispatch<React.SetStateAction<AutomatedResponderInput>>;
  postEngagementStrategistInput: PostEngagementStrategistInput;
  setPostEngagementStrategistInput: React.Dispatch<React.SetStateAction<PostEngagementStrategistInput>>;
  inputImage: { data: string; type: string; } | null;
  setInputImage: (image: { data: string; type: string; } | null) => void;
  isUploadingImage: boolean;
  setIsUploadingImage: (loading: boolean) => void;
  numVariations: number;
  setNumVariations: (n: number) => void;
  temperature: number;
  setTemperature: (t: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  model: ModelType;
  setModel: (model: ModelType) => void;
  currentPost: GeneratedContent | null;
  autoLinkKeywords: boolean;
  setAutoLinkKeywords: (enabled: boolean) => void;
  task: TaskType;
  setTask: (task: TaskType) => void;
}

const PostTypeSpecificForm: React.FC<Omit<ControlPanelProps, 'onGenerate' | 'isLoading' | 'error' | 'numVariations' | 'setNumVariations' | 'temperature' | 'setTemperature' | 'model' | 'setModel' | 'onTabSelect' | 'currentPost'>> = (props) => {
  const { postType } = props;
  
  switch (postType) {
    case 'text':
    case 'grounded_text':
    case 'image':
    case 'video':
    case 'video_generation':
    case 'blog':
    case 'post_engagement_strategist':
        return <TopicForm
          postType={postType}
          topic={props.topic}
          setTopic={props.setTopic}
          inputImage={props.inputImage}
          setInputImage={props.setInputImage}
          isUploadingImage={props.isUploadingImage}
          setIsUploadingImage={props.setIsUploadingImage}
          autoLinkKeywords={props.autoLinkKeywords}
          setAutoLinkKeywords={props.setAutoLinkKeywords}
          task={props.task}
          setTask={props.setTask}
        />;
    case 'guided':
        return <GuidedPostForm guidedInput={props.guidedInput} setGuidedInput={props.setGuidedInput} />;
    case 'ad':
        return <AdCreativeForm adCreativeInput={props.adCreativeInput} setAdCreativeInput={props.setAdCreativeInput} />;
     case 'alliance_ad':
        return <AllianceAdForm allianceAdInput={props.allianceAdInput} setAllianceAdInput={props.setAllianceAdInput} />;
    case 'analysis':
        return <AnalysisForm url={props.url} setUrl={props.setUrl} topic={props.topic} setTopic={props.setTopic} />;
    case 'voice_dialog':
        return <VoiceDialogForm voiceDialogInput={props.voiceDialogInput} setVoiceDialogInput={props.setVoiceDialogInput} />;
    case 'google_business_post':
        return <GoogleBusinessPostForm input={props.googleBusinessPostInput} setInput={props.setGoogleBusinessPostInput} />;
    case 'prototype':
        return <AmpPrototypeForm input={props.ampPrototypeInput} setInput={props.setAmpPrototypeInput} />;
    case 'monetized_article_campaign':
        return <MonetizedArticleForm input={props.monetizedArticleInput} setInput={props.setMonetizedArticleInput} />;
    case 'seo_blog_post':
        return <SeoBlogForm input={props.seoBlogInput} setInput={props.setSeoBlogInput} autoLinkKeywords={props.autoLinkKeywords} setAutoLinkKeywords={props.setAutoLinkKeywords} />;
    case 'email_subject':
        return <EmailSubjectForm input={props.emailSubjectInput} setInput={props.setEmailSubjectInput} />;
    case 'email_body':
        return <EmailBodyForm input={props.emailBodyInput} setInput={props.setEmailBodyInput} />;
    case 'automated_responder':
        return <AutomatedResponderForm input={props.automatedResponderInput} setInput={props.setAutomatedResponderInput} />;
    default:
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          Select a post type to begin.
        </div>
      );
  }
};

const ModelConfigPanel: React.FC<Pick<ControlPanelProps, 'numVariations' | 'setNumVariations' | 'temperature' | 'setTemperature' | 'model' | 'setModel' | 'postType'>> = 
  ({ numVariations, setNumVariations, temperature, setTemperature, model, setModel, postType }) => {

  const showNumVariations = !['comment_analysis', 'seo_blog_post', 'automated_responder'].includes(postType);

  return (
    <div className="space-y-4">
       <div>
            <label className="font-semibold text-gray-800 dark:text-gray-200">Model</label>
            <Tabs
                options={[
                    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', icon: <SparklesIcon className="h-4 w-4" /> },
                    { value: 'aiko-360m-instruct', label: 'Aiko360-Instruct', icon: <CubeIcon className="h-4 w-4" /> }
                ]}
                active={model}
                onSelect={(val) => setModel(val as ModelType)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {model === 'aiko-360m-instruct' 
                    ? "A small, efficient on-device model for quick, standard tasks. (Simulated)" 
                    : "A powerful, state-of-the-art cloud model for complex and creative tasks."}
            </p>
        </div>
       {showNumVariations && (
        <div>
            <label htmlFor="numVariations" className="font-semibold text-gray-800 dark:text-gray-200">
                Number of Variations
            </label>
            <input
                id="numVariations"
                type="number"
                value={numVariations}
                onChange={(e) => setNumVariations(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                min="1"
                max="5"
            />
        </div>
      )}
      <div>
        <label htmlFor="temperature" className="font-semibold text-gray-800 dark:text-gray-200">
            Creativity Level (Temperature: {temperature.toFixed(1)})
        </label>
        <input
            id="temperature"
            type="range"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            min="0.1"
            max="1.0"
            step="0.1"
        />
      </div>
    </div>
  );
}


export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    return (
        <div className="space-y-6">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Content Generator</h2>
                <PostTypeSpecificForm {...props} />
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Model Configuration</h2>
                 <ModelConfigPanel {...props} />
            </div>

            <div className="sticky bottom-0 py-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-lg -mx-8 px-8">
                <Button 
                    onClick={props.onGenerate} 
                    disabled={props.isLoading || (props.postType === 'analysis' && (!props.url || !props.topic)) || (props.postType === 'text' && props.task === 'Visual Q&A' && !props.inputImage)}
                    className="w-full text-lg"
                >
                    {props.isLoading ? <Loader text="Generating..." /> : 'Generate'}
                </Button>
                {props.error && !props.isLoading && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-3 py-2 rounded-md text-sm" role="alert">
                        <p><span className="font-bold">Error:</span> {props.error}</p>
                    </div>
                )}
                 {props.currentPost?.type === 'video_generation' && props.currentPost.status === 'generating' && (
                    <div className="mt-4 text-center text-sm text-blue-600 dark:text-blue-400">
                        <Loader text={props.currentPost.pollingMessage} />
                    </div>
                 )}
            </div>
        </div>
    );
};