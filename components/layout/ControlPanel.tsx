import React from 'react';
import { PostType, GuidedPostInput, AdCreativeInput, VoiceDialogInput, GoogleBusinessPostInput, ModelType, AllianceAdInput, AmpPrototypeInput, MonetizedArticleCampaignInput, SeoBlogInput, GeneratedContent } from '../../constants';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { TopicForm } from '../forms/TopicForm';
import { GuidedPostForm } from '../forms/GuidedPostForm';
import { AdCreativeForm } from '../forms/AdCreativeForm';
import { AnalysisForm } from '../forms/AnalysisForm';
import { VoiceDialogForm } from '../forms/VoiceDialogForm';
import { GoogleBusinessPostForm } from '../forms/GoogleBusinessPostForm';
import { AllianceAdForm } from '../forms/AllianceAdForm';
import { AmpPrototypeForm } from '../forms/AmpPrototypeForm';
import { MonetizedArticleForm } from '../forms/MonetizedArticleForm';
import { SeoBlogForm } from '../forms/SeoBlogForm';

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
  videoInputImage: { data: string; type: string; } | null;
  setVideoInputImage: (image: { data: string; type: string; } | null) => void;
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
}

const PostTypeSpecificForm: React.FC<Pick<ControlPanelProps, 'postType' | 'topic' | 'setTopic' | 'url' | 'setUrl' | 'guidedInput' | 'setGuidedInput' | 'adCreativeInput' | 'setAdCreativeInput' | 'allianceAdInput' | 'setAllianceAdInput' | 'voiceDialogInput' | 'setVoiceDialogInput' | 'videoInputImage' | 'setVideoInputImage' | 'googleBusinessPostInput' | 'setGoogleBusinessPostInput' | 'ampPrototypeInput' | 'setAmpPrototypeInput' | 'monetizedArticleInput' | 'setMonetizedArticleInput' | 'seoBlogInput' | 'setSeoBlogInput'>> = ({
  postType, topic, setTopic, url, setUrl, guidedInput, setGuidedInput, adCreativeInput, setAdCreativeInput, allianceAdInput, setAllianceAdInput, voiceDialogInput, setVoiceDialogInput, videoInputImage, setVideoInputImage, googleBusinessPostInput, setGoogleBusinessPostInput, ampPrototypeInput, setAmpPrototypeInput, monetizedArticleInput, setMonetizedArticleInput, seoBlogInput, setSeoBlogInput
}) => {
  switch (postType) {
    case 'text':
    case 'grounded_text':
    case 'image':
    case 'video':
    case 'video_generation':
    case 'blog':
      return <TopicForm topic={topic} setTopic={setTopic} postType={postType} videoInputImage={videoInputImage} setVideoInputImage={setVideoInputImage} />;
    case 'guided':
      return <GuidedPostForm guidedInput={guidedInput} setGuidedInput={setGuidedInput} />;
    case 'ad':
      return <AdCreativeForm adCreativeInput={adCreativeInput} setAdCreativeInput={setAdCreativeInput} />;
    case 'alliance_ad':
      return <AllianceAdForm allianceAdInput={allianceAdInput} setAllianceAdInput={setAllianceAdInput} />;
    case 'analysis':
      return <AnalysisForm url={url} setUrl={setUrl} topic={topic} setTopic={setTopic} />;
    case 'voice_dialog':
        return <VoiceDialogForm voiceDialogInput={voiceDialogInput} setVoiceDialogInput={setVoiceDialogInput} />
    case 'google_business_post':
        return <GoogleBusinessPostForm input={googleBusinessPostInput} setInput={setGoogleBusinessPostInput} />
    case 'prototype':
        return <AmpPrototypeForm input={ampPrototypeInput} setInput={setAmpPrototypeInput} />;
    case 'monetized_article_campaign':
        return <MonetizedArticleForm input={monetizedArticleInput} setInput={setMonetizedArticleInput} />;
    case 'seo_blog_post':
        return <SeoBlogForm input={seoBlogInput} setInput={setSeoBlogInput} />;
    default:
      return null;
  }
};

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const { onGenerate, isLoading, error, numVariations, setNumVariations, temperature, setTemperature, model, setModel } = props;

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10 space-y-6 self-start lg:sticky lg:top-8">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Generation Settings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure the inputs for the AI content generator.</p>
            </div>

            <PostTypeSpecificForm {...props} />

            <div className="border-t border-gray-200/50 dark:border-gray-600/50 pt-6 space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Model Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="variations" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variations</label>
                        <input
                            type="number"
                            id="variations"
                            value={numVariations}
                            onChange={(e) => setNumVariations(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max="5"
                            className="w-full mt-1 p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                         <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
                        <select
                            id="model-select"
                            value={model}
                            onChange={(e) => setModel(e.target.value as ModelType)}
                            className="w-full mt-1 p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="aiko-360m-instruct">Aiko360-Instruct (Simulated)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Creativity (Temperature): {temperature}
                    </label>
                    <input
                        type="range"
                        id="temperature"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full mt-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                </div>
            </div>

            <Button onClick={onGenerate} disabled={isLoading} className="w-full">
                {isLoading ? <Loader text="Generating..." /> : 'Generate'}
            </Button>
            {error && !isLoading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-3 py-2 rounded-md text-sm" role="alert">
                    <p><span className="font-bold">Error:</span> {error}</p>
                </div>
            )}
        </div>
    );
};