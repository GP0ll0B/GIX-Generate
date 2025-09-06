import React from 'react';
import { GeneratedContent } from '../types';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SparklesIcon, BuildingStorefrontIcon } from './ui/icons';
import { BrandReviewPanel } from './BrandReviewPanel';

interface GoogleBusinessPostProps {
  post: Extract<GeneratedContent, { type: 'google_business_post' }>;
  isGeneratingImage: boolean;
  onGenerateImage: () => void;
  onPromptChange: (newPrompt: string) => void;
  onReview: () => void;
}

export const GoogleBusinessPost: React.FC<GoogleBusinessPostProps> = ({ 
  post, isGeneratingImage, onGenerateImage, onPromptChange, onReview
}) => {
  const isFinalImage = post.imageUrl && post.imageUrl.startsWith('data:');

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden max-w-sm mx-auto">
      {/* Image Section */}
      <div className="aspect-video bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center relative">
        {isGeneratingImage ? (
          <div className="text-center text-gray-500 flex flex-col items-center">
            <Loader text="Generating image..." />
          </div>
        ) : isFinalImage ? (
          <img src={post.imageUrl} alt={post.imagePrompt} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500 flex flex-col items-center p-4">
            <SparklesIcon />
            <p className="mt-2 font-medium">Image will appear here</p>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <BuildingStorefrontIcon className="h-5 w-5" />
            </div>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{post.businessName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posted just now</p>
            </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed mb-4">
          {post.postContent}
        </p>
        <Button variant="primary" className="w-full !py-2.5">
            {post.callToAction}
        </Button>
      </div>

      {/* Image Prompt Editor */}
      {!isFinalImage && (
        <div className="p-4 border-t border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <label htmlFor="image-prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Editable Image Prompt
          </label>
          <textarea
            id="image-prompt"
            value={post.imagePrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
            disabled={isGeneratingImage}
          />
          <Button 
            onClick={onGenerateImage}
            disabled={isGeneratingImage || !post.imagePrompt.trim()}
            className="w-full mt-3"
          >
            {isGeneratingImage ? <Loader text="Generating Image..." /> : 'Generate Image'}
          </Button>
        </div>
      )}
      <BrandReviewPanel post={post} onReview={onReview} />
    </div>
  );
};