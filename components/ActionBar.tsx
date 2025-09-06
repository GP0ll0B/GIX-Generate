import React from 'react';
import { Button } from './ui/Button';
import { CopyIcon, SendIcon } from './ui/icons';

interface ActionBarProps {
    onPublish: () => void;
    onCopy: () => void;
    onPrev: () => void;
    onNext: () => void;
    currentIndex: number;
    totalVariations: number;
    disabled: boolean;
    children?: React.ReactNode;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onPublish, onCopy, onPrev, onNext, currentIndex, totalVariations, disabled, children }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
            <div className="flex-1 flex justify-start w-full sm:w-auto">
                {totalVariations > 1 && (
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button onClick={onPrev} disabled={disabled || currentIndex === 0} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Previous variation">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-20 text-center" aria-live="polite">
                            {currentIndex + 1} / {totalVariations}
                        </span>
                        <button onClick={onNext} disabled={disabled || currentIndex >= totalVariations - 1} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Next variation">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex-1 flex justify-center">
                {children}
            </div>

             <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button onClick={onCopy} variant="secondary" className="!py-2.5 !px-4 w-full sm:w-auto">
                    <CopyIcon /> <span className="hidden sm:inline">Copy</span>
                </Button>
                <Button onClick={onPublish} disabled={disabled} className="!py-2.5 !px-4 w-full sm:w-auto">
                    <SendIcon /> <span>Publish...</span>
                </Button>
             </div>
        </div>
    );
};