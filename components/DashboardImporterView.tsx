import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DashboardImportAnalysisResult } from '../types';
import { DASHBOARD_RAW_TEXT } from '../appData';
import { generateContent } from '../services/geminiService';
import { DASHBOARD_IMPORTER_INSTRUCTION } from '../prompts';
import { DASHBOARD_IMPORTER_SCHEMA } from '../schemas';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { DocumentSearchIcon, SparklesIcon, ErrorIcon, CheckCircleIcon, ChartBarIcon, MegaphoneIcon, TrendingUpIcon } from './ui/icons';

const MotionDiv = motion.div as any;

const AnalysisResultDisplay: React.FC<{ result: DashboardImportAnalysisResult }> = ({ result }) => (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.performance_summary && (
                <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg text-center">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{result.performance_summary.metric}</p>
                    <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">{result.performance_summary.value}</p>
                    <p className={`text-sm font-bold ${result.performance_summary.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{result.performance_summary.trend}</p>
                </div>
            )}
            {result.monetization_status && (
                <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg text-center md:col-span-2">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Monetization Status</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-2 mt-2">
                        <CheckCircleIcon /> {result.monetization_status.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.monetization_status.details}</p>
                </div>
            )}
        </div>
        
        {result.weekly_goals?.length > 0 && (
            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">Weekly Goals</h3>
                <div className="space-y-3">
                    {result.weekly_goals.map((goal, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-baseline text-sm mb-1">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{goal.task}</span>
                                <span className="font-mono text-gray-500 dark:text-gray-400">{goal.progress} / {goal.target}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <MotionDiv
                                    className="bg-blue-600 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(goal.progress / goal.target) * 100}%`}}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {result.latest_post_summary && (
            <div>
                 <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"><MegaphoneIcon className="h-5 w-5" /> Latest Post</h3>
                 <p className="text-sm text-gray-700 dark:text-gray-300 p-4 bg-black/5 dark:bg-white/5 rounded-md whitespace-pre-wrap">{result.latest_post_summary}</p>
            </div>
        )}
        
        {result.todo_list?.length > 0 && (
             <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">To-Do List</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {result.todo_list.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
             </div>
        )}

    </MotionDiv>
);

export const DashboardImporterView: React.FC<{ showToast: (message: string, type: 'success' | 'error') => void; }> = ({ showToast }) => {
    const [rawText, setRawText] = useState(DASHBOARD_RAW_TEXT);
    const [analysis, setAnalysis] = useState<DashboardImportAnalysisResult | null>(null);
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
                    systemInstruction: DASHBOARD_IMPORTER_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: DASHBOARD_IMPORTER_SCHEMA,
                }
            });
            const result = JSON.parse(response.text.trim());
            setAnalysis(result);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Analysis failed.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [rawText, showToast]);

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-3">
                <DocumentSearchIcon className="h-8 w-8 text-blue-500" />
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Dashboard Data Importer</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Extract a structured summary from raw dashboard data.</p>
                </div>
            </div>
            
            <div className="mt-4 space-y-2">
                <label htmlFor="raw-text-input" className="font-semibold text-gray-800 dark:text-gray-200">Raw Dashboard Data</label>
                <textarea
                    id="raw-text-input"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste raw dashboard content here..."
                    className="w-full h-48 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-xs"
                />
            </div>

            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full mt-4">
                {isLoading ? <Loader text="Analyzing..." /> : "Analyze with AI"}
            </Button>

            <div className="mt-6 min-h-[200px]">
                 {isLoading ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <Loader text="AI is analyzing the dashboard data..." />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
                        <ErrorIcon className="h-12 w-12" />
                        <p className="mt-4 font-semibold">Analysis Failed</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                ) : analysis ? (
                    <AnalysisResultDisplay result={analysis} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                        <SparklesIcon />
                        <p className="mt-4 font-semibold">Your dashboard summary will appear here</p>
                        <p className="text-sm mt-1">Click "Analyze" to extract key metrics.</p>
                    </div>
                )}
            </div>
        </div>
    );
};