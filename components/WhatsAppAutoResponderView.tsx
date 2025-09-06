import React, { useState, useCallback } from 'react';
import { GeneratedContent, WhatsAppAutoResponderInput } from '../types';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SparklesIcon, ErrorIcon, WhatsAppIcon, CopyIcon, CheckIcon } from './ui/icons';
import { INITIAL_WHATSAPP_AUTO_RESPONDER_INPUT } from '../constants';

interface WhatsAppAutoResponderViewProps {
    onGenerate: () => void;
    isLoading: boolean;
    error: string | null;
    result: GeneratedContent | null;
    setWhatsAppAutoResponderInput: React.Dispatch<React.SetStateAction<WhatsAppAutoResponderInput>>;
    showToast: (message: string, type: 'success' | 'error') => void;
    onReview: () => void; // This seems unused here, but I will keep it for prop consistency
}

const ResultDisplay: React.FC<{ result: Extract<GeneratedContent, { type: 'whatsapp_auto_responder' }>, showToast: (message: string, type: 'success' | 'error') => void; }> = ({ result, showToast }) => {
    const [isCopied, setIsCopied] = useState(false);
    const jsonText = JSON.stringify(result.flow, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonText);
        setIsCopied(true);
        showToast('JSON configuration copied!', 'success');
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="space-y-4 animate-fade-in-fast">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Generated WhatsApp Configuration</h3>
                <Button onClick={handleCopy} variant="secondary" className="!py-1 !px-2 text-xs">
                    {isCopied ? <CheckIcon /> : <CopyIcon />} Copy JSON
                </Button>
            </div>
            <pre className="p-4 bg-gray-900 text-gray-300 text-xs rounded-lg h-full max-h-[60vh] overflow-auto">
                <code>{jsonText}</code>
            </pre>
        </div>
    );
};

export const WhatsAppAutoResponderView: React.FC<WhatsAppAutoResponderViewProps> = ({
    onGenerate, isLoading, error, result, setWhatsAppAutoResponderInput, showToast
}) => {
    const [input, setInput] = useState<WhatsAppAutoResponderInput>(INITIAL_WHATSAPP_AUTO_RESPONDER_INPUT);

    const handleInputChange = (field: keyof WhatsAppAutoResponderInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value as any }));
    };
    
    const handleGenerate = useCallback(() => {
        setWhatsAppAutoResponderInput(input);
        setTimeout(onGenerate, 0);
    }, [input, setWhatsAppAutoResponderInput, onGenerate]);

    const analysisResult = result?.type === 'whatsapp_auto_responder' ? result : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <WhatsAppIcon className="h-8 w-8 text-green-500" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">WhatsApp Auto-Responder</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generate a JSON configuration for a Gemini-powered WhatsApp chatbot.</p>
                    </div>
                </div>
                
                <div className="mt-4 space-y-4">
                     <div>
                        <label htmlFor="wa-goal" className="font-semibold text-gray-800 dark:text-gray-200">Automation Goal</label>
                        <textarea
                            id="wa-goal"
                            value={input.goal}
                            onChange={(e) => handleInputChange('goal', e.target.value)}
                            placeholder="e.g., Answer common questions about products, support, and pricing."
                            className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="wa-business-info" className="font-semibold text-gray-800 dark:text-gray-200">Business Info & Knowledge Base</label>
                        <textarea
                            id="wa-business-info"
                            value={input.businessInfo}
                            onChange={(e) => handleInputChange('businessInfo', e.target.value)}
                            placeholder="e.g., We are a cafe open 9am-5pm on weekdays..."
                            className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            rows={5}
                        />
                    </div>
                    <div>
                        <label htmlFor="wa-tone" className="font-semibold text-gray-800 dark:text-gray-200">Tone of Voice</label>
                        <select
                            id="wa-tone"
                            value={input.tone}
                            onChange={(e) => handleInputChange('tone', e.target.value)}
                            className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        >
                            <option>Friendly</option>
                            <option>Professional</option>
                            <option>Witty</option>
                            <option>Formal</option>
                        </select>
                    </div>
                </div>

                <Button onClick={handleGenerate} disabled={isLoading} className="w-full mt-6">
                    {isLoading ? <Loader text="Generating Config..." /> : "Generate Configuration"}
                </Button>
                 {error && !isLoading && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-3 py-2 rounded-md text-sm" role="alert">
                        <p><span className="font-bold">Error:</span> {error}</p>
                    </div>
                )}
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10 min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <Loader text="AI is building your chatbot config..." />
                    </div>
                ) : error && !analysisResult ? (
                     <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
                        <ErrorIcon className="h-12 w-12" />
                        <p className="mt-4 font-semibold">Generation Failed</p>
                        <p className="text-sm mt-1">Could not process the request. Please try again.</p>
                    </div>
                ) : analysisResult ? (
                    <ResultDisplay result={analysisResult} showToast={showToast} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                        <SparklesIcon />
                        <p className="mt-4 font-semibold">Your configuration will appear here</p>
                        <p className="text-sm mt-1">Fill out the form and click "Generate" to create your bot's brain.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
