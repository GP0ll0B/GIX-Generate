import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SparklesIcon } from './ui/icons';
import { PostHeader } from './PostHeader';
import { Hashtags } from './Hashtags';
import { SignatureBlock } from './SignatureBlock';
import { PlatformDetails } from './PlatformDetails';
import { BrandReviewPanel } from './BrandReviewPanel';
import { GIX_BLOG_URL } from '../constants';
import { ToggleSwitch } from './ui/ToggleSwitch';

interface FacebookImagePostProps {
  post: Extract<GeneratedContent, { type: 'image' }>;
  isGeneratingImage: boolean;
  onGenerateImage: (is360: boolean) => void;
  onPromptChange: (newPrompt: string) => void;
  isPostLoading: boolean;
  onReview: () => void;
}

export const FacebookImagePost: React.FC<FacebookImagePostProps> = ({ 
  post, isGeneratingImage, onGenerateImage, onPromptChange, isPostLoading, onReview
}) => {
  const [is360Mode, setIs360Mode] = useState(false);

  const isFinalImage = post.imageUrl && post.imageUrl.startsWith('data:');
  const blogUrl = new URL(GIX_BLOG_URL);

  // If an image is already generated, its format is fixed. Use post.is360 as the source of truth.
  // If we are about to generate a new image, use the local toggle state.
  const displayAs360 = isFinalImage ? post.is360 : is360Mode;

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed mb-4">
          {post.caption}
        </div>
      </div>
      
      {!isFinalImage && (
        <div className="p-4 sm:p-6 border-y border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
          <ToggleSwitch
            label="Generate 360° Photo"
            enabled={is360Mode}
            onChange={setIs360Mode}
            description="Creates a panoramic image (16:9 aspect ratio) suitable for immersive posts. For best results, ensure your prompt describes a wide, continuous scene."
          />
          <div>
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
          </div>
          <Button 
            onClick={() => onGenerateImage(is360Mode)}
            disabled={isGeneratingImage || !post.imagePrompt.trim()}
            className="w-full"
          >
            {isGeneratingImage ? <Loader text="Generating Image..." /> : 'Generate Image'}
          </Button>
        </div>
      )}

      <a href={GIX_BLOG_URL} target="_blank" rel="noopener noreferrer" className="block group">
        <div className={`${displayAs360 ? 'aspect-video' : 'aspect-square'} bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center overflow-hidden`}>
          {isGeneratingImage ? (
            <div className="text-center text-gray-500 flex flex-col items-center">
              <Loader text="Generating image..." />
            </div>
          ) : isFinalImage ? (
            <img src={post.imageUrl} alt={post.imagePrompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
              <div className="text-center text-gray-500 flex flex-col items-center p-4">
                  <SparklesIcon />
                  <p className="mt-2 font-medium">Image will appear here</p>
                  <p className="text-sm">Click "Generate Image" to create the visual</p>
              </div>
          )}
        </div>
        <div className="p-3 bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{blogUrl.hostname}</p>
              <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">GIX.AI - Forging a Symbiotic Future</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">A Symbiotic Strategist's IDE for content architecture.</p>
        </div>
      </a>
      
      <div className="p-4 sm:p-6">
        <Hashtags hashtags={post.hashtags} />
        <SignatureBlock variant="text" />
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};