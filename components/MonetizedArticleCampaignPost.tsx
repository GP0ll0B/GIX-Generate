import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { BrandReviewPanel } from './BrandReviewPanel';
import { Button } from './ui/Button';
import { PostHeader } from './PostHeader';
import { Hashtags } from './Hashtags';
import { Loader } from './ui/Loader';
import { SparklesIcon, LinkIcon, CopyIcon, CheckIcon } from './ui/icons';
import { PlatformDetails } from './PlatformDetails';

// A simplified renderer for the article preview
const ArticlePreviewRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').filter(line => !line.trim().startsWith('<!--'));
    const snippet = lines.slice(0, 5).join('\n');
    return <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{snippet}...</p>;
};

interface MonetizedArticleCampaignPostProps {
  post: Extract<GeneratedContent, { type: 'monetized_article_campaign' }>;
  isGeneratingImage: boolean;
  onGenerateImage: () => void;
  onPromptChange: (newPrompt: string) => void;
  onReview: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const MonetizedArticleCampaignPost: React.FC<MonetizedArticleCampaignPostProps> = ({
  post, isGeneratingImage, onGenerateImage, onPromptChange, onReview, showToast
}) => {
  const isFinalImage = post.fbPost.imageUrl && post.fbPost.imageUrl.startsWith('data:');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAmpHtml = () => {
    const { ampArticle } = post;
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
                html += `      <!-- Ad placeholder: Replace with your amp-ad code -->\n      <amp-ad width="300" height="250"\n          type="adsense"\n          data-ad-client="ca-pub-YOUR-CLIENT-ID"\n          data-ad-slot="YOUR-SLOT-ID">\n      </amp-ad>\n`;
            } else if (trimmedLine.startsWith('<!--')) {
                html += `      ${trimmedLine}\n`;
            } else if (trimmedLine) {
                flushList();
                html += `      <p>${trimmedLine}</p>\n`;
            }
        });
        flushList();
        return html;
    };

    const htmlBody = convertAmpBodyToHtml(ampArticle.ampBody);

    const fullHtml = `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-auto-ads"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
    </script>
    <title>${ampArticle.title}</title>
    <link rel="canonical" href="path/to/your/canonical/page.html">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  </head>
  <body>
    <amp-auto-ads type="adsense"
        data-ad-client="ca-pub-YOUR-ADSENSE-ID">
    </amp-auto-ads>
    <div class="content">
      <h1>${ampArticle.title}</h1>
${htmlBody}
      <a href="#" class="cta-button">${ampArticle.ctaText}</a>
    </div>
  </body>
</html>`;
        navigator.clipboard.writeText(fullHtml);
        showToast('Full AMP article HTML copied!', 'success');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
          <div className="p-4 sm:p-6">
            <PostHeader />
            <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1 mb-2">Sponsored</div>
            <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
              {post.fbPost.caption}
            </div>
          </div>
          
          {!isFinalImage && (
            <div className="p-4 sm:p-6 border-y border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5">
              <label htmlFor="image-prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Editable Image Prompt
              </label>
              <textarea
                id="image-prompt"
                value={post.fbPost.imagePrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
                disabled={isGeneratingImage}
              />
              <Button 
                onClick={onGenerateImage}
                disabled={isGeneratingImage || !post.fbPost.imagePrompt.trim()}
                className="w-full mt-3"
              >
                {isGeneratingImage ? <Loader text="Generating Image..." /> : 'Generate Image'}
              </Button>
            </div>
          )}
          
          <div className="aspect-video bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
            {isGeneratingImage ? (
              <div className="text-center text-gray-500 flex flex-col items-center">
                <Loader text="Generating creative..." />
              </div>
            ) : isFinalImage ? (
              <img src={post.fbPost.imageUrl} alt={post.fbPost.imagePrompt} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500 flex flex-col items-center p-4">
                <SparklesIcon />
                <p className="mt-2 font-medium">Post Image</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/5 dark:bg-white/5 border-y border-white/20 dark:border-white/10">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><LinkIcon /> Linked AMP Article</h4>
                <Button onClick={handleCopyAmpHtml} variant="secondary" className="!py-1 !px-2 !text-xs">
                    {isCopied ? <CheckIcon /> : <CopyIcon />} Copy AMP HTML
                </Button>
            </div>
            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                 <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">GIX.AI BLOG</p>
                 <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{post.ampArticle.title}</p>
                 <ArticlePreviewRenderer content={post.ampArticle.ampBody} />
                 <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{post.ampArticle.ctaText}</p>
                 </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <Hashtags hashtags={post.fbPost.hashtags} />
          </div>
          <BrandReviewPanel post={post} onReview={onReview} />
          <PlatformDetails />
        </div>
    );
};

export default MonetizedArticleCampaignPost;
