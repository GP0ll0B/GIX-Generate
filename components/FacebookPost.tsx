import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { SignatureBlock } from './SignatureBlock';
import { BrandReviewPanel } from './BrandReviewPanel';
import { FacebookIcon, InfoIcon, CheckCircleIcon, ErrorIcon, ChevronDownIcon, QuestionMarkCircleIcon, LightBulbIcon } from './ui/icons';

interface FacebookPostProps {
  post: Extract<GeneratedContent, { type: 'text' }>;
  onReview: () => void;
}

const SafetyAnalysisPanel: React.FC<{ analysis: { isSafe: boolean; reasoning: string; } }> = ({ analysis }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isSafe = analysis.isSafe;

    return (
        <div className={`mt-4 border-t border-b border-gray-200/50 dark:border-gray-700/50 ${isSafe ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex justify-between items-center p-4 text-left"
              aria-expanded={isOpen}
            >
                <h4 className={`flex items-center gap-2 font-semibold text-lg ${isSafe ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {isSafe ? <CheckCircleIcon /> : <ErrorIcon />}
                    Content Safety Analysis
                </h4>
                <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 animate-fade-in-fast">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg text-sm">
                        <p><span className="font-semibold">Status:</span> <span className={isSafe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{isSafe ? 'Safe' : 'Review Recommended'}</span></p>
                        <p className="mt-1"><span className="font-semibold">Reasoning:</span> <span className="text-gray-600 dark:text-gray-400 italic">{analysis.reasoning}</span></p>
                    </div>
                </div>
            )}
        </div>
    );
};

const VqaPanel: React.FC<{ result: { question: string; answer: string; reasoning: string; } }> = ({ result }) => (
  <div className="p-4 sm:p-6 space-y-4">
    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2"><QuestionMarkCircleIcon className="h-5 w-5"/> Visual Q&A</h3>
    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Question</p>
      <p className="mt-1 text-gray-700 dark:text-gray-300 italic">"{result.question}"</p>
    </div>
    <div className="p-4 bg-blue-500/10 dark:bg-blue-900/20 rounded-lg">
      <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold">Answer</p>
      <p className="mt-1 text-xl font-bold text-gray-800 dark:text-gray-200">{result.answer}</p>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-300/50 dark:border-gray-600/50 pt-2">
        <strong className="flex items-center gap-1"><LightBulbIcon className="h-4 w-4" /> Reasoning:</strong> {result.reasoning}
      </p>
    </div>
  </div>
);


export const FacebookPost: React.FC<FacebookPostProps> = ({ post, onReview }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        {!post.vqaResult && (
            <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
            {post.caption}
            </div>
        )}
        {post.imageUrl && post.imageUrl.startsWith('data:image') && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                <img src={post.imageUrl} alt="Uploaded content" className="w-full h-full object-cover" />
            </div>
        )}
        {!post.vqaResult && <Hashtags hashtags={post.hashtags} />}
      </div>
      
      {post.vqaResult && <VqaPanel result={post.vqaResult} />}
      
      {post.safetyAnalysis && <SafetyAnalysisPanel analysis={post.safetyAnalysis} />}

      <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FacebookIcon />
            <span>Ready to publish to: Facebook, Instagram</span>
          </div>
          <SignatureBlock variant="text" />
      </div>

      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};
