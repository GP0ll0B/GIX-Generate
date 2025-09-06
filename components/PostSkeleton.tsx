import React from 'react';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
        {/* Post Placeholder */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden animate-pulse">
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200/80 dark:bg-gray-700/80 mr-3"></div>
                    <div>
                        <div className="h-4 w-32 bg-gray-200/80 dark:bg-gray-700/80 rounded"></div>
                        <div className="h-3 w-48 bg-gray-200/80 dark:bg-gray-700/80 rounded mt-1.5"></div>
                    </div>
                </div>
                {/* Content */}
                <div className="space-y-3 mt-4">
                    <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-full"></div>
                    <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-4/6"></div>
                </div>
            </div>
            {/* Image Placeholder */}
            <div className="aspect-video bg-gray-200/80 dark:bg-gray-700/80"></div>
        </div>
        
        {/* Action Bar Placeholder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 animate-pulse">
            <div className="flex-1 flex justify-start w-full sm:w-auto">
                <div className="h-11 w-32 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg"></div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="h-11 flex-1 sm:w-24 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg"></div>
                <div className="h-11 flex-1 sm:w-32 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg"></div>
            </div>
        </div>
    </div>
  );
};
