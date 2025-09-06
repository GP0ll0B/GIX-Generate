import React from 'react';
import { GeneratedContent } from '../types';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { SignatureBlock } from './SignatureBlock';
import { BrandReviewPanel } from './BrandReviewPanel';

interface FacebookAnalysisPostProps {
  post: Extract<GeneratedContent, { type: 'analysis' }>;
  onReview: () => void;
}

export const FacebookAnalysisPost: React.FC<FacebookAnalysisPostProps> = ({ post, onReview }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
        <Hashtags hashtags={post.hashtags} />
        <SignatureBlock variant="text" />
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};
