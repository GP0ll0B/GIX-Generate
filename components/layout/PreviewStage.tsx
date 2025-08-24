import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GeneratedContent, PostType, SIGNATURE_TEXT_FOR_COPY, Source } from '../../constants';
import { PostSkeleton } from '../PostSkeleton';
import { ChevronDownIcon, LinkIcon, SparklesIcon } from '../ui/icons';
import { FacebookPost } from '../FacebookPost';
import { FacebookGroundedPost } from '../FacebookGroundedPost';
import { FacebookImagePost } from '../FacebookImagePost';
import { FacebookVideoPost } from '../FacebookVideoPost';
import { FacebookAnalysisPost } from '../FacebookAnalysisPost';
import { FacebookAdPost } from '../FacebookAdPost';
import { ActionBar } from '../ActionBar';
import { FacebookGeneratedVideoPost } from '../FacebookGeneratedVideoPost';
import { FacebookVoiceDialogPost } from '../FacebookVoiceDialogPost';
import { FacebookGuidedPost } from '../FacebookGuidedPost';
import { GoogleBusinessPost } from '../GoogleBusinessPost';
import { FacebookAllianceAdPost } from '../FacebookAllianceAdPost';
import { FacebookBlogPost } from '../FacebookBlogPost';
import { AmpArticlePrototype } from '../AmpArticlePrototype';
import MonetizedArticleCampaignPost from '../MonetizedArticleCampaignPost';
import { BrandReviewPanel } from '../BrandReviewPanel';
import { PostHeader } from '../PostHeader';
import { PlatformDetails } from '../PlatformDetails';

interface PreviewStageProps {
  isLoading: boolean;
  isGeneratingImage?: boolean;
  postType: PostType;
  contentVariations: GeneratedContent[];
  currentVariationIndex: number;
  setCurrentVariationIndex: (index: number) => void;
  onGenerateImage?: () => void;
  onPromptChange?: (prompt: string) => void;
  onPublish: () => void;
  onReviewBrandAlignment: (variationIndex: number) => void;
  onTitleSelect?: (selectedTitle: string, variationIndex: number) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const EmptyState: React.FC = () => (
  <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center items-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10">
      <SparklesIcon />
      <p className="text-lg font-semibold mt-4">Your generated content will appear here.</p>
      <p className="text-sm mt-1">Select a post type, fill in the details, and click "Generate".</p>
  </div>
);

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
            return;
        }

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

const GroundingSources: React.FC<{ sources: Source[] }> = ({ sources }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (sources.length === 0) return null;

    return (
        <div className="my-4 text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
                <span className="flex items-center gap-2">
                    <LinkIcon />
                    Titles informed by {sources.length} web source{sources.length > 1 ? 's' : ''}
                </span>
                 <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                 <div className="mt-2 pl-7 text-xs text-gray-500 dark:text-gray-400 space-y-2 animate-fade-in-fast">
                    {sources.map((source, index) => (
                        <a 
                            key={source.web.uri + index}
                            href={source.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block truncate hover:underline"
                            title={source.web.uri}
                        >
                            {index + 1}. {source.web.title || source.web.uri}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};


const SeoBlogPost: React.FC<{
    post: Extract<GeneratedContent, { type: 'seo_blog_post' }>;
    onReview: () => void;
    onSelectTitle: (title: string) => void;
}> = ({ post, onReview, onSelectTitle }) => {
    if (post.stage === 'titles') {
        return (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
                <div className="p-4 sm:p-6">
                    <PostHeader />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 my-4">Step 1: Choose a Title</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">The AI has generated several SEO-optimized titles based on your input.</p>
                    {post.sources && post.sources.length > 0 && <GroundingSources sources={post.sources} />}
                    <div className="space-y-3 mt-4">
                        {post.titles.map((title, index) => (
                            <button
                                key={index}
                                onClick={() => onSelectTitle(title)}
                                className="w-full text-left p-4 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-blue-500/10 hover:border-blue-500 border border-transparent transition-all"
                            >
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
                            </button>
                        ))}
                    </div>
                </div>
                 <BrandReviewPanel post={post} onReview={onReview} />
            </div>
        );
    }
    
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6">
                <PostHeader />
                 <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">SEO Blog Post</h2>
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mt-2 mb-4">{post.selectedTitle}</h1>

                <div className="my-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-2">
                    <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Meta Description</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{post.metaDescription}"</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {post.tags?.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs font-medium rounded-full">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed article-body">
                {post.body && <MarkdownRenderer content={post.body} />}
            </div>
             <BrandReviewPanel post={post} onReview={onReview} />
            <PlatformDetails />
        </div>
    );
};


export const PreviewStage: React.FC<PreviewStageProps> = ({
  isLoading, isGeneratingImage, postType, contentVariations, currentVariationIndex,
  setCurrentVariationIndex, onGenerateImage, onPromptChange, onPublish, onReviewBrandAlignment, showToast, onTitleSelect
}) => {
    
    const fadeAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const postIsReady = !isLoading && contentVariations.length > 0;
    const currentPost = postIsReady ? contentVariations[currentVariationIndex] : null;

    const handleCopy = () => {
        const content = contentVariations[currentVariationIndex];
        if (!content) return;
        
        let textToCopy = '';
        
        if (content.type === 'text' || content.type === 'guided' || content.type === 'grounded_text' || content.type === 'analysis') {
          const hashtagsText = content.hashtags?.join(' ') || '';
          textToCopy = `${content.content}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'video') {
          const hashtagsText = content.hashtags?.join(' ') || '';
          textToCopy = `${content.title}\n\n${content.message}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'image' || content.type === 'ad' || content.type === 'alliance_ad') {
          const hashtagsText = content.hashtags?.join(' ') || '';
          const mainText = content.type === 'image' ? content.caption : content.primaryText;
          textToCopy = `${mainText}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'monetized_article_campaign') {
          const hashtagsText = content.fbPost.hashtags?.join(' ') || '';
          textToCopy = `${content.fbPost.caption}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'strategy') {
          textToCopy = JSON.stringify(content.strategy, null, 2);
        } else if (content.type === 'video_generation') {
            textToCopy = `Video Prompt: ${content.prompt}`;
            if (content.videoUrl) {
                textToCopy += `\n\nVideo URL (temporary): ${content.videoUrl}`;
            }
        } else if (content.type === 'google_business_post') {
            textToCopy = content.postContent;
        } else if (content.type === 'voice_dialog') {
            textToCopy = `Voice Dialog: ${content.dialogType}\nScenario: ${content.scenario}\n\n`;
            textToCopy += content.dialog.map(turn => `${turn.speaker}: ${turn.line}`).join('\n');
        } else if (content.type === 'blog' || (content.type === 'seo_blog_post' && content.stage === 'article')) {
            const body = content.type === 'blog' ? content.body : content.body || '';
            const title = content.type === 'blog' ? content.title : content.selectedTitle || '';
            const hashtags = 'hashtags' in content ? content.hashtags : [];
            const hashtagsText = hashtags?.join(' ') || '';
            textToCopy = `Title: ${title}\n\n${body}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'prototype') {
            const post = content;
            const convertAmpBodyToHtml = (markdown: string) => {
                let inList = false;
                let html = '';
                const lines = markdown.split('\n');

                const flushList = () => {
                    if (inList) {
                        html += '    </ul>\n';
                        inList = false;
                    }
                };

                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('## ')) {
                        flushList();
                        html += `      <h2>${trimmedLine.substring(3)}</h2>\n`;
                    } else if (trimmedLine.startsWith('* ')) {
                        if (!inList) {
                            html += '    <ul>\n';
                            inList = true;
                        }
                        html += `        <li>${trimmedLine.substring(2)}</li>\n`;
                    } else if (trimmedLine.startsWith('<!-- suggestion: A 300x250 <amp-ad>')) {
                        flushList();
                        // Placeholder for manual ad placement. The publisher needs to fill in details.
                        html += `      <!-- Ad placeholder: Replace with your amp-ad code -->\n      <amp-ad width="300" height="250"\n          type="adsense"\n          data-ad-client="ca-pub-YOUR-CLIENT-ID"\n          data-ad-slot="YOUR-SLOT-ID">\n      </amp-ad>\n`;
                    } else if (trimmedLine.startsWith('<!--')) {
                        // Keep other suggestions as comments
                        html += `      ${trimmedLine}\n`;
                    } else if (trimmedLine) {
                        flushList();
                        html += `      <p>${trimmedLine}</p>\n`;
                    }
                });
                flushList();
                return html;
            };

            const htmlBody = convertAmpBodyToHtml(post.ampBody);

            textToCopy = `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <!-- 
      Step 1: Copy this script into the <head> of your AMP site.
      This script loads the amp-auto-ads library.
    -->
    <script async custom-element="amp-auto-ads"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
    </script>
    <title>${post.title}</title>
    <link rel="canonical" href="path/to/your/canonical/page.html">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; line-height: 1.6; padding: 0; margin: 0; background-color: #f9f9f9; }
      .content { max-width: 700px; margin: 0 auto; padding: 24px; background-color: #fff; }
      h1 { font-size: 2.5em; font-weight: 800; margin-bottom: 0.5em; }
      h2 { font-size: 1.8em; font-weight: 700; margin-top: 1.5em; }
      p, li { font-size: 1.1em; }
      .cta-button { display: block; width: 100%; padding: 16px; background-color: #007bff; color: white; text-align: center; text-decoration: none; font-weight: bold; border-radius: 8px; margin-top: 32px; font-size: 1.2em; }
    </style>
  </head>
  <body>
    <!-- 
      Step 2: Copy this tag right after the <body> tag on your pages.
      This enables AdSense Auto Ads.
    -->
    <amp-auto-ads type="adsense"
        data-ad-client="ca-pub-1802438847946087">
    </amp-auto-ads>

    <div class="content">
      <h1>${post.title}</h1>
      
${htmlBody}
      <a href="#" class="cta-button">${post.ctaText}</a>
    </div>
  </body>
</html>`;
        }
        
        navigator.clipboard.writeText(textToCopy);
        showToast('Post content copied to clipboard!', 'success');
    };

    const renderPost = (post: GeneratedContent) => {
        const onReview = () => onReviewBrandAlignment(currentVariationIndex);

        switch (post.type) {
            case 'text': return <FacebookPost post={post} onReview={onReview} />;
            case 'guided': return <FacebookGuidedPost post={post} onReview={onReview} />;
            case 'grounded_text': return <FacebookGroundedPost post={post} onReview={onReview} />;
            case 'ad': return (
                <FacebookAdPost 
                    post={post}
                    isGeneratingImage={isGeneratingImage!}
                    onGenerateImage={onGenerateImage!}
                    onPromptChange={onPromptChange!}
                    onReview={onReview}
                />
            );
            case 'alliance_ad': return (
                <FacebookAllianceAdPost 
                    post={post}
                    isGeneratingImage={isGeneratingImage!}
                    onGenerateImage={onGenerateImage!}
                    onPromptChange={onPromptChange!}
                    onReview={onReview}
                />
            );
            case 'image': return (
                <FacebookImagePost 
                    post={post}
                    isGeneratingImage={isGeneratingImage!}
                    onGenerateImage={onGenerateImage!}
                    onPromptChange={onPromptChange!}
                    isPostLoading={isLoading}
                    onReview={onReview}
                />
            );
            case 'google_business_post': return (
                <GoogleBusinessPost 
                    post={post}
                    isGeneratingImage={isGeneratingImage!}
                    onGenerateImage={onGenerateImage!}
                    onPromptChange={onPromptChange!}
                    onReview={onReview}
                />
            );
             case 'monetized_article_campaign': return (
                <MonetizedArticleCampaignPost
                    post={post}
                    isGeneratingImage={isGeneratingImage!}
                    onGenerateImage={onGenerateImage!}
                    onPromptChange={onPromptChange!}
                    onReview={onReview}
                    showToast={showToast}
                />
            );
            case 'video': return <FacebookVideoPost post={post} onReview={onReview} />;
            case 'video_generation': return <FacebookGeneratedVideoPost post={post} />;
            case 'voice_dialog': return <FacebookVoiceDialogPost post={post} />;
            case 'analysis': return <FacebookAnalysisPost post={post} onReview={onReview} />;
            case 'blog': return (
                <FacebookBlogPost 
                    post={post}
                    isGeneratingImage={isGeneratingImage!}
                    onGenerateImage={onGenerateImage!}
                    onPromptChange={onPromptChange!}
                    onReview={onReview}
                />
            );
            case 'seo_blog_post': return <SeoBlogPost post={post} onSelectTitle={(title) => onTitleSelect?.(title, currentVariationIndex)} onReview={onReview} />;
            case 'prototype': return <AmpArticlePrototype post={post} onReview={onReview} />;
            default: return null;
        }
    };
    
    return (
        <div className="relative min-h-[600px] lg:min-h-0 lg:h-full">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="skeleton" initial={fadeAnimation.initial} animate={fadeAnimation.animate} exit={fadeAnimation.exit} className="absolute inset-0">
                        <PostSkeleton />
                    </motion.div>
                ) : contentVariations.length === 0 ? (
                    <motion.div key="empty" initial={fadeAnimation.initial} animate={fadeAnimation.animate} exit={fadeAnimation.exit} className="absolute inset-0">
                         <EmptyState />
                    </motion.div>
                ) : (
                    <motion.div key="content" initial={fadeAnimation.initial} animate={fadeAnimation.animate} exit={fadeAnimation.exit} className="space-y-4">
                        <ActionBar 
                            onPublish={onPublish}
                            onCopy={handleCopy}
                            onPrev={() => setCurrentVariationIndex(currentVariationIndex - 1)}
                            onNext={() => setCurrentVariationIndex(currentVariationIndex + 1)}
                            currentIndex={currentVariationIndex}
                            totalVariations={contentVariations.length}
                            disabled={isLoading || !!isGeneratingImage || (currentPost && 'brandAlignmentStatus' in currentPost && currentPost.brandAlignmentStatus === 'loading')}
                        />
                        {currentPost && (
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={currentVariationIndex} 
                                    initial={fadeAnimation.initial}
                                    animate={fadeAnimation.animate}
                                    exit={fadeAnimation.exit}
                                >
                                    {renderPost(currentPost)}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};