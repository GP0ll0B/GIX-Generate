import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PageImportAnalysisResult } from '../types';
import { AIKO_PAGE_RAW_TEXT } from '../appData';
import { generateContent } from '../services/geminiService';
import { PAGE_IMPORT_ANALYSIS_INSTRUCTION } from '../prompts';
import { PAGE_IMPORT_ANALYSIS_SCHEMA } from '../schemas';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { TargetIcon, SparklesIcon, ErrorIcon, CopyIcon, LightBulbIcon } from './ui/icons';

const MotionDiv = motion.div as any;

interface PageImporterViewProps {
    showToast: (message: string, type: 'success' | 'error') => void;
    setGlobalBrandContext: (context: string) => void;
}

const parseJson = (text: string, context: string): any => {
    try {
        const cleanText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error(`[JSON Parse Error][${context}]`, e, "Raw text:", text);
        throw new Error(`The AI returned an invalid format for the ${context}. Please try again.`);
    }
};

const AnalysisResultDisplay: React.FC<{ result: PageImportAnalysisResult, onUpdateContext: () => void, onCopy: (text: string) => void }> = ({ result, onUpdateContext, onCopy }) => (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-6">
        <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Brand Name</h3>
            <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">{result.brandName}</p>
        </div>
        <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Brand Bio</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5 p-3 rounded-md">{result.brandBio}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Tone of Voice</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    {result.toneOfVoice.map(tone => (
                        <span key={tone} className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-sm font-medium rounded-full">{tone}</span>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Key Themes</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    {result.keyThemes.map(theme => (
                        <span key={theme} className="px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 text-sm font-medium rounded-full">{theme}</span>
                    ))}
                </div>
            </div>
        </div>
         <div className="p-4 bg-yellow-400/10 dark:bg-yellow-400/20 border-l-4 border-yellow-500 rounded-r-lg">
            <h4 className="font-bold text-yellow-800 dark:text-yellow-300 flex items-center gap-2"><LightBulbIcon className="h-5 w-5" /> Next Post Suggestion</h4>
            <div className="flex items-start justify-between gap-2 mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{result.nextPostSuggestion}"</p>
                <button onClick={() => onCopy(result.nextPostSuggestion)} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0" aria-label="Copy suggestion"><CopyIcon className="h-4 w-4" /></button>
            </div>
        </div>
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
             <Button onClick={onUpdateContext} className="w-full">
                Update Global Brand Context with Bio
            </Button>
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">This will use the extracted bio as the new context for all AI generations.</p>
        </div>
    </MotionDiv>
);


export const PageImporterView: React.FC<PageImporterViewProps> = ({ showToast, setGlobalBrandContext }) => {
    const [rawText, setRawText] = useState(AIKO_PAGE_RAW_TEXT);
    const [analysis, setAnalysis] = useState<PageImportAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        if (!rawText.trim()) {
            showToast('Please paste some content to analyze.', 'error');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const response = await generateContent({
                model: 'gemini-2.5-flash',
                contents: rawText,
                config: {
                    systemInstruction: PAGE_IMPORT_ANALYSIS_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: PAGE_IMPORT_ANALYSIS_SCHEMA,
                }
            });
            const result = parseJson(response.text, 'page analysis');
            setAnalysis(result);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Analysis failed.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [rawText, showToast]);
    
    const handleUpdateContext = () => {
        if (analysis) {
            setGlobalBrandContext(analysis.brandBio);
            showToast('Global brand context updated successfully!', 'success');
        }
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-3">
                <TargetIcon className="h-8 w-8 text-blue-500" />
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Page Importer & Brand Analyzer</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Extract brand identity from raw page content.</p>
                </div>
            </div>
            
            <div className="mt-4 space-y-2">
                <label htmlFor="raw-text-input" className="font-semibold text-gray-800 dark:text-gray-200">Raw Page Content</label>
                <textarea
                    id="raw-text-input"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste raw page content here..."
                    className="w-full h-48 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-xs"
                />
            </div>

            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full mt-4">
                {isLoading ? <Loader text="Analyzing..." /> : "Analyze with AI"}
            </Button>

            <div className="mt-6 min-h-[200px]">
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <Loader text="AI is analyzing the content..." />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
                        <ErrorIcon className="h-12 w-12" />
                        <p className="mt-4 font-semibold">Analysis Failed</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                ) : analysis ? (
                    <AnalysisResultDisplay result={analysis} onUpdateContext={handleUpdateContext} onCopy={handleCopy} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                        <SparklesIcon />
                        <p className="mt-4 font-semibold">Your analysis will appear here</p>
                        <p className="text-sm mt-1">Click "Analyze" to extract brand insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
};