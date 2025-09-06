import React from 'react';
import { GeneratedContent } from '../types';
import { BrandReviewPanel } from './BrandReviewPanel';
import { PlatformDetails } from './PlatformDetails';

interface EmailBodyPreviewProps {
  post: Extract<GeneratedContent, { type: 'email_body' }>;
  onReview: () => void;
}

export const EmailBodyPreview: React.FC<EmailBodyPreviewProps> = ({ post, onReview }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">This is a preview of the generated HTML email body.</p>
        <div 
          className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-inner prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};