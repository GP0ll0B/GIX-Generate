import React from 'react';
import { GeneratedContent } from '../types';
import { BrandReviewPanel } from './BrandReviewPanel';
import { PlatformDetails } from './PlatformDetails';

interface EmailSubjectPreviewProps {
  post: Extract<GeneratedContent, { type: 'email_subject' }>;
  onReview: () => void;
}

export const EmailSubjectPreview: React.FC<EmailSubjectPreviewProps> = ({ post, onReview }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
            <img src="https://api.dicebear.com/7.x/initials/svg?seed=GIX&backgroundColor=008080" alt="Sender" className="w-10 h-10 rounded-full"/>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">GIX from AikoInfinity</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">to: Valued Subscriber</p>
            </div>
        </div>
        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Subject:</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{post.subject}</p>
        </div>
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};