import React from 'react';
import { GeneratedContent, SIGNATURE_HTML_FOR_TEXT_POST } from '../constants';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SparklesIcon } from './ui/icons';
import { PostHeader } from './PostHeader';
import { Hashtags } from './Hashtags';
import { SignatureBlock } from './SignatureBlock';
import { PlatformDetails } from './PlatformDetails';
import { BrandReviewPanel } from './BrandReviewPanel';

// Simple Markdown to React component renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const processLine = (line: string): React.ReactNode => {
        const parts = line.split('**');
        return parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );
    };

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc list-inside my-2 pl-4 space-y-1">
                    {listItems.map((item, index) => <li key={index}>{processLine(item)}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
            flushList();
            elements.push(<br key={index} />);
            return;
        }

        // Handle headings
        if (trimmedLine.startsWith('## ')) {
            flushList();
            elements.push(<h3 key={index} className="text-xl font-bold mt-4 mb-2">{trimmedLine.substring(3)}</h3>);
            return;
        }
        if (trimmedLine.startsWith('# ')) {
            flushList();
            elements.push(<h2 key={index} className="text-2xl font-bold mt-6 mb-3">{trimmedLine.substring(2)}</h2>);
            return;
        }

        // Handle list items
        if (trimmedLine.startsWith('* ')) {
            listItems.push(trimmedLine.substring(2));
            return;
        }

        flushList();
        
        elements.push(<p key={index} className="my-2">{processLine(trimmedLine)}</p>);
    });
    
    flushList();

    return <>{elements}</>;
};


interface FacebookBlogPostProps {
  post: Extract<GeneratedContent, { type: 'blog' }>;
  isGeneratingImage: boolean;
  onGenerateImage: () => void;
  onPromptChange: (newPrompt: string) => void;
  onReview: () => void;
}

export const FacebookBlogPost: React.FC<FacebookBlogPostProps> = ({ 
  post, isGeneratingImage, onGenerateImage, onPromptChange, onReview
}) => {
  const isFinalImage = post.imageUrl && post.imageUrl.startsWith('data:');

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 my-4">{post.title}</h1>
      </div>
      
      {/* Image Generation UI */}
       <div className="p-4 sm:p-6 border-y border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5">
         {!isFinalImage && (
            <>
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
                {isGeneratingImage ? <Loader text="Generating Image..." /> : 'Generate Concept Art'}
            </Button>
            </>
         )}

        <div className="mt-4 aspect-video bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center rounded-lg">
            {isGeneratingImage ? (
            <div className="text-center text-gray-500 flex flex-col items-center">
                <Loader text="Generating image..." />
            </div>
            ) : isFinalImage ? (
            <img src={post.imageUrl} alt={post.imagePrompt} className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-gray-500 flex flex-col items-center p-4">
                    <SparklesIcon />
                    <p className="mt-2 font-medium">Concept art will appear here</p>
                    <p className="text-sm">Click "Generate" to create the visual</p>
                </div>
            )}
        </div>
      </div>
      
      {/* Article Body */}
      <div className="p-4 sm:p-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed article-body">
         <MarkdownRenderer content={post.body} />
      </div>

      <div className="p-4 sm:p-6">
        <Hashtags hashtags={post.hashtags} />
        <SignatureBlock html={SIGNATURE_HTML_FOR_TEXT_POST} />
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
      <PlatformDetails />
    </div>
  );
};