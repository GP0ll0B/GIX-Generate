import React, { useState } from 'react';
import { MicrophoneIcon, CubeIcon } from './ui/icons';
import { StellaFileExplorer } from './StellaFileExplorer';
import { StellaSystemStatus } from './StellaSystemStatus';

interface StellaDiagnosticsPanelProps {
    activeIntent: string;
}

export const StellaDiagnosticsPanel: React.FC<StellaDiagnosticsPanelProps> = ({ activeIntent }) => {
    const [activeTab, setActiveTab] = useState<'status' | 'files'>('status');

    const TabButton: React.FC<{
        label: string;
        isActive: boolean;
        onClick: () => void;
        icon: React.ReactNode;
    }> = ({ label, isActive, onClick, icon }) => (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 focus:outline-none ${
                isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            aria-pressed={isActive}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-4 sm:px-6">
                This is a simulation representing the underlying models and status for the 'Stella' voice assistant.
            </p>
            <div className="flex mb-4 px-4 sm:px-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <TabButton
                    label="System Status"
                    isActive={activeTab === 'status'}
                    onClick={() => setActiveTab('status')}
                    icon={<MicrophoneIcon className="h-4 w-4" />}
                />
                <TabButton
                    label="File Explorer"
                    isActive={activeTab === 'files'}
                    onClick={() => setActiveTab('files')}
                    icon={<CubeIcon className="h-4 w-4" />}
                />
            </div>
            <div className="px-4 sm:px-6 pb-4">
                {activeTab === 'status' ? (
                    <StellaSystemStatus activeIntent={activeIntent} />
                ) : (
                    <StellaFileExplorer />
                )}
            </div>
        </div>
    );
};
