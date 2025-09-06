import React from 'react';
import { GeneratedContent } from '../types';
import { PostHeader } from './PostHeader';
import { PlatformDetails } from './PlatformDetails';
import { DownloadIcon, VideoCameraIcon, ErrorIcon } from './ui/icons';
import { Button } from './ui/Button';

interface FacebookGeneratedVideoPostProps {
  post: Extract<GeneratedContent, { type: 'video_generation' }>;
}

export const FacebookGeneratedVideoPost: React.FC<FacebookGeneratedVideoPostProps> = ({ post }) => {
    const { prompt, videoUrl, status, pollingMessage, progress } = post;

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6">
                <PostHeader />
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 italic">
                    Video generated with prompt: "{prompt}"
                </p>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center">
                {status === 'success' && videoUrl ? (
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                ) : status === 'error' ? (
                    <div className="text-center p-4 text-red-500">
                        <ErrorIcon className="h-10 w-10 mx-auto mb-2" />
                        <p className="font-semibold">Generation Failed</p>
                        <p className="text-xs max-w-xs">{pollingMessage}</p>
                    </div>
                ) : (
                    <div className="text-center p-4 text-white">
                         <div className="relative w-24 h-24 mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                    className="text-gray-700"
                                    strokeWidth="5"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="45"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className="text-blue-500"
                                    strokeWidth="5"
                                    strokeDasharray={2 * Math.PI * 45}
                                    strokeDashoffset={(2 * Math.PI * 45) * (1 - progress / 100)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="45"
                                    cx="50"
                                    cy="50"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                />
                            </svg>
                             <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                                {progress.toFixed(0)}%
                            </div>
                        </div>
                        <p className="mt-3 text-sm">{pollingMessage || "Generating video..."}</p>
                    </div>
                )}
            </div>

            {status === 'success' && videoUrl && (
                <div className="p-4">
                    <a href={videoUrl} download="gix-generated-video.mp4" className="w-full">
                        <Button className="w-full">
                            <DownloadIcon /> Download Video
                        </Button>
                    </a>
                </div>
            )}
            
            <PlatformDetails />
        </div>
    );
};
