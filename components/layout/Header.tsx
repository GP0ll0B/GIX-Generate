

import React from 'react';
import { ArrowLeftIcon } from '../ui/icons';
import { GIX_BLOG_URL } from '../../constants';

interface HeaderProps {
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
    return (
        <header className="relative text-center py-6 px-4 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    aria-label="Go back"
                >
                    <ArrowLeftIcon />
                </button>
            )}
            <a href={GIX_BLOG_URL} target="_blank" rel="noopener noreferrer" aria-label="GIX.AI Blog">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                    GIX.AI
                </h1>
            </a>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                A Symbiotic Strategist's IDE for content architecture.
            </p>
        </header>
    );
};