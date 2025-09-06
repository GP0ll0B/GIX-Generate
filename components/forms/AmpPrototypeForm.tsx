

import React from 'react';
import { AmpPrototypeInput } from '../../types';

interface AmpPrototypeFormProps {
    input: AmpPrototypeInput;
    setInput: React.Dispatch<React.SetStateAction<AmpPrototypeInput>>;
}

export const AmpPrototypeForm: React.FC<AmpPrototypeFormProps> = ({ input, setInput }) => {
    const handleInputChange = (field: keyof AmpPrototypeInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value } as AmpPrototypeInput));
    };

    const articleGoals: AmpPrototypeInput['articleGoal'][] = ['Drive sign-ups', 'Explain a feature', 'Build brand awareness', 'Announce a launch'];

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="product-service-proto" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Product or Service to Promote</label>
                <input
                    id="product-service-proto"
                    type="text"
                    value={input.productOrService}
                    onChange={(e) => handleInputChange('productOrService', e.target.value)}
                    placeholder="e.g., AikoInfinity's new XAI toolkit"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="article-goal" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Article Goal</label>
                <select
                    id="article-goal"
                    value={input.articleGoal}
                    onChange={(e) => handleInputChange('articleGoal', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {articleGoals.map(goal => <option key={goal}>{goal}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="target-audience-proto" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">3. Target Audience</label>
                <input
                    id="target-audience-proto"
                    type="text"
                    value={input.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Data scientists and AI developers"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="key-points" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">4. Key Talking Points</label>
                <textarea
                    id="key-points"
                    value={input.keyPoints}
                    onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                    placeholder="- Explain what XAI is&#10;- Highlight the 'feature importance' tool&#10;- Show a code snippet example"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={4}
                />
            </div>
        </div>
    );
};