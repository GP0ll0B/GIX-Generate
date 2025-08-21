import React from 'react';
import { GeneratedContent } from '../constants';
import { Button } from './ui/Button';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { Loader } from './ui/Loader';
import { SparklesIcon, HandshakeIcon } from './ui/icons';
import { BrandReviewPanel } from './BrandReviewPanel';
import { PostHeader } from './PostHeader';

interface FacebookAllianceAdPostProps {
  post: Extract<GeneratedContent, { type: 'alliance_ad' }>;
  isGeneratingImage: boolean;
  onGenerateImage: () => void;
  onPromptChange: (newPrompt: string) => void;
  onReview: () => void;
}

const AlliancePostHeader: React.FC<{allyName: string, allyAvatar: string}> = ({ allyName, allyAvatar }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
                 <img
                    src="https://api.dicebear.com/7.x/initials/svg?seed=GIX&backgroundColor=008080,009688,4caf50&backgroundType=gradient"
                    alt="GIX"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                />
                 <img
                    src={allyAvatar}
                    alt={allyName}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                />
            </div>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">
                    GIX
                    <span className="font-normal text-gray-600 dark:text-gray-400"> in partnership with </span> 
                    {allyName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sponsored · Just now · 🌐</p>
            </div>
        </div>
    );
};


export const FacebookAllianceAdPost: React.FC<FacebookAllianceAdPostProps> = ({ 
  post, isGeneratingImage, onGenerateImage, onPromptChange, onReview 
}) => {
  const isFinalImage = post.imageUrl && post.imageUrl.startsWith('data:');

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <AlliancePostHeader allyName={post.ally.name} allyAvatar={post.ally.avatarUrl} />
        <div className="mt-4 text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
          {post.primaryText}
        </div>
      </div>
      
       {!isFinalImage && (
        <div className="p-4 sm:p-6 border-y border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <label htmlFor="ad-image-prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Editable Alliance Creative Prompt
          </label>
          <textarea
            id="ad-image-prompt"
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
            {isGeneratingImage ? <Loader text="Generating Creative..." /> : 'Generate Alliance Creative'}
          </Button>
        </div>
      )}

      <div className="aspect-video bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
        {isGeneratingImage ? (
          <div className="text-center text-gray-500 flex flex-col items-center">
            <Loader text="Generating creative..." />
          </div>
        ) : isFinalImage ? (
          <img src={post.imageUrl} alt={post.imagePrompt} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500 flex flex-col items-center p-4">
            <SparklesIcon />
            <p className="mt-2 font-medium">Alliance Creative</p>
            <p className="text-sm">Generate an image for the alliance creative</p>
          </div>
        )}
      </div>

       <div className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 border-y border-white/20 dark:border-white/10">
            <div className="flex-grow pr-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">GIX.AI</p>
                <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{post.headline}</p>
            </div>
            <Button variant="secondary" className="!px-6 !py-2.5 flex-shrink-0">
                {post.callToAction}
            </Button>
       </div>
      
      <div className="p-4 sm:p-6">
        <Hashtags hashtags={post.hashtags} />
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};