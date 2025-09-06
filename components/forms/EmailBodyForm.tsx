import React from 'react';
import { EmailBodyInput } from '../../types';

interface EmailBodyFormProps {
    input: EmailBodyInput;
    setInput: React.Dispatch<React.SetStateAction<EmailBodyInput>>;
}

export const EmailBodyForm: React.FC<EmailBodyFormProps> = ({ input, setInput }) => {
    const handleInputChange = (field: keyof EmailBodyInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const campaignTypes = ['Product Launch', 'Weekly Newsletter', 'Promotional Offer', 'Event Invitation', 'Re-engagement'];
    const tones = ['Professional', 'Friendly & Casual', 'Enthusiastic', 'Formal', 'Humorous'];

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="campaign-type-body" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Campaign Type</label>
                <select
                    id="campaign-type-body"
                    value={input.campaignType}
                    onChange={(e) => handleInputChange('campaignType', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {campaignTypes.map(type => <option key={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="audience-body" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Target Audience</label>
                <input
                    id="audience-body"
                    type="text"
                    value={input.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Existing customers, new subscribers"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
             <div>
                <label htmlFor="key-points-body" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">3. Key Points to Include</label>
                <textarea
                    id="key-points-body"
                    value={input.keyPoints}
                    onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                    placeholder="- Announce new feature X&#10;- Mention 20% discount (code: NEWFEATURE20)&#10;- CTA: 'Try it now'"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={4}
                />
            </div>
             <div>
                <label htmlFor="tone-body" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">4. Tone of Voice</label>
                <select
                    id="tone-body"
                    value={input.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {tones.map(tone => <option key={tone}>{tone}</option>)}
                </select>
            </div>
        </div>
    );
};