import React from 'react';
import { GitHubIcon } from './components/ui/icons';
import { GIX_BLOG_URL } from './constants';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full py-6 px-4 mt-auto">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50 pt-6 max-w-7xl mx-auto">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <p>
                        Copyright &copy; {new Date().getFullYear()}{' '}
                        <a href={GIX_BLOG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">
                            G|I|X Generate
                        </a>
                        . A project by Gazi Pollob Hussain.
                    </p>
                    <a href="https://github.com/GP0ll0B/G-I-X-Generate" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        <GitHubIcon />
                    </a>
                </div>
                <div className="flex justify-center items-center gap-x-3 flex-wrap">
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Privacy</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Terms</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Advertising</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Ad Choices</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    );
};