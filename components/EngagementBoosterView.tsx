import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedContent, EngagementBoosterInput } from '../types';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { Tabs } from './ui/Tabs';
import { SparklesIcon, TrendingUpIcon, WandIcon, CopyIcon, CheckIcon, LightBulbIcon } from './ui/icons';

const MotionDiv = motion.div as any;

interface EngagementBoosterViewProps {
    onGenerate: () => void;
    isLoading: boolean;
    error: string | null;
    result: GeneratedContent | null;
    setEngagementBoosterInput: React.Dispatch<React.SetStateAction<EngagementBoosterInput>>;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const HookCard: React.FC<{ hook: string, onSelect: (hook: string) => void }> = ({ hook, onSelect }) => (
    <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-transparent hover:border-blue-500/50 cursor-pointer"
        onClick={() => onSelect(hook)}
    >
        <p className="text-gray-800 dark:text-gray-200">{hook}</p>
    </MotionDiv>
);

export const EngagementBoosterView: React.FC<EngagementBoosterViewProps> = ({
    onGenerate, isLoading, error, result, setEngagementBoosterInput, showToast
}) => {
    const [mode, setMode] = useState<'hooks' | 'rewrite'>('hooks');
    const [topic, setTopic] = useState('');
    const [textToRewrite, setTextToRewrite] = useState('');
    
    const handleGenerate = useCallback(() => {
        const input: EngagementBoosterInput = {
            mode,
            topic: topic,
            textToRewrite: textToRewrite
        };
        setEngagementBoosterInput(input);
        // Using setTimeout to ensure state update is processed before generation
        setTimeout(onGenerate, 0);
    }, [mode, topic, textToRewrite, setEngagementBoosterInput, onGenerate]);

    const handleHookSelect = (hook: string) => {
        navigator.clipboard.writeText(hook);
        showToast('Hook copied to clipboard!', 'success');
    };

    const handleCopyRewrite = () => {
        if (result?.type === 'rewritten_text') {
            navigator.clipboard.writeText(result.rewrittenText);
            showToast('Rewritten text copied to clipboard!', 'success');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <TrendingUpIcon className="h-8 w-8 text-blue-500" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Engagement Booster</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Optimize your content for high engagement.</p>
                    </div>
                </div>
                
                <div className="my-4">
                    <Tabs
                        options={[
                            { value: 'hooks', label: 'Generate Viral Hooks', icon: <LightBulbIcon className="h-4 w-4" /> },
                            { value: 'rewrite', label: 'Rewrite for Engagement', icon: <WandIcon className="h-4 w-4" /> },
                        ]}
                        active={mode}
                        onSelect={(newMode) => setMode(newMode as 'hooks' | 'rewrite')}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <MotionDiv
                        key={mode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {mode === 'hooks' ? (
                            <div>
                                <label htmlFor="topic" className="font-semibold text-gray-800 dark:text-gray-200">Topic</label>
                                <textarea
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., The future of AI ethics"
                                    className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    rows={3}
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="text-to-rewrite" className="font-semibold text-gray-800 dark:text-gray-200">Text to Rewrite</label>
                                <textarea
                                    id="text-to-rewrite"
                                    value={textToRewrite}
                                    onChange={(e) => setTextToRewrite(e.target.value)}
                                    placeholder="Paste your draft text here..."
                                    className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    rows={8}
                                />
                            </div>
                        )}
                    </MotionDiv>
                </AnimatePresence>

                <Button onClick={handleGenerate} disabled={isLoading || (mode === 'hooks' ? !topic.trim() : !textToRewrite.trim())} className="w-full mt-4">
                    {isLoading ? <Loader text="Generating..." /> : (mode === 'hooks' ? 'Generate Hooks' : 'Boost Engagement')}
                </Button>
                {error && !isLoading && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-3 py-2 rounded-md text-sm" role="alert">
                        <p><span className="font-bold">Error:</span> {error}</p>
                    </div>
                )}
            </div>

            {/* Output Panel */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10 min-h-[400px]">
                 {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <Loader text="AI is working its magic..." />
                    </div>
                ) : !result ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                        <SparklesIcon />
                        <p className="mt-4 font-semibold">Your results will appear here</p>
                        <p className="text-sm mt-1">Generate hooks or rewrite text to get started.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                         <MotionDiv
                            key={result.type}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                         >
                            {result.type === 'engagement_hooks' && (
                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Generated Hooks for "{result.topic}"</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Click a hook to copy it.</p>
                                    {result.hooks.map((hook, i) => <HookCard key={i} hook={hook} onSelect={handleHookSelect} />)}
                                </div>
                            )}
                             {result.type === 'rewritten_text' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Engagement Boost</h3>
                                        <Button onClick={handleCopyRewrite} variant="secondary" className="!py-1 !px-2 !text-xs">
                                            <CopyIcon /> Copy Rewritten Text
                                        </Button>
                                    </div>
                                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                        <div>
                                            <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Original Text</p>
                                            <div className="mt-1 p-3 bg-black/5 dark:bg-white/5 rounded-md text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                                {result.originalText}
                                            </div>
                                        </div>
                                         <div>
                                            <p className="font-semibold text-sm text-green-600 dark:text-green-400">Rewritten for Engagement</p>
                                            <div className="mt-1 p-3 bg-green-500/10 dark:bg-green-900/20 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                {result.rewrittenText}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                         </MotionDiv>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};