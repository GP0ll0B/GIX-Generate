import React from 'react';
import { EmailSubjectInput } from '../../types';

interface EmailSubjectFormProps {
    input: EmailSubjectInput;
    setInput: React.Dispatch<React.SetStateAction<EmailSubjectInput>>;
}

export const EmailSubjectForm: React.FC<EmailSubjectFormProps> = ({ input, setInput }) => {
    const handleInputChange = (field: keyof EmailSubjectInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const campaignTypes = ['Product Launch', 'Weekly Newsletter', 'Promotional Offer', 'Event Invitation', 'Re-engagement'];

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="campaign-type" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Campaign Type</label>
                <select
                    id="campaign-type"
                    value={input.campaignType}
                    onChange={(e) => handleInputChange('campaignType', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {campaignTypes.map(type => <option key={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="key-info-subject" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Key Information</label>
                <textarea
                    id="key-info-subject"
                    value={input.keyInfo}
                    onChange={(e) => handleInputChange('keyInfo', e.target.value)}
                    placeholder="e.g., A new feature that lets users collaborate in real-time. 20% discount."
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={3}
                />
            </div>
        </div>
    );
};