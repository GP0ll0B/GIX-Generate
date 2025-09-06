import React from 'react';
import { GeneratedContent, Source } from '../types';
import { LinkIcon } from './ui/icons';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { SignatureBlock } from './SignatureBlock';
import { BrandReviewPanel } from './BrandReviewPanel';

interface FacebookGroundedPostProps {
  post: Extract<GeneratedContent, { type: 'grounded_text' }>;
  onReview: () => void;
}

const SourcesList: React.FC<{ sources: Source[] }> = ({ sources }) => {
    if (!sources || sources.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                <LinkIcon />
                Sources
            </h4>
            <ul className="space-y-2 text-xs">
                {sources.map((source, index) => (
                    <li key={source.web.uri + index} className="flex items-start gap-2">
                        <span className="text-gray-400 dark:text-gray-500 mt-0.5">{index + 1}.</span>
                        <a 
                            href={source.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <p className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {source.web.title || "Untitled Source"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 break-all group-hover:underline">
                                {source.web.uri}
                            </p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export const FacebookGroundedPost: React.FC<FacebookGroundedPostProps> = ({ post, onReview }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
        <SourcesList sources={post.sources} />
        <Hashtags hashtags={post.hashtags} />
        <SignatureBlock variant="text" />
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};
