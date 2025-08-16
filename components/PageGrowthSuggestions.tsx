import React, { useState, useCallback } from 'react';
import { PageGrowthSuggestion, PAGE_GROWTH_SYSTEM_INSTRUCTION, PAGE_GROWTH_SCHEMA } from '../constants';
import { generateContent } from '../services/geminiService';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { LightBulbIcon, ErrorIcon, DocumentTextIcon, UsersIcon, DollarSignIcon } from './ui/icons';

interface PageGrowthSuggestionsProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const categoryIconMap: { [key in PageGrowthSuggestion['category']]: React.ReactNode } = {
    'Content Strategy': <DocumentTextIcon className="h-5 w-5" />,
    'Audience Engagement': <UsersIcon className="h-5 w-5" />,
    'Monetization': <DollarSignIcon className="h-5 w-5" />
};

const categoryColorMap: { [key in PageGrowthSuggestion['category']]: string } = {
    'Content Strategy': 'text-blue-500 dark:text-blue-400',
    'Audience Engagement': 'text-purple-500 dark:text-purple-400',
    'Monetization': 'text-green-500 dark:text-green-400'
};

const SuggestionCard: React.FC<{ suggestion: PageGrowthSuggestion }> = ({ suggestion }) => {
    return (
        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
            <h4 className={`font-bold flex items-center gap-2 ${categoryColorMap[suggestion.category] || 'text-gray-500'}`}>
                {categoryIconMap[suggestion.category] || <LightBulbIcon />}
                {suggestion.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{suggestion.description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
                <strong>Why?</strong> {suggestion.rationale}
            </p>
        </div>
    );
};

export const PageGrowthSuggestions: React.FC<PageGrowthSuggestionsProps> = ({ showToast }) => {
    const [suggestions, setSuggestions] = useState<PageGrowthSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateSuggestions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        try {
            const response = await generateContent('gemini-2.5-flash', "Analyze my page and give me growth suggestions.", {
                systemInstruction: PAGE_GROWTH_SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: PAGE_GROWTH_SCHEMA,
                temperature: 0.7
            });
            const parsedData = JSON.parse(response.text.trim());
            setSuggestions(parsedData.suggestions || []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to generate suggestions.";
            setError("Sorry, we couldn't fetch suggestions right now. Please try again later.");
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <LightBulbIcon className="h-6 w-6 text-yellow-500" />
                        Page Growth Suggestions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get AI-powered tips to grow your page.</p>
                </div>
                <Button onClick={handleGenerateSuggestions} disabled={isLoading} className="flex-shrink-0">
                    {isLoading ? <Loader text="Analyzing..." /> : 'Analyze & Suggest'}
                </Button>
            </div>
            <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-48"><Loader text="Generating strategic advice..." /></div>
                ) : error ? (
                    <div className="flex flex-col justify-center items-center h-48 text-center text-red-600 dark:text-red-400">
                        <ErrorIcon className="h-8 w-8 mb-2" />
                        <p className="font-semibold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-48 text-center text-gray-500 dark:text-gray-400">
                        <LightBulbIcon className="h-10 w-10 mb-2"/>
                        <p className="font-semibold">Ready for growth?</p>
                        <p className="text-sm">Click "Analyze & Suggest" to get personalized tips.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
