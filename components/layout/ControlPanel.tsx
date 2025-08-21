import React, { useMemo } from 'react';
import { PostType, GuidedPostInput, AdCreativeInput, VoiceDialogInput, GoogleBusinessPostInput, ModelType, AllianceAdInput } from '../../constants';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { ChartBarIcon, FileJsonIcon, MegaphoneIcon, MicrophoneIcon, VideoCameraIcon, GridIcon, GrowthIcon, BuildingStorefrontIcon, InfoIcon, HandshakeIcon } from '../ui/icons';
import { TopicForm } from '../forms/TopicForm';
import { GuidedPostForm } from '../forms/GuidedPostForm';
import { AdCreativeForm } from '../forms/AdCreativeForm';
import { AnalysisForm } from '../forms/AnalysisForm';
import { VoiceDialogForm } from '../forms/VoiceDialogForm';
import { GoogleBusinessPostForm } from '../forms/GoogleBusinessPostForm';
import { AllianceAdForm } from '../forms/AllianceAdForm';

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
}

const PostTypeSpecificForm: React.FC<Pick<ControlPanelProps, 'postType' | 'topic' | 'setTopic' | 'url' | 'setUrl' | 'guidedInput' | 'setGuidedInput' | 'adCreativeInput' | 'setAdCreativeInput' | 'allianceAdInput' | 'setAllianceAdInput' | 'voiceDialogInput' | 'setVoiceDialogInput' | 'videoInputImage' | 'setVideoInputImage' | 'googleBusinessPostInput' | 'setGoogleBusinessPostInput'>> = ({
  postType, topic, setTopic, url, setUrl, guidedInput, setGuidedInput, adCreativeInput, setAdCreativeInput, allianceAdInput, setAllianceAdInput, voiceDialogInput, setVoiceDialogInput, videoInputImage, setVideoInputImage, googleBusinessPostInput, setGoogleBusinessPostInput
}) => {
  switch (postType) {
    case 'text':
    case 'grounded_text':
    case 'image':
    case 'video':
    case 'video_generation':
      return <TopicForm topic={topic} setTopic={setTopic} postType={postType} videoInputImage={videoInputImage} setVideoInputImage={setVideoInputImage} />;
    case 'analysis':
      return <AnalysisForm url={url} setUrl={setUrl} topic={topic} setTopic={setTopic} />;
    case 'guided':
      return <GuidedPostForm guidedInput={guidedInput} setGuidedInput={setGuidedInput} />;
    case 'ad':
      return <AdCreativeForm adCreativeInput={adCreativeInput} setAdCreativeInput={setAdCreativeInput} />;
     case 'alliance_ad':
      return <AllianceAdForm allianceAdInput={allianceAdInput} setAllianceAdInput={setAllianceAdInput} />;
    case 'google_business_post':
      return <GoogleBusinessPostForm input={googleBusinessPostInput} setInput={setGoogleBusinessPostInput} />;
    case 'voice_dialog':
      return <VoiceDialogForm voiceDialogInput={voiceDialogInput} setVoiceDialogInput={setVoiceDialogInput} />;
    case 'strategy':
    case 'gantt':
    case 'all_tools':
    case 'professional_dashboard':
    case 'skills_dashboard':
    default:
      return null;
  }
};


export const ControlPanel: React.FC<ControlPanelProps> = ({
  postType, onTabSelect, topic, setTopic, url, setUrl,
  guidedInput, setGuidedInput, adCreativeInput, setAdCreativeInput, allianceAdInput, setAllianceAdInput,
  googleBusinessPostInput, setGoogleBusinessPostInput,
  voiceDialogInput, setVoiceDialogInput, videoInputImage, setVideoInputImage,
  numVariations, setNumVariations, temperature, setTemperature,
  onGenerate, isLoading, error, model, setModel
}) => {
  const tabsOptions = useMemo(() => [
    { value: 'text' as PostType, label: 'Text Post' },
    { value: 'guided' as PostType, label: 'Guided Post' },
    { value: 'ad' as PostType, label: 'Ad Campaign', icon: <MegaphoneIcon/> },
    { value: 'alliance_ad' as PostType, label: 'Alliance Ad', icon: <HandshakeIcon/> },
    { value: 'google_business_post' as PostType, label: 'Google Business', icon: <BuildingStorefrontIcon className="h-5 w-5" /> },
    { value: 'grounded_text' as PostType, label: 'Fact-Checked Post' },
    { value: 'image' as PostType, label: 'Image Post' },
    { value: 'video' as PostType, label: 'Video Script' },
    { value: 'video_generation' as PostType, label: 'Generate Video', icon: <VideoCameraIcon/> },
    { value: 'voice_dialog' as PostType, label: 'Voice Dialog', icon: <MicrophoneIcon /> },
    { value: 'analysis' as PostType, label: 'Analysis Post' },
    { value: 'strategy' as PostType, label: 'Strategy Plan', icon: <FileJsonIcon/> },
    { value: 'gantt' as PostType, label: 'Gantt Chart', icon: <ChartBarIcon/> },
    { value: 'professional_dashboard' as PostType, label: 'Page Growth', icon: <GrowthIcon /> },
    { value: 'all_tools' as PostType, label: 'All Tools', icon: <GridIcon /> },
  ], []);

  const showInputs = !['strategy', 'gantt', 'all_tools', 'professional_dashboard', 'skills_dashboard', 'math_equation'].includes(postType);
  const showModelSelector = ['text', 'guided', 'video'].includes(postType);

  const getLoadingText = () => {
    switch (postType) {
        case 'video_generation': return "Generating Video...";
        case 'image':
        case 'ad':
        case 'alliance_ad':
        case 'google_business_post':
             return "Generating Text..."; // The image itself is separate
        case 'strategy': return "Generating Strategy...";
        case 'comment_analysis': return "Analyzing...";
        default: return "Generating...";
    }
  };

  return (
    <div className="lg:sticky lg:top-8 self-start">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
        <div className="flex flex-col gap-4">
          <Tabs<PostType> options={tabsOptions} active={postType} onSelect={onTabSelect} />
          
          {postType === 'video_generation' && (
            <div className="mt-4 p-3 bg-yellow-500/10 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-lg space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
                <div className="flex items-center gap-2 font-bold">
                    <InfoIcon />
                    <span>Feature Notice: Quota Limitations</span>
                </div>
                <p>
                    AI video generation is highly resource-intensive. The Gemini API free tier has very strict quotas for this feature, which can result in a <strong>429 "Resource Exhausted"</strong> error.
                </p>
                <p>
                    To prevent this error, video generation has been disabled in this interface. This feature typically requires a billed account with Google AI Studio.
                </p>
            </div>
          )}

          {showInputs && (
            <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
              <PostTypeSpecificForm 
                postType={postType} 
                topic={topic} 
                setTopic={setTopic} 
                url={url} 
                setUrl={setUrl} 
                guidedInput={guidedInput} 
                setGuidedInput={setGuidedInput} 
                adCreativeInput={adCreativeInput} 
                setAdCreativeInput={setAdCreativeInput}
                allianceAdInput={allianceAdInput}
                setAllianceAdInput={setAllianceAdInput}
                voiceDialogInput={voiceDialogInput} 
                setVoiceDialogInput={setVoiceDialogInput} 
                videoInputImage={videoInputImage}
                setVideoInputImage={setVideoInputImage}
                googleBusinessPostInput={googleBusinessPostInput}
                setGoogleBusinessPostInput={setGoogleBusinessPostInput}
              />
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="variations" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Variations</label>
                  <input type="range" id="variations" min="1" max="4" value={numVariations} onChange={e => setNumVariations(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>1</span><span>2</span><span>3</span><span>4</span></div>
                </div>
                <div>
                  <label htmlFor="temperature" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Creativity (Temperature)</label>
                  <input type="range" id="temperature" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>Precise</span><span>Creative</span></div>
                </div>
                {showModelSelector && (
                    <div>
                        <label htmlFor="model" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Model</label>
                        <select id="model" value={model} onChange={e => setModel(e.target.value as ModelType)} className="w-full mt-1 p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm">
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                            <option value="smollm-2-360m">SmolLM-2 360M (Fast, Local Simulation)</option>
                        </select>
                    </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
            <Button
              onClick={onGenerate}
              disabled={isLoading || postType === 'video_generation'}
              className="w-full"
            >
              {isLoading ? <Loader text={getLoadingText()} /> : 'Generate'}
            </Button>
            {error && (
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-3 py-2 rounded-md text-sm" role="alert">
                <p><span className="font-bold">Error:</span> {error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};