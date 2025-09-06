import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateContent } from '../services/geminiService';
import { 
    LIFECYCLE_IDEAS_INSTRUCTION, LIFECYCLE_CONTENT_INSTRUCTION, 
    LIFECYCLE_DISCOVERY_INSTRUCTION, LIFECYCLE_VISUALS_INSTRUCTION 
} from '../prompts';
import { 
    LIFECYCLE_IDEAS_SCHEMA, LIFECYCLE_DISCOVERY_SCHEMA, LIFECYCLE_VISUALS_SCHEMA 
} from '../schemas';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { LightBulbIcon, DocumentTextIcon, MegaphoneIcon, VideoCameraIcon, CheckCircleIcon, SparklesIcon, CopyIcon, CheckIcon, ErrorIcon } from './ui/icons';

const MotionDiv = motion.div as any;

type Step = 'idea' | 'content' | 'discovery' | 'visuals';
interface Idea { topic: string; rationale: string; }
interface DiscoveryPlan {
    social_posts: { platform: string; message: string; }[];
    community_posts: { community: string; suggestion: string; }[];
}
interface VisualIdea { concept: string; image_prompt: string; }

const parseJson = (text: string, context: string): any => {
    try {
        const cleanText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error(`[JSON Parse Error][${context}]`, e, "Raw text:", text);
        throw new Error(`The AI returned an invalid format for the ${context}. Please try again.`);
    }
};

export const ContentLifecycleAssistant: React.FC<{ showToast: (msg: string, type: 'success' | 'error') => void; }> = ({ showToast }) => {
    const [currentStep, setCurrentStep] = useState<Step>('idea');
    const [mainTopic, setMainTopic] = useState('');
    const [ideas, setIdeas] = useState<Idea[] | null>(null);
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [discoveryPlan, setDiscoveryPlan] = useState<DiscoveryPlan | null>(null);
    const [visualIdeas, setVisualIdeas] = useState<VisualIdea[] | null>(null);

    const [loadingStates, setLoadingStates] = useState({ idea: false, content: false, discovery: false, visuals: false });
    const [error, setError] = useState<string | null>(null);

    const handleGenerateIdeas = useCallback(async () => {
        if (!mainTopic) return;
        setError(null);
        setLoadingStates(s => ({ ...s, idea: true }));
        try {
            const response = await generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze the topic "${mainTopic}".`,
                config: {
                    systemInstruction: LIFECYCLE_IDEAS_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: LIFECYCLE_IDEAS_SCHEMA,
                }
            });
            const result = parseJson(response.text, 'ideas');
            setIdeas(result.ideas);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to generate ideas.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoadingStates(s => ({ ...s, idea: false }));
        }
    }, [mainTopic, showToast]);

    const handleSelectIdea = (idea: string) => {
        setSelectedIdea(idea);
        setCurrentStep('content');
    };
    
    const handleGenerateContent = useCallback(async () => {
        if (!selectedIdea) return;
        setError(null);
        setLoadingStates(s => ({ ...s, content: true }));
         try {
            const response = await generateContent({
                model: 'gemini-2.5-flash',
                contents: `Write an engaging and informative post about: "${selectedIdea}"`,
                config: { systemInstruction: LIFECYCLE_CONTENT_INSTRUCTION }
            });
            setGeneratedContent(response.text.trim());
            setCurrentStep('discovery');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to generate content.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoadingStates(s => ({ ...s, content: false }));
        }
    }, [selectedIdea, showToast]);
    
    const handleGenerateDiscoveryPlan = useCallback(async () => {
        if (!generatedContent) return;
        setError(null);
        setLoadingStates(s => ({ ...s, discovery: true }));
         try {
            const response = await generateContent({
                model: 'gemini-2.5-flash',
                contents: `Here is an article:\n\n${generatedContent}`,
                config: {
                    systemInstruction: LIFECYCLE_DISCOVERY_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: LIFECYCLE_DISCOVERY_SCHEMA,
                }
            });
            setDiscoveryPlan(parseJson(response.text, 'discovery plan'));
            setCurrentStep('visuals');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to generate discovery plan.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoadingStates(s => ({ ...s, discovery: false }));
        }
    }, [generatedContent, showToast]);

    const handleGenerateVisuals = useCallback(async () => {
        if (!generatedContent) return;
        setError(null);
        setLoadingStates(s => ({ ...s, visuals: true }));
         try {
            const response = await generateContent({
                model: 'gemini-2.5-flash',
                contents: `Here is an article:\n\n${generatedContent}`,
                config: {
                    systemInstruction: LIFECYCLE_VISUALS_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: LIFECYCLE_VISUALS_SCHEMA,
                }
            });
            setVisualIdeas(parseJson(response.text, 'visual ideas').visual_ideas);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to generate visual ideas.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoadingStates(s => ({ ...s, visuals: false }));
        }
    }, [generatedContent, showToast]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    };

    const steps: { id: Step, title: string, icon: React.ReactNode, isComplete: boolean }[] = [
        { id: 'idea', title: 'Find an Idea', icon: <LightBulbIcon />, isComplete: !!selectedIdea },
        { id: 'content', title: 'Create Content', icon: <DocumentTextIcon />, isComplete: !!generatedContent },
        { id: 'discovery', title: 'Build a Discovery Plan', icon: <MegaphoneIcon />, isComplete: !!discoveryPlan },
        { id: 'visuals', title: 'Suggest Visuals', icon: <VideoCameraIcon />, isComplete: !!visualIdeas },
    ];
    
    const renderStepContent = () => {
        switch(currentStep) {
            case 'idea': return (
                <>
                    <label htmlFor="main-topic" className="font-semibold text-gray-800 dark:text-gray-200">Enter a Broad Topic</label>
                    <textarea id="main-topic" value={mainTopic} onChange={e => setMainTopic(e.target.value)} rows={3} placeholder="e.g., The future of ethical AI" className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                    <Button onClick={handleGenerateIdeas} disabled={!mainTopic || loadingStates.idea} className="w-full mt-2">{loadingStates.idea ? <Loader text="Finding Ideas..." /> : "Find Ideas"}</Button>
                    {ideas && (
                        <div className="mt-4 space-y-3">
                            <h3 className="font-bold">Select an Idea to Develop:</h3>
                            {ideas.map((idea, i) => (
                                <div key={i} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{idea.topic}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{idea.rationale}</p>
                                    <Button onClick={() => handleSelectIdea(idea.topic)} variant="secondary" className="!text-xs !py-1 !px-2 mt-2">Select & Continue</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
            case 'content': return (
                <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Selected Idea:</p>
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">"{selectedIdea}"</h3>
                    <Button onClick={handleGenerateContent} disabled={loadingStates.content} className="w-full">{loadingStates.content ? <Loader text="Writing Content..." /> : "Generate Content"}</Button>
                </>
            );
            case 'discovery': return (
                 <>
                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">Generated Content</h3>
                    <div className="max-h-60 overflow-y-auto p-3 bg-black/5 dark:bg-white/5 rounded-md text-sm whitespace-pre-wrap">{generatedContent}</div>
                    <Button onClick={handleGenerateDiscoveryPlan} disabled={loadingStates.discovery} className="w-full mt-4">{loadingStates.discovery ? <Loader text="Creating Plan..." /> : "Create Discovery Plan"}</Button>
                 </>
            );
            case 'visuals': return (
                 <>
                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">Generated Content</h3>
                    <div className="max-h-40 overflow-y-auto p-3 bg-black/5 dark:bg-white/5 rounded-md text-sm whitespace-pre-wrap mb-4">{generatedContent}</div>
                     {discoveryPlan && (
                        <div className="mt-4 space-y-3">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200">Discovery Plan:</h3>
                            {discoveryPlan.social_posts.map((post, i) => (
                                <div key={i} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{post.platform} Post</h4>
                                        <button onClick={() => handleCopy(post.message)} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"><CopyIcon className="h-4 w-4" /></button>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{post.message}</p>
                                </div>
                            ))}
                             {discoveryPlan.community_posts.map((post, i) => (
                                <div key={i} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Suggestion for {post.community}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap italic">"{post.suggestion}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button onClick={handleGenerateVisuals} disabled={loadingStates.visuals} className="w-full mt-4">{loadingStates.visuals ? <Loader text="Suggesting Visuals..." /> : "Suggest Visuals"}</Button>
                    {visualIdeas && (
                         <div className="mt-4 space-y-3">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200">Visual Ideas:</h3>
                             {visualIdeas.map((idea, i) => (
                                <div key={i} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{idea.concept}</h4>
                                    <div className="relative mt-2">
                                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 p-2 pr-10 bg-gray-900/10 dark:bg-black/20 rounded">{idea.image_prompt}</p>
                                         <button onClick={() => handleCopy(idea.image_prompt)} className="absolute top-1/2 -translate-y-1/2 right-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"><CopyIcon className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            ))}
                         </div>
                    )}
                 </>
            );
        }
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Content Lifecycle Assistant</h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1 mb-6">A guided workflow from idea to promotion.</p>

            {/* Stepper */}
            <div className="flex justify-between items-center mb-6">
                {steps.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => step.isComplete && setCurrentStep(step.id)}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === step.id ? 'bg-blue-600 border-blue-600 text-white' : step.isComplete ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500'}`}>
                                {step.isComplete && currentStep !== step.id ? <CheckCircleIcon /> : step.icon}
                            </div>
                            <p className={`text-xs mt-1 font-semibold transition-colors ${currentStep === step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>{step.title}</p>
                        </div>
                        {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></div>}
                    </React.Fragment>
                ))}
            </div>

            {/* Step Content */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 min-h-[300px]">
                <AnimatePresence mode="wait">
                    <MotionDiv key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {renderStepContent()}
                    </MotionDiv>
                </AnimatePresence>
            </div>
            {error && <div className="mt-4 p-3 bg-red-500/10 text-red-700 dark:text-red-300 rounded-md text-sm flex items-center gap-2"><ErrorIcon /> {error}</div>}
        </div>
    );
};