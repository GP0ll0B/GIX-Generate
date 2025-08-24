

import React, { useState } from 'react';
import { GeneratedContent } from '../constants';
import { BrandReviewPanel } from './BrandReviewPanel';
import { Button } from './ui/Button';
import { LightningBoltIcon, CopyIcon, CheckIcon } from './ui/icons';

const CodeSnippet: React.FC<{ code: string }> = ({ code }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative bg-gray-900/80 rounded-lg p-4 font-mono text-sm text-gray-300 mt-2">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white"
                aria-label="Copy code"
            >
                {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </button>
            <pre><code>{code.trim()}</code></pre>
        </div>
    );
};

// Simple Markdown to React component renderer with AMP comment styling
const AmpBodyRenderer: React.FC<{ content: string }> = ({ content }) => {
    const processLine = (line: string): React.ReactNode => {
        // Basic bold support
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
                <ul key={`ul-${elements.length}`} className="list-disc list-inside my-4 pl-4 space-y-2">
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
            elements.push(<h3 key={index} className="text-xl font-bold mt-6 mb-2 text-gray-800 dark:text-gray-100">{trimmedLine.substring(3)}</h3>);
            return;
        }
        
        if (trimmedLine.startsWith('* ')) {
            listItems.push(trimmedLine.substring(2));
            return;
        }

        if (trimmedLine.startsWith('<!-- suggestion: A 300x250 <amp-ad>')) {
            flushList();
            elements.push(
                <div key={index} className="my-4 p-4 bg-gray-200/50 dark:bg-gray-700/50 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-center text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-semibold">Suggested Ad Placement</p>
                    <p>300x250 Ad Unit</p>
                </div>
            );
            return;
        }
        
        if (trimmedLine.startsWith('<!--') && trimmedLine.endsWith('-->')) {
            flushList();
            elements.push(
                <div key={index} className="my-4 p-3 bg-yellow-400/10 dark:bg-yellow-400/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 text-sm rounded-r-md italic">
                    <p>{trimmedLine.replace('<!-- suggestion: ', '').replace(' -->', '')}</p>
                </div>
            );
            return;
        }

        flushList();
        
        elements.push(<p key={index} className="my-4 leading-relaxed">{processLine(trimmedLine)}</p>);
    });
    
    flushList();

    return <>{elements}</>;
};


interface AmpArticlePrototypeProps {
  post: Extract<GeneratedContent, { type: 'prototype' }>;
  onReview: () => void;
}

export const AmpArticlePrototype: React.FC<AmpArticlePrototypeProps> = ({ post, onReview }) => {
    const headScript = `<script async custom-element="amp-auto-ads"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
</script>`;

    const bodyTag = `<amp-auto-ads type="adsense"
        data-ad-client="ca-pub-1802438847946087">
</amp-auto-ads>`;

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6 space-y-8">
        {/* AdSense Info Section */}
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Monetize with AdSense for AMP</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                This prototype is configured with AdSense Auto Ads. To enable them on your site, place the following code snippets in your AMP article's HTML.
            </p>
            <div className="mt-4 space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Step 1: Place this in the `<head>` tag</h3>
                    <CodeSnippet code={headScript} />
                </div>
                 <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Step 2: Place this right after the `<body>` tag</h3>
                    <CodeSnippet code={bodyTag} />
                </div>
            </div>
        </div>

        {/* Mobile Device Frame */}
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl border-8 border-gray-300 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                 <img
                    src="https://api.dicebear.com/7.x/initials/svg?seed=GIX&backgroundColor=008080,009688,4caf50&backgroundType=gradient"
                    alt="GIX Logo"
                    className="w-8 h-8 rounded-full"
                />
                 <div className="flex items-center gap-1 text-green-500">
                    <LightningBoltIcon className="h-5 w-5" />
                    <span className="font-bold text-sm">AMP</span>
                </div>
            </div>
            
            {/* Article Content */}
            <div className="py-4 text-gray-700 dark:text-gray-200 text-base">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{post.title}</h1>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Published by GIX Staff
                </div>

                <div className="my-4 p-2 text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                    AdSense Auto Ads are enabled. Ads will be placed automatically in optimal positions.
                </div>

                <div className="article-body">
                    <AmpBodyRenderer content={post.ampBody} />
                </div>

                <Button className="w-full mt-8">
                    {post.ctaText}
                </Button>
            </div>
        </div>
      </div>
      <BrandReviewPanel post={post} onReview={onReview} />
    </div>
  );
};