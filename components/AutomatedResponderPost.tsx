import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { BrandReviewPanel } from './BrandReviewPanel';
import { WorkflowIcon, ChevronDownIcon, CopyIcon, CheckIcon } from './ui/icons';

interface AutomatedResponderPostProps {
  post: Extract<GeneratedContent, { type: 'automated_responder' }>;
  onReview: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; onCopy: () => void; }> = ({ title, children, onCopy }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-black/5 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left font-semibold text-gray-800 dark:text-gray-200"
            >
                <div className="flex items-center gap-2">
                    {title}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label={`Copy ${title}`}>
                        {isCopied ? <CheckIcon className="h-4 w-4 text-green-500"/> : <CopyIcon className="h-4 w-4"/>}
                    </button>
                    <ChevronDownIcon className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {children}
                </div>
            )}
        </div>
    );
};

export const AutomatedResponderPost: React.FC<AutomatedResponderPostProps> = ({ post, onReview, showToast }) => {
    const { flow } = post;
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                    <WorkflowIcon className="h-8 w-8 text-blue-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Automated Responder Flow</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Generated text assets for your automation.</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <CollapsibleSection title="Welcome Message" onCopy={() => handleCopy(flow.welcomeMessage)}>
                        {flow.welcomeMessage}
                    </CollapsibleSection>
                    
                    {flow.quickReplies.map((qr, index) => (
                        <CollapsibleSection key={index} title={`Response for: "${qr.label}"`} onCopy={() => handleCopy(qr.response)}>
                            {qr.response}
                        </CollapsibleSection>
                    ))}

                    <CollapsibleSection title="Fallback Message" onCopy={() => handleCopy(flow.fallbackMessage)}>
                        {flow.fallbackMessage}
                    </CollapsibleSection>
                </div>
            </div>
            <BrandReviewPanel post={post} onReview={onReview} />
        </div>
    );
};
