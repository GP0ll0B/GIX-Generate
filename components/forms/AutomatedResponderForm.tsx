import React from 'react';
import { AutomatedResponderInput } from '../../types';

interface AutomatedResponderFormProps {
    input: AutomatedResponderInput;
    setInput: React.Dispatch<React.SetStateAction<AutomatedResponderInput>>;
}

export const AutomatedResponderForm: React.FC<AutomatedResponderFormProps> = ({ input, setInput }) => {
    const handleInputChange = (field: keyof AutomatedResponderInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value as any }));
    };

    const platforms: AutomatedResponderInput['platform'][] = ['Instagram DMs', 'Facebook Messenger', 'Website Chatbot'];

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="responder-goal" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Automation Goal</label>
                <textarea
                    id="responder-goal"
                    value={input.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    placeholder="e.g., Welcome new followers and answer common questions about products, support, and pricing."
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={3}
                />
            </div>
            <div>
                <label htmlFor="responder-platform" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Platform</label>
                <select
                    id="responder-platform"
                    value={input.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {platforms.map(platform => <option key={platform}>{platform}</option>)}
                </select>
            </div>
        </div>
    );
};
