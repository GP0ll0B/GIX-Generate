import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PostType, GeneratedContent, ToastData, Theme, UseCase, Challenge, HistoryItem } from './types';
import { SINGLE_COLUMN_POST_TYPES } from './constants';
import { USE_CASES, META_ADS_HISTORY } from './appData';
import { useContentGenerator } from './hooks/useContentGenerator';
import { useFormState } from './hooks/useFormState';

import { Toast } from './components/ui/Toast';
import { MoonIcon, SunIcon, GitHubIcon } from './components/ui/icons';
import { GanttChart } from './components/forms/GanttChart';
import { ControlPanel } from './components/layout/ControlPanel';
import { PreviewStage } from './components/layout/PreviewStage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PublishModal } from './components/modals/PublishModal';
import { FacebookStrategyPost } from './components/FacebookStrategyPost';
import { Footer } from './Footer';
import AllToolsView from './components/AllToolsView';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import SkillsDashboard from './components/SkillsDashboard';
import { MathEquationView } from './components/MathEquationView';
import { JsonWorkflowSimulator } from './components/JsonWorkflowSimulator';
import { BrandChatAssistant } from './components/BrandChatAssistant';
import { CommentAnalysisView } from './components/CommentAnalysisView';
import { CryptoSimulator } from './components/CryptoSimulator';
import { VoiceAssistantSimulator } from './VoiceAssistantSimulator';
import AIDataProvenanceView from './components/AIDataProvenanceView';
import AIGuideView from './components/AIGuideView';
import { AikoModelCard } from './components/AikoModelCard';
import { HistoryView } from './components/HistoryView';
import { HomeScreen } from './components/HomeScreen';
import { UseCaseSelection } from './components/layout/UseCaseSelection';
import { CharacterDossier } from './components/CharacterDossier';
import VideoGenerator from './components/VideoGenerator';
import PhoneVerificationView from './components/PhoneVerificationView';
import { EngagementBoosterView } from './components/EngagementBoosterView';
import { BrandVoiceKitView } from './components/BrandVoiceKitView';
import PagePerformanceView from './components/PagePerformanceView';
import PredictiveEngineView from './components/PredictiveEngineView';
import { ContentLifecycleAssistant } from './components/ContentLifecycleAssistant';
import { AutomatedResponderPost } from './components/AutomatedResponderPost';
import { StrategicRoadmapView } from './components/StrategicRoadmapView';
import { PageImporterView } from './components/PageImporterView';
import { DashboardImporterView } from './components/DashboardImporterView';
import SymbioticFeedbackLoopView from './components/SymbioticFeedbackLoopView';
import { WhatsAppAutoResponderView } from './components/WhatsAppAutoResponderView';
import { PostEngagementStrategistView } from './components/PostEngagementStrategistView';

const MotionDiv = motion.div as any;

// =================================================================
// THEME HELPERS & TOGGLE
// =================================================================

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (storedPrefs === 'dark' || storedPrefs === 'light') {
      return storedPrefs;
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};


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

// =================================================================
// MAIN APP COMPONENT
// =================================================================

export const App: React.FC = () => {
  // --- State Management ---
  const [activeUseCase, setActiveUseCase] = useState<UseCase | null>(null);
  const activePostType = activeUseCase?.targetPostType || 'text';
  const [toast, setToast] = useState<ToastData | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  
  const {
      formStates, setters, modelConfig, modelConfigSetters, resetFormStates
  } = useFormState();

  const {
      contentVariations, currentVariationIndex, isLoading, isGeneratingImage, error,
      handleGeneratePost, handleImagePromptChange, handleFinalImageGeneration, handleBrandReview,
      setCurrentVariationIndex, setContentVariations, startNewChat, sendChatMessage, handleGenerateSeoArticle, setError
  } = useContentGenerator({ showToast, brandContext: formStates.brandContext });

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Callbacks & Event Handlers ---
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
  }

  const handleGenerate = () => {
    handleGeneratePost({
      postType: activePostType,
      topic: formStates.topic,
      url: formStates.url,
      guidedInput: formStates.guidedInput,
      adCreativeInput: formStates.adCreativeInput,
      allianceAdInput: formStates.allianceAdInput,
      voiceDialogInput: formStates.voiceDialogInput,
      googleBusinessPostInput: formStates.googleBusinessPostInput,
      ampPrototypeInput: formStates.ampPrototypeInput,
      monetizedArticleInput: formStates.monetizedArticleInput,
      seoBlogInput: formStates.seoBlogInput,
      brandVoiceInput: formStates.brandVoiceInput,
      engagementBoosterInput: formStates.engagementBoosterInput,
      automatedResponderInput: formStates.automatedResponderInput,
      whatsAppAutoResponderInput: formStates.whatsAppAutoResponderInput,
      postEngagementStrategistInput: formStates.postEngagementStrategistInput,
      inputImage: formStates.inputImage,
      commentsText: formStates.commentsText,
      numVariations: modelConfig.numVariations,
      temperature: modelConfig.temperature,
      model: modelConfig.model,
      autoLinkKeywords: modelConfig.autoLinkKeywords,
      task: formStates.task,
    });
  };
  
  const handleSelectUseCase = (useCase: UseCase) => {
    setError(null);
    setContentVariations([]);
    resetFormStates();
    setActiveUseCase(useCase);
    if (useCase.initialPrompt) {
        setters.setTopic(useCase.initialPrompt);
    }
  };

  const handleBack = () => {
    setActiveUseCase(null);
    setContentVariations([]);
    setError(null);
    resetFormStates();
  };
  
  const handleLoadHistoryItem = (item: HistoryItem) => {
      const correspondingUseCase = USE_CASES.find(uc => uc.targetPostType === item.postType);
      if (correspondingUseCase) {
          setActiveUseCase(correspondingUseCase);
          setContentVariations(item.variations);
          setCurrentVariationIndex(0);
          setError(null);
          // TODO: Optionally restore form state from history item if needed
      } else {
          showToast(`Could not find a use case for post type: ${item.postType}`, 'error');
      }
  };
  
  const handleStartChallenge = (challenge: Challenge) => {
    const useCase = USE_CASES.find(uc => uc.targetPostType === challenge.targetPostType);
    if (useCase) {
        handleSelectUseCase(useCase);
        showToast(`Challenge Started: ${challenge.title}!`, 'success');
    }
  }
  
  const handleClearCompleted = () => {
    setCompletedChallenges([]);
    showToast('Cleared all completed challenges!', 'success');
  };

  // --- Render Logic ---
  const isSingleColumn = SINGLE_COLUMN_POST_TYPES.has(activePostType);
  const currentPostForModal = contentVariations.length > 0 ? contentVariations[currentVariationIndex] : null;

  useEffect(() => {
      const loader = document.getElementById('app-loader');
      if (loader) {
          loader.classList.add('fade-out');
          setTimeout(() => {
              loader.style.display = 'none';
          }, 500);
      }
  }, []);

  const renderSingleColumnContent = () => {
      const commonProps = { isLoading, error };
      switch(activePostType) {
          case 'strategy': return <FacebookStrategyPost post={contentVariations[0] as any} onCopy={() => showToast('Strategy copied to clipboard!', 'success')} onPublish={() => setIsPublishModalOpen(true)} />;
          case 'gantt': return <GanttChart events={META_ADS_HISTORY} />;
          case 'all_tools': return <AllToolsView />;
          case 'professional_dashboard': return <ProfessionalDashboard onSelectInspiration={(prompt) => handleSelectUseCase(USE_CASES.find(uc => uc.id === 'text-post')!)} showToast={showToast} />;
          case 'skills_dashboard': return <SkillsDashboard completedChallenges={completedChallenges} onStartChallenge={handleStartChallenge} showToast={showToast} onClearCompleted={handleClearCompleted} />;
          case 'math_equation': return <MathEquationView />;
          case 'json_workflow': return <JsonWorkflowSimulator />;
          case 'brand_chat': return <BrandChatAssistant context={formStates.brandContext} setContext={setters.setBrandContext} messages={(contentVariations[0] as any)?.messages || []} onSendMessage={sendChatMessage} onNewChat={() => startNewChat(formStates.brandContext)} isLoading={isLoading} />;
          case 'comment_analysis': return <CommentAnalysisView commentsText={formStates.commentsText} setCommentsText={setters.setCommentsText} onAnalyze={handleGenerate} analysisResult={(contentVariations[0] as any)?.analysis || null} {...commonProps} />;
          case 'page_performance': return <PagePerformanceView onAnalyze={handleGenerate} analysisResult={(contentVariations[0] as any)?.analysis || null} {...commonProps} />;
          case 'crypto_simulator': return <CryptoSimulator />;
          case 'stella_assistant': return <VoiceAssistantSimulator />;
          case 'ai_data_provenance': return <AIDataProvenanceView />;
          case 'ethical_protocol': return <AIGuideView />;
          case 'aiko_model_card': return <AikoModelCard />;
          case 'history': return <HistoryView onLoadItem={handleLoadHistoryItem} />;
          case 'character_dossier': return <CharacterDossier />;
          case 'video_generation': return <VideoGenerator topic={formStates.topic} setTopic={setters.setTopic} inputImage={formStates.inputImage} setInputImage={setters.setInputImage} isUploadingImage={formStates.isUploadingImage} setIsUploadingImage={setters.setIsUploadingImage} onGenerate={handleGenerate} isLoading={isLoading} currentPost={contentVariations[0] as any} showToast={showToast} />;
          case 'phone_verification': return <PhoneVerificationView />;
          case 'engagement_booster': return <EngagementBoosterView onGenerate={handleGenerate} result={contentVariations[0]} setEngagementBoosterInput={setters.setEngagementBoosterInput} showToast={showToast} {...commonProps} />;
          case 'brand_kit': return <BrandVoiceKitView input={formStates.brandVoiceInput} setInput={setters.setBrandVoiceInput} onAnalyze={handleGenerate} result={(contentVariations[0] as any)?.analysis || null} onUpdateContext={(newContext) => { setters.setBrandContext(newContext); showToast('Global brand context updated!', 'success'); }} {...commonProps} />;
          case 'predictive_engine': return <PredictiveEngineView />;
          case 'symbiotic_feedback_loop': return <SymbioticFeedbackLoopView />;
          case 'content_lifecycle': return <ContentLifecycleAssistant showToast={showToast} />;
          case 'automated_responder': return <AutomatedResponderPost post={contentVariations[0] as any} onReview={() => handleBrandReview(0)} showToast={showToast} />;
          case 'whatsapp_auto_responder': return <WhatsAppAutoResponderView onGenerate={handleGenerate} result={contentVariations[0]} setWhatsAppAutoResponderInput={setters.setWhatsAppAutoResponderInput} showToast={showToast} isLoading={isLoading} error={error} onReview={() => handleBrandReview(0)} />;
          case 'strategic_roadmap': return <StrategicRoadmapView />;
          case 'page_import_analysis': return <PageImporterView showToast={showToast} setGlobalBrandContext={setters.setBrandContext} />;
          case 'dashboard_importer': return <DashboardImporterView showToast={showToast} />;
          case 'post_engagement_strategist': return <PostEngagementStrategistView post={contentVariations[0] as any} onReview={() => handleBrandReview(0)} />;
          default: return <p>No view available for this post type.</p>;
      }
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
       
      {isPublishModalOpen && (
        <PublishModal 
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          generatedContent={currentPostForModal}
          showToast={showToast}
        />
      )}

      {!activeUseCase ? (
         <main className="flex-grow">
            <HomeScreen 
                onSelectUseCase={handleSelectUseCase} 
                onNavigateToSelection={() => setActiveUseCase({} as UseCase)} // A trick to switch view
                showToast={showToast}
            />
         </main>
      ) : (
        <>
            <Header onBack={handleBack} />
            <div className="flex-grow flex w-full max-w-screen-2xl mx-auto">
                <Sidebar activePostType={activePostType} onSelect={(id) => handleSelectUseCase(USE_CASES.find(uc => uc.targetPostType === id)!)} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
                   {isSingleColumn && contentVariations.length > 0 && !isLoading ? (
                        <div className="max-w-4xl mx-auto">
                           {renderSingleColumnContent()}
                        </div>
                   ) : isSingleColumn ? (
                        <div className="max-w-4xl mx-auto">
                           {renderSingleColumnContent()}
                        </div>
                   ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="lg:sticky lg:top-8">
                            <ControlPanel
                                postType={activePostType}
                                onTabSelect={(id) => handleSelectUseCase(USE_CASES.find(uc => uc.targetPostType === id)!)}
                                topic={formStates.topic} setTopic={setters.setTopic}
                                url={formStates.url} setUrl={setters.setUrl}
                                guidedInput={formStates.guidedInput} setGuidedInput={setters.setGuidedInput}
                                adCreativeInput={formStates.adCreativeInput} setAdCreativeInput={setters.setAdCreativeInput}
                                allianceAdInput={formStates.allianceAdInput} setAllianceAdInput={setters.setAllianceAdInput}
                                voiceDialogInput={formStates.voiceDialogInput} setVoiceDialogInput={setters.setVoiceDialogInput}
                                googleBusinessPostInput={formStates.googleBusinessPostInput} setGoogleBusinessPostInput={setters.setGoogleBusinessPostInput}
                                ampPrototypeInput={formStates.ampPrototypeInput} setAmpPrototypeInput={setters.setAmpPrototypeInput}
                                monetizedArticleInput={formStates.monetizedArticleInput} setMonetizedArticleInput={setters.setMonetizedArticleInput}
                                seoBlogInput={formStates.seoBlogInput} setSeoBlogInput={setters.setSeoBlogInput}
                                emailSubjectInput={formStates.emailSubjectInput} setEmailSubjectInput={setters.setEmailSubjectInput}
                                emailBodyInput={formStates.emailBodyInput} setEmailBodyInput={setters.setEmailBodyInput}
                                engagementBoosterInput={formStates.engagementBoosterInput} setEngagementBoosterInput={setters.setEngagementBoosterInput}
                                brandVoiceInput={formStates.brandVoiceInput} setBrandVoiceInput={setters.setBrandVoiceInput}
                                automatedResponderInput={formStates.automatedResponderInput} setAutomatedResponderInput={setters.setAutomatedResponderInput}
                                postEngagementStrategistInput={formStates.postEngagementStrategistInput} setPostEngagementStrategistInput={setters.setPostEngagementStrategistInput}
                                inputImage={formStates.inputImage} setInputImage={setters.setInputImage}
                                isUploadingImage={formStates.isUploadingImage} setIsUploadingImage={setters.setIsUploadingImage}
                                numVariations={modelConfig.numVariations} setNumVariations={modelConfigSetters.setNumVariations}
                                temperature={modelConfig.temperature} setTemperature={modelConfigSetters.setTemperature}
                                onGenerate={handleGenerate}
                                isLoading={isLoading}
                                error={error}
                                model={modelConfig.model} setModel={modelConfigSetters.setModel}
                                currentPost={currentPostForModal}
                                autoLinkKeywords={modelConfig.autoLinkKeywords} setAutoLinkKeywords={modelConfigSetters.setAutoLinkKeywords}
                                task={formStates.task} setTask={setters.setTask}
                            />
                        </div>
                        <PreviewStage
                            isLoading={isLoading}
                            isGeneratingImage={isGeneratingImage}
                            postType={activePostType}
                            contentVariations={contentVariations}
                            currentVariationIndex={currentVariationIndex}
                            setCurrentVariationIndex={setCurrentVariationIndex}
                            onGenerateImage={handleFinalImageGeneration}
                            onPromptChange={handleImagePromptChange}
                            onPublish={() => setIsPublishModalOpen(true)}
                            onReviewBrandAlignment={handleBrandReview}
                            showToast={showToast}
                            onTitleSelect={handleGenerateSeoArticle}
                            autoLinkKeywords={modelConfig.autoLinkKeywords}
                        />
                    </div>
                   )}
                </main>
            </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default App;