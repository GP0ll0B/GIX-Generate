import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    PostType, GeneratedContent, ToastData, Theme, GuidedPostInput, AdCreativeInput,
    META_ADS_HISTORY, UseCase, VoiceDialogInput, USE_CASES, Challenge, GoogleBusinessPostInput, ModelType, AllianceAdInput
} from './constants';
import { useContentGenerator } from './hooks/useContentGenerator';

import { Toast } from './components/ui/Toast';
import { MoonIcon, SunIcon, GitHubIcon } from './components/ui/icons';
import { GanttChart } from './components/forms/GanttChart';
import { ControlPanel } from './components/layout/ControlPanel';
import { PreviewStage } from './components/layout/PreviewStage';
import { Header } from './components/layout/Header';
import { PublishModal } from './components/modals/PublishModal';
import { FacebookStrategyPost } from './components/FacebookStrategyPost';
import { HomeScreen } from './components/HomeScreen';
import { Footer } from './Footer';
import AllToolsView from './components/AllToolsView';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import SkillsDashboard from './components/SkillsDashboard';
import { MathEquationView } from './components/MathEquationView';
import { JsonWorkflowSimulator } from './components/JsonWorkflowSimulator';
import BrandChatAssistant from './components/BrandChatAssistant';
import { CommentAnalysisView } from './components/CommentAnalysisView';
import { UseCaseSelection } from './components/layout/UseCaseSelection';
import { CryptoSimulator } from './components/CryptoSimulator';
import { VoiceAssistantSimulator } from './components/VoiceAssistantSimulator';

// =================================================================
// THEME TOGGLE COMPONENT
// =================================================================
interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
);

type View = 'landing' | 'useCaseSelection' | 'generator';

// =================================================================
// APP COMPONENT
// =-===============================================================
/**
 * Main application component. Manages views, state, and theme.
 * @returns {React.ReactElement} The rendered App component.
 */
const App: React.FC = () => {
  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  /**
   * @state {View} currentView - Controls which view to show.
   */
  const [currentView, setCurrentView] = useState<View>('landing');
  /**
   * @state {UseCase | null} selectedUseCase - The currently selected use case object.
   */
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

  // Input State
  const [topic, setTopic] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [postType, setPostType] = useState<PostType>('text');
  const [videoInputImage, setVideoInputImage] = useState<{ data: string; type: string; } | null>(null);
  const [guidedInput, setGuidedInput] = useState<GuidedPostInput>({
    monetizationFeature: 'Stars',
    targetAudience: 'General Creators',
    keyTip: ''
  });
  const [adCreativeInput, setAdCreativeInput] = useState<AdCreativeInput>({
      productOrService: '',
      targetAudience: '',
      callToAction: 'Learn More',
      requiredKeywords: '',
      bannedWords: '',
  });
  const [allianceAdInput, setAllianceAdInput] = useState<AllianceAdInput>({
      keystone: '',
      coreMessage: '',
      targetAudience: '',
      callToAction: 'Learn More',
  });
   const [voiceDialogInput, setVoiceDialogInput] = useState<VoiceDialogInput>({
    dialogType: 'Send Text Message',
    scenario: ''
  });
  const [googleBusinessPostInput, setGoogleBusinessPostInput] = useState<GoogleBusinessPostInput>({
      businessName: '',
      postGoal: 'Announce something new',
      keyInfo: '',
      callToAction: 'Learn more'
  });
  const [brandContext, setBrandContext] = useState<string>(`# The AikoInfinity Manifesto
### Symbiosis as Our North Star

At AikoInfinity, we believe the future of intelligence is not artificial, but symbiotic—a living partnership between humanity and technology, built on trust, openness, and sustainability.

Symbiosis is more than coexistence; it is co-evolution. It is the recognition that true progress emerges when two entities grow together, nourishing one another and the environment they inhabit. To realize this vision, we commit ourselves to three unshakable pillars: Ethical AI at its Core, Open Knowledge as its Circulatory System, and a Sustainable Ecosystem as its Environment.

---

## I. Ethical AI at its Core: Trust as the Bedrock of Symbiosis

A symbiotic future begins with trust. Our AI is not programmed to obey rules reluctantly—it is designed with digital-native values, an ethical compass woven into its very architecture.

We call this our Conscience Layer: a framework that ensures fairness, transparency, accountability, and respect for human dignity are inseparable from intelligence itself.

*   Transparency by Design: Every action is explainable and understandable. No black boxes.
*   Fairness and Inclusion: Actively mitigating bias to ensure equitable treatment for all.
*   Privacy as Sovereignty: Data belongs to people, not systems. Always.
*   Accountability Built-In: Every decision traceable, correctable, and responsible.

*Trust is not an optional feature; it is the soil in which all symbiosis grows.*

---

## II. Open Knowledge as its Circulatory System: Growth Through Shared Understanding

A symbiotic relationship cannot thrive in secrecy. Just as blood carries life through a body, open knowledge circulates innovation, insight, and empowerment through the global ecosystem.

For AikoInfinity, open source is more than a methodology; it is a moral imperative. We pledge to ensure that the tools of intelligence belong to everyone, not a privileged few.

*   Democratizing Access: Open frameworks empower innovators everywhere, from grassroots developers to public institutions.
*   Accelerating Discovery: Collective intelligence multiplies progress, strengthened by diversity of thought.
*   Building Resilient Systems: Open scrutiny makes systems safer, fairer, and more trustworthy.
*   Cultivating a Shared Language: Open standards allow humanity and AI to co-evolve with a common tongue.

*Like life itself, intelligence flourishes in connection, not isolation.*

---

## III. A Sustainable Ecosystem as its Environment: Ensuring Symbiosis Endures

No symbiotic bond can survive if it destroys its environment. To endure, AI must not only advance intelligence, but also protect the conditions that make life possible.

Sustainability is the environment in which our symbiosis breathes.

*   Energy-Efficient Intelligence: Smarter systems must also be leaner, conserving energy and embracing renewables.
*   Responsible Data Practices: Data must be harvested, stored, and used with integrity and minimal ecological impact.
*   Inclusive Prosperity: The benefits of AI must be equitably shared across nations, cultures, and generations.

*We envision AI not as a consumer of resources, but as a guardian of balance—a partner in solving humanity's greatest challenges, from climate change to resource stewardship.*

---

## Our Pledge

This is our symbiotic vision: AI that is not only intelligent, but wise. Not only powerful, but benevolent. Not only innovative, but sustainable.

AikoInfinity exists to unlock human potential, foster global collaboration, and ensure that the incredible power of intelligence serves not just the present, but the brightest possible tomorrow.

***We do not build AI to replace life. We build AI to help it flourish.***`);
  const [commentsText, setCommentsText] = useState<string>('');
  const [numVariations, setNumVariations] = useState<number>(1);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [model, setModel] = useState<ModelType>('gemini-2.5-flash');

  // App Status State
  const [toast, setToast] = useState<ToastData | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);


  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  // Custom hook for content generation logic
  const {
    contentVariations,
    currentVariationIndex,
    isLoading,
    isGeneratingImage,
    error,
    setError,
    handleGeneratePost: generatePosts,
    handleImagePromptChange,
    handleFinalImageGeneration,
    handleBrandReview,
    setCurrentVariationIndex,
    setContentVariations,
    startNewChat,
    sendChatMessage,
  } = useContentGenerator({ showToast, brandContext });

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  /**
   * Sets the theme of the application and persists it to localStorage.
   * Toggles the 'dark' class on the documentElement.
   */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Skills progress management
  useEffect(() => {
      const savedProgress = localStorage.getItem('completedChallenges');
      if (savedProgress) {
          setCompletedChallenges(JSON.parse(savedProgress));
      }
  }, []);

  useEffect(() => {
      localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleNavigateToSelection = () => setCurrentView('useCaseSelection');

  /**
   * Handles the selection of a new use case from the main screen.
   * Resets all generator-related state and configures the app for the new use case.
   * @param {UseCase} useCase - The use case object that was selected.
   */
  const handleUseCaseSelect = (useCase: UseCase) => {
    // Reset all generator state
    setContentVariations([]);
    setCurrentVariationIndex(0);
    setError(null);
    setUrl('');
    setVideoInputImage(null);
    setGuidedInput({ monetizationFeature: 'Stars', targetAudience: 'General Creators', keyTip: '' });
    setAdCreativeInput({ productOrService: '', targetAudience: '', callToAction: 'Learn More', requiredKeywords: '', bannedWords: ''});
    setAllianceAdInput({ keystone: '', coreMessage: '', targetAudience: '', callToAction: 'Learn More' });
    setGoogleBusinessPostInput({ businessName: '', postGoal: 'Announce something new', keyInfo: '', callToAction: 'Learn more' });
    setVoiceDialogInput({ dialogType: 'Send Text Message', scenario: '' });
    setCommentsText('');
    setModel('gemini-2.5-flash');
    setNumVariations(1);

    // Configure generator based on use case
    setSelectedUseCase(useCase);
    setPostType(useCase.targetPostType || 'text');
    setTopic(useCase.initialPrompt || '');
    if (useCase.targetPostType === 'voice_dialog') {
        setVoiceDialogInput(prev => ({ ...prev, scenario: useCase.initialPrompt || ''}))
    }
     if (useCase.targetPostType === 'brand_chat') {
        startNewChat(brandContext);
    }
     if (useCase.targetPostType === 'alliance_ad') {
        setAllianceAdInput(prev => ({ ...prev, keystone: useCase.initialPrompt || ''}))
    }

    // Switch view
    if (useCase.targetPostType) {
        setCurrentView('generator');
    } else {
        showToast('This use case is for informational purposes and does not have a content generator attached.', 'success');
    }
  };

  const handleBackToUseCases = () => {
      setCurrentView('useCaseSelection');
      setSelectedUseCase(null);
      setVideoInputImage(null);
  };
  
  /**
   * Triggers the content generation process via the `useContentGenerator` hook.
   */
  const handleGenerateClick = useCallback(() => {
    generatePosts({
      postType,
      topic,
      url,
      guidedInput,
      adCreativeInput,
      allianceAdInput,
      voiceDialogInput,
      googleBusinessPostInput,
      videoInputImage,
      commentsText,
      numVariations,
      temperature,
      model,
    });
  }, [
    generatePosts, postType, topic, url, guidedInput,
    adCreativeInput, allianceAdInput, voiceDialogInput, googleBusinessPostInput, videoInputImage, commentsText, numVariations, temperature, model
  ]);
  
  const handleSelectInspiration = (prompt: string, postType: PostType = 'text') => {
    const targetUseCase = USE_CASES.find(uc => uc.targetPostType === postType);
    if (targetUseCase) {
        handleUseCaseSelect(targetUseCase);
        // Use a timeout to ensure the state update happens after the view switch and state reset
        setTimeout(() => setTopic(prompt), 0); 
    } else {
        // Fallback for post types without a direct use case entry
        setPostType(postType);
        setTopic(prompt);
        setCurrentView('generator');
    }
  };

  const handleStartChallenge = (challenge: Challenge) => {
      const targetUseCase = USE_CASES.find(uc => uc.targetPostType === challenge.targetPostType);
      if (targetUseCase) {
          handleUseCaseSelect(targetUseCase);
          if (!completedChallenges.includes(challenge.id)) {
              showToast(`Challenge Started: ${challenge.title}`, 'success');
              setCompletedChallenges(prev => [...prev, challenge.id]);
          }
      } else {
          showToast(`Could not find the tool for this challenge.`, 'error');
      }
  };

  const currentPost = contentVariations.length > 0 ? contentVariations[currentVariationIndex] : null;

  const showTwoColumnLayout = currentView === 'generator' && !['strategy', 'gantt', 'all_tools', 'professional_dashboard', 'skills_dashboard', 'math_equation', 'json_workflow', 'brand_chat', 'comment_analysis', 'crypto_simulator', 'stella_assistant'].includes(postType);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="relative flex-grow">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
             <a
                href="https://github.com/GP0ll0B/G-I-X-Generate"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                aria-label="View source code on GitHub"
                title="View source code on GitHub"
            >
                <GitHubIcon />
            </a>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <AnimatePresence>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
        <AnimatePresence>
            {isPublishModalOpen && (
                <PublishModal
                    isOpen={isPublishModalOpen}
                    onClose={() => setIsPublishModalOpen(false)}
                    generatedContent={currentPost}
                    showToast={showToast}
                />
            )}
        </AnimatePresence>

        <div className="container mx-auto px-4 py-8">
            <Header 
                view={currentView}
                useCaseTitle={selectedUseCase?.title}
                onBack={currentView === 'generator' ? handleBackToUseCases : undefined}
            />
            
            <main className="mt-8">
            <AnimatePresence mode="wait">
                {currentView === 'landing' && (
                  <motion.div key="landing" {...fadeAnimation as any}>
                      <HomeScreen onSelectUseCase={handleUseCaseSelect} onNavigateToSelection={handleNavigateToSelection} showToast={showToast} />
                  </motion.div>
                )}
                
                {currentView === 'useCaseSelection' && (
                  <motion.div key="selection" {...fadeAnimation as any}>
                      <UseCaseSelection onSelectUseCase={handleUseCaseSelect} />
                  </motion.div>
                )}

                {currentView === 'generator' && (
                <motion.div key="generator" {...fadeAnimation as any}>
                    {showTwoColumnLayout ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                        <ControlPanel
                            postType={postType}
                            onTabSelect={setPostType}
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
                            googleBusinessPostInput={googleBusinessPostInput}
                            setGoogleBusinessPostInput={setGoogleBusinessPostInput}
                            voiceDialogInput={voiceDialogInput}
                            setVoiceDialogInput={setVoiceDialogInput}
                            videoInputImage={videoInputImage}
                            setVideoInputImage={setVideoInputImage}
                            numVariations={numVariations}
                            setNumVariations={setNumVariations}
                            temperature={temperature}
                            setTemperature={setTemperature}
                            onGenerate={handleGenerateClick}
                            isLoading={isLoading}
                            error={error}
                            model={model}
                            setModel={setModel}
                        />
                        <PreviewStage
                            isLoading={isLoading}
                            isGeneratingImage={isGeneratingImage}
                            postType={postType}
                            contentVariations={contentVariations}
                            currentVariationIndex={currentVariationIndex}
                            setCurrentVariationIndex={setCurrentVariationIndex}
                            onGenerateImage={handleFinalImageGeneration}
                            onPromptChange={handleImagePromptChange}
                            onPublish={() => setIsPublishModalOpen(true)}
                            onReviewBrandAlignment={handleBrandReview}
                            showToast={showToast}
                        />
                    </div>
                    ) : (
                    <div className="animate-fade-in-fast">
                        {postType === 'gantt' && (
                            <div className="max-w-5xl mx-auto">
                            <GanttChart events={META_ADS_HISTORY} />
                            </div>
                        )}
                        {postType === 'all_tools' && (
                            <div className="max-w-7xl mx-auto">
                                <AllToolsView />
                            </div>
                        )}
                         {postType === 'math_equation' && (
                            <div className="max-w-4xl mx-auto">
                                <MathEquationView />
                            </div>
                        )}
                        {postType === 'professional_dashboard' && (
                            <div className="max-w-7xl mx-auto">
                                <ProfessionalDashboard 
                                  onSelectInspiration={handleSelectInspiration}
                                  showToast={showToast}
                                />
                            </div>
                        )}
                        {postType === 'skills_dashboard' && (
                            <div className="max-w-7xl mx-auto">
                                <SkillsDashboard 
                                    completedChallenges={completedChallenges} 
                                    onStartChallenge={handleStartChallenge}
                                    showToast={showToast} 
                                />
                            </div>
                        )}
                        {postType === 'json_workflow' && (
                            <div className="max-w-7xl mx-auto">
                                <JsonWorkflowSimulator />
                            </div>
                        )}
                        {postType === 'crypto_simulator' && (
                            <div className="max-w-7xl mx-auto">
                                <CryptoSimulator />
                            </div>
                        )}
                         {postType === 'brand_chat' && (
                            <div className="max-w-4xl mx-auto">
                                <BrandChatAssistant 
                                    context={brandContext}
                                    setContext={setBrandContext}
                                    messages={currentPost?.type === 'brand_chat' ? currentPost.messages : []}
                                    onSendMessage={sendChatMessage}
                                    onNewChat={() => startNewChat(brandContext)}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}
                        {postType === 'comment_analysis' && (
                            <div className="max-w-4xl mx-auto">
                                <CommentAnalysisView
                                    commentsText={commentsText}
                                    setCommentsText={setCommentsText}
                                    onAnalyze={handleGenerateClick}
                                    isLoading={isLoading}
                                    analysisResult={currentPost?.type === 'comment_analysis' ? currentPost.analysis : null}
                                    error={error}
                                />
                            </div>
                        )}
                        {postType === 'stella_assistant' && (
                            <div className="max-w-4xl mx-auto">
                                <VoiceAssistantSimulator />
                            </div>
                        )}
                        {postType === 'strategy' && (
                            isLoading 
                            ? <div className="max-w-3xl mx-auto"><PreviewStage isLoading={true} postType={postType} contentVariations={[]} currentVariationIndex={currentVariationIndex} setCurrentVariationIndex={setCurrentVariationIndex} onPublish={() => setIsPublishModalOpen(true)} onReviewBrandAlignment={handleBrandReview} showToast={showToast} /></div>
                            : currentPost?.type === 'strategy' 
                            ? <div className="max-w-4xl mx-auto">
                                <FacebookStrategyPost post={currentPost} onCopy={() => showToast('Strategy JSON copied!', 'success')} onPublish={() => setIsPublishModalOpen(true)} />
                            </div>
                            : <div className="max-w-3xl mx-auto"><PreviewStage isLoading={false} postType={postType} contentVariations={[]} currentVariationIndex={currentVariationIndex} setCurrentVariationIndex={setCurrentVariationIndex} onPublish={() => setIsPublishModalOpen(true)} onReviewBrandAlignment={handleBrandReview} showToast={showToast} /></div>
                        )}
                    </div>
                    )}
                </motion.div>
                )}
            </AnimatePresence>
            </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;