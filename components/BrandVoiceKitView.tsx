import React from 'react';
import { motion } from 'framer-motion';
import { BrandVoiceInput } from '../types';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SparklesIcon, FingerPrintIcon } from './ui/icons';

// FIX: Cast motion.div to any to resolve framer-motion type errors.
const MotionDiv = motion.div as any;

interface BrandVoiceKitViewProps {
    input: BrandVoiceInput;
    setInput: React.Dispatch<React.SetStateAction<BrandVoiceInput>>;
    onAnalyze: () => void;
    isLoading: boolean;
    error: string | null;
    result: {
        brandSummary: string;
        coreKeywords: string[];
        personaInANutshell: string;
    } | null;
    onUpdateContext: (newContext: string) => void;
}

const AnalysisResultDisplay: React.FC<{ result: NonNullable<BrandVoiceKitViewProps['result']>, onUpdateContext: () => void }> = ({ result, onUpdateContext }) => (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Brand Summary</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5 p-3 rounded-md">{result.brandSummary}</p>
        </div>
        <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Core Keywords</h3>
            <div className="mt-2 flex flex-wrap gap-2">
                {result.coreKeywords.map(keyword => (
                    <span key={keyword} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium rounded-full">{keyword}</span>
                ))}
            </div>
        </div>
        <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Persona-in-a-Nutshell</h3>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-200 italic p-3 bg-black/5 dark:bg-white/5 rounded-md">"{result.personaInANutshell}"</p>
        </div>
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
             <Button onClick={onUpdateContext} className="w-full">
                Update Global Brand Context
            </Button>
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">This will use the Brand Summary as the new context for all AI generations.</p>
        </div>
    </MotionDiv>
);

export const BrandVoiceKitView: React.FC<BrandVoiceKitViewProps> = ({
    input, setInput, onAnalyze, isLoading, error, result, onUpdateContext
}) => {
    const handleInputChange = (field: keyof BrandVoiceInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const tones: BrandVoiceInput['brandVoiceTone'][] = ['Visionary', 'Empathetic', 'Authoritative', 'Witty', 'Formal'];

    const isFormIncomplete = !input.missionStatement.trim() || !input.coreValues.trim() || !input.targetAudiencePersona.trim();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <FingerPrintIcon className="h-8 w-8 text-blue-500" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Brand Voice & Persona Kit</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Define your brand's core identity for the AI.</p>
                    </div>
                </div>
                
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="mission-statement" className="font-semibold text-gray-800 dark:text-gray-200">Mission Statement</label>
                        <textarea
                            id="mission-statement"
                            value={input.missionStatement}
                            onChange={(e) => handleInputChange('missionStatement', e.target.value)}
                            placeholder="e.g., To build a future where AI and humanity co-evolve in a symbiotic relationship."
                            className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="core-values" className="font-semibold text-gray-800 dark:text-gray-200">Core Values (comma-separated)</label>
                        <input
                            id="core-values"
                            type="text"
                            value={input.coreValues}
                            onChange={(e) => handleInputChange('coreValues', e.target.value)}
                            placeholder="e.g., Ethics, Openness, Sustainability, Trust"
                            className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="audience-persona" className="font-semibold text-gray-800 dark:text-gray-200">Target Audience Persona</label>
                        <textarea
                            id="audience-persona"
                            value={input.targetAudiencePersona}
                            onChange={(e) => handleInputChange('targetAudiencePersona', e.target.value)}
                            placeholder="e.g., Tech-optimists, developers, and strategists who are passionate about building a responsible future."
                            className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="brand-tone" className="font-semibold text-gray-800 dark:text-gray-200">Brand Voice & Tone</label>
                        <select
                            id="brand-tone"
                            value={input.brandVoiceTone}
                            onChange={(e) => handleInputChange('brandVoiceTone', e.target.value)}
                            className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        >
                            {tones.map(tone => <option key={tone}>{tone}</option>)}
                        </select>
                    </div>
                </div>

                <Button onClick={onAnalyze} disabled={isLoading || isFormIncomplete} className="w-full mt-6">
                    {isLoading ? <Loader text="Analyzing..." /> : "Analyze Brand Voice"}
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
                        <Loader text="AI is analyzing your brand..." />
                    </div>
                ) : !result ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                        <SparklesIcon />
                        <p className="mt-4 font-semibold">Your brand analysis will appear here</p>
                        <p className="text-sm mt-1">Fill out the form and click "Analyze" to get started.</p>
                    </div>
                ) : (
                    <AnalysisResultDisplay result={result} onUpdateContext={() => onUpdateContext(result.brandSummary)} />
                )}
            </div>
        </div>
    );
};