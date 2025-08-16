import React, { useState } from 'react';
import { GeneratedContent, VoiceDialogInput } from '../constants';
import { PostHeader } from './PostHeader';
import { PlatformDetails } from './PlatformDetails';
import { MicrophoneIcon, CubeIcon } from './ui/icons';
import { StellaFileExplorer } from './StellaFileExplorer';
import { StellaSystemStatus } from './StellaSystemStatus';

interface FacebookVoiceDialogPostProps {
  post: Extract<GeneratedContent, { type: 'voice_dialog' }>;
}

const ChatBubble: React.FC<{ speaker: 'User' | 'Stella', text: string }> = ({ speaker, text }) => {
    const isUser = speaker === 'User';
    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                   S
                </div>
            )}
            <div className={`max-w-md p-3 rounded-2xl ${isUser ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                <p className="text-sm">{text}</p>
            </div>
             {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                   U
                </div>
            )}
        </div>
    );
};


const StellaDiagnosticsPanel: React.FC<{ dialogType: VoiceDialogInput['dialogType'] }> = ({ dialogType }) => {
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
                    <StellaSystemStatus dialogType={dialogType} />
                ) : (
                    <StellaFileExplorer />
                )}
            </div>
        </div>
    );
};


export const FacebookVoiceDialogPost: React.FC<FacebookVoiceDialogPostProps> = ({ post }) => {
    const { dialogType, scenario, dialog } = post;

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6">
                <PostHeader />
                <div className="mt-4">
                     <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-800 dark:text-gray-200">
                        <MicrophoneIcon />
                        Voice Assistant Dialog
                    </h3>
                    <div className="mt-2 p-3 bg-black/5 dark:bg-white/5 rounded-lg text-sm">
                        <p><span className="font-semibold">Type:</span> {dialogType}</p>
                        <p><span className="font-semibold">Scenario:</span> <span className="italic">"{scenario}"</span></p>
                        <p><span className="font-semibold">Assistant:</span> Stella <span className="text-xs text-gray-500">(es_US)</span></p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="space-y-4">
                    {dialog.map((turn, index) => (
                        <ChatBubble key={index} speaker={turn.speaker} text={turn.line} />
                    ))}
                </div>
            </div>
            
            <StellaDiagnosticsPanel dialogType={dialogType} />

            <PlatformDetails />
        </div>
    );
};
