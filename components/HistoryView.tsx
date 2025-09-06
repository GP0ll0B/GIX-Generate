import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { Button } from './ui/Button';
import { ArchiveIcon } from './ui/icons';

interface HistoryViewProps {
    onLoadItem: (item: HistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onLoadItem }) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('gix-content-history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to load history from localStorage", e);
        }
    }, []);

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear your entire content history? This action cannot be undone.")) {
            localStorage.removeItem('gix-content-history');
            setHistory([]);
        }
    };

    return (
        <div className="animate-fade-in-fast">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                        Content History
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Review and reload your past generations.
                    </p>
                </div>
                {history.length > 0 && (
                     <Button variant="secondary" onClick={handleClearHistory} className="!bg-red-500/10 hover:!bg-red-500/20 !text-red-700 dark:!text-red-300">
                        Clear History
                    </Button>
                )}
            </div>
            {history.length === 0 ? (
                <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <ArchiveIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">No History Yet</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Your generated content will appear here once you create it.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(item => (
                        <div key={item.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-xl shadow-md border border-white/20 dark:border-white/10 flex items-center justify-between gap-4">
                            <div className="flex-grow overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full flex-shrink-0">{item.postType.replace(/_/g, ' ')}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{new Date(item.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 truncate" title={item.preview}>
                                    {item.preview}
                                </p>
                            </div>
                            <Button onClick={() => onLoadItem(item)} className="flex-shrink-0">
                                Load
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};