import React from 'react';
import { CommentAnalysisData } from '../types';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SparklesIcon, ErrorIcon, LightBulbIcon, ChatBubbleIcon, MegaphoneIcon } from './ui/icons';

interface CommentAnalysisViewProps {
    commentsText: string;
    setCommentsText: (text: string) => void;
    onAnalyze: () => void;
    isLoading: boolean;
    analysisResult: CommentAnalysisData | null;
    error: string | null;
}

const getSentimentColor = (sentiment: CommentAnalysisData['overall_sentiment']) => {
    switch (sentiment) {
        case 'Positive': return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20';
        case 'Negative': return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
        case 'Mixed': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        case 'Neutral': return 'text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/20';
        default: return 'text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
};

const AnalysisResultDisplay: React.FC<{ result: CommentAnalysisData }> = ({ result }) => {
    return (
        <div className="space-y-6 animate-fade-in-fast">
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Overall Sentiment</h3>
                <div className={`p-4 rounded-lg border ${getSentimentColor(result.overall_sentiment)}`}>
                    <p className="font-bold text-2xl">{result.overall_sentiment}</p>
                    <p className="text-sm">Sentiment Score: {result.sentiment_score.toFixed(2)}</p>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"><ChatBubbleIcon className="h-5 w-5" /> Key Themes</h3>
                <div className="flex flex-wrap gap-2">
                    {result.key_themes.map((theme, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium rounded-full">{theme}</span>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"><MegaphoneIcon className="h-5 w-5" /> Frequent Questions</h3>
                <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-gray-700 dark:text-gray-300">
                    {result.frequent_questions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"><LightBulbIcon className="h-5 w-5" /> Actionable Insights</h3>
                <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-gray-700 dark:text-gray-300">
                    {result.actionable_insights.map((insight, i) => <li key={i}>{insight}</li>)}
                </ul>
            </div>
        </div>
    );
};

export const CommentAnalysisView: React.FC<CommentAnalysisViewProps> = ({
    commentsText,
    setCommentsText,
    onAnalyze,
    isLoading,
    analysisResult,
    error,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Analyze Comments</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">Paste comments from a social media post to get an AI-powered summary.</p>
                <textarea
                    value={commentsText}
                    onChange={(e) => setCommentsText(e.target.value)}
                    placeholder="Paste comments here, one per line..."
                    className="w-full h-64 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <Button onClick={onAnalyze} disabled={isLoading || !commentsText.trim()} className="w-full mt-4">
                    {isLoading ? <Loader text="Analyzing..." /> : "Analyze Comments"}
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
                        <Loader text="AI is analyzing the comments..." />
                    </div>
                ) : error && !analysisResult ? (
                     <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
                        <ErrorIcon className="h-12 w-12" />
                        <p className="mt-4 font-semibold">Analysis Failed</p>
                        <p className="text-sm mt-1">Could not process the comments. Please try again.</p>
                    </div>
                ) : analysisResult ? (
                    <AnalysisResultDisplay result={analysisResult} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                        <SparklesIcon />
                        <p className="mt-4 font-semibold">Your analysis will appear here</p>
                        <p className="text-sm mt-1">Get insights on sentiment, key themes, and more.</p>
                    </div>
                )}
            </div>
        </div>
    );
};