import React from 'react';
import { GeneratedContent } from '../types';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { SignatureBlock } from './SignatureBlock';
import { LightBulbIcon } from './ui/icons';
import { BrandReviewPanel } from './BrandReviewPanel';

interface FacebookGuidedPostProps {
  post: Extract<GeneratedContent, { type: 'guided' }>;
  onReview: () => void;
}

export const FacebookGuidedPost: React.FC<FacebookGuidedPostProps> = ({ post, onReview }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        
        <div className="my-4 p-3 bg-blue-500/10 dark:bg-blue-900/20 border-l-4 border-blue-500/50 rounded-r-lg">
            <div className="flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-sm text-blue-800 dark:text-blue-300">
                    Creator Education | Monetization Tip
                </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 ml-1">
                <strong>Topic:</strong> Getting started with {post.monetizationFeature}
            </p>
        </div>

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