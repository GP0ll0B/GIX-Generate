



import React, { useState } from 'react';
import { GeneratedContent } from '../constants';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { RadialProgress } from './ui/RadialProgress';
import { SparklesIcon, ChevronDownIcon, ErrorIcon, LightBulbIcon } from './ui/icons';

interface BrandReviewPanelProps {
  post: GeneratedContent;
  onReview: () => void;
}

export const BrandReviewPanel: React.FC<BrandReviewPanelProps> = ({ post, onReview }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const isReviewable = 'brandAlignmentStatus' in post;
    if (!isReviewable) {
        return null;
    }
    
    const { brandAlignmentStatus, brandAlignment } = post;
    const hasBeenReviewed = brandAlignmentStatus === 'success' || brandAlignmentStatus === 'error';

    const handleToggle = () => {
        if (!hasBeenReviewed) {
            onReview();
            setIsOpen(true);
        } else {
            setIsOpen(!isOpen);
        }
    }

    let titleText = "Review for Brand Alignment";
    let titleIcon = <SparklesIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
    if (brandAlignmentStatus === 'loading') {
        titleText = "Analyzing Alignment...";
        titleIcon = <Loader text="" />;
    } else if (brandAlignmentStatus === 'success' && brandAlignment) {
        titleText = `Brand Alignment Score: ${brandAlignment.score}/100`;
        titleIcon = <SparklesIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
    } else if (brandAlignmentStatus === 'error') {
        titleText = "Analysis Failed";
        titleIcon = <ErrorIcon />;
    }

    return (
        <div className="border-t border-gray-200/50 dark:border-gray-700/50">
            <button
                onClick={handleToggle}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 disabled:cursor-not-allowed"
                disabled={brandAlignmentStatus === 'loading'}
                aria-expanded={isOpen}
            >
                <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-800 dark:text-gray-200">
                    {titleIcon}
                    {titleText}
                </h3>
                {hasBeenReviewed && <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />}
            </button>

            {isOpen && (
                <div className="bg-black/5 dark:bg-white/5 p-4 animate-fade-in-fast">
                    {brandAlignmentStatus === 'loading' && <div className="flex justify-center items-center p-8"><Loader text="Please wait..." /></div>}
                    {brandAlignmentStatus === 'error' && (
                        <div className="text-center text-red-600 dark:text-red-400 p-4">
                            <p>Could not complete brand analysis. Please try again.</p>
                        </div>
                    )}
                    {brandAlignmentStatus === 'success' && brandAlignment && (
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                <RadialProgress score={brandAlignment.score} />
                            </div>
                            <div className="flex-grow space-y-4">
                                <div>
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300">Rationale</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">{brandAlignment.rationale}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><LightBulbIcon className="h-5 w-5" /> Suggestions for Improvement</h4>
                                    <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        {brandAlignment.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};