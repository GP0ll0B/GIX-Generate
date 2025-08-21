import React from 'react';
import { GoogleBusinessPostInput } from '../../constants';

interface GoogleBusinessPostFormProps {
    input: GoogleBusinessPostInput;
    setInput: React.Dispatch<React.SetStateAction<GoogleBusinessPostInput>>;
}

export const GoogleBusinessPostForm: React.FC<GoogleBusinessPostFormProps> = ({ input, setInput }) => {
    const handleInputChange = (field: keyof GoogleBusinessPostInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value } as GoogleBusinessPostInput));
    };

    const postGoals: GoogleBusinessPostInput['postGoal'][] = ['Announce something new', 'Promote an offer', 'Share an update', 'Highlight a product'];
    const ctaOptions: GoogleBusinessPostInput['callToAction'][] = ['Book', 'Order online', 'Buy', 'Learn more', 'Sign up', 'Call'];

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="business-name" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">Business Name</label>
                <input
                    id="business-name"
                    type="text"
                    value={input.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g., The Daily Grind Cafe"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="post-goal" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">Post Goal</label>
                <select
                    id="post-goal"
                    value={input.postGoal}
                    onChange={(e) => handleInputChange('postGoal', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {postGoals.map(goal => <option key={goal}>{goal}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="key-info" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">Key Information</label>
                <textarea
                    id="key-info"
                    value={input.keyInfo}
                    onChange={(e) => handleInputChange('keyInfo', e.target.value)}
                    placeholder="e.g., We're launching a new coffee blend called 'Rocket Fuel'. Get 20% off this week only."
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={3}
                />
            </div>
             <div>
                <label htmlFor="gbp-cta" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">Call to Action Button</label>
                <select
                    id="gbp-cta"
                    value={input.callToAction}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {ctaOptions.map(cta => <option key={cta}>{cta}</option>)}
                </select>
            </div>
        </div>
    );
};