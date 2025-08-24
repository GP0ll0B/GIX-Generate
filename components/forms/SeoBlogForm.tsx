import React from 'react';
import { SeoBlogInput } from '../../constants';

interface SeoBlogFormProps {
    input: SeoBlogInput;
    setInput: React.Dispatch<React.SetStateAction<SeoBlogInput>>;
}

export const SeoBlogForm: React.FC<SeoBlogFormProps> = ({ input, setInput }) => {
    const handleInputChange = (field: keyof SeoBlogInput, value: string) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const tones = ['Knowledgeable', 'Optimistic', 'Futuristic', 'Professional', 'Casual', 'Humorous'];

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="seo-topic" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Topic / Core Idea</label>
                <input
                    id="seo-topic"
                    type="text"
                    value={input.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder="e.g., The impact of quantum computing on cryptography"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="seo-keyword" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Primary Keyword</label>
                <input
                    id="seo-keyword"
                    type="text"
                    value={input.keyword}
                    onChange={(e) => handleInputChange('keyword', e.target.value)}
                    placeholder="e.g., quantum cryptography"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="seo-audience" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">3. Target Audience</label>
                <input
                    id="seo-audience"
                    type="text"
                    value={input.audience}
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                    placeholder="e.g., Cybersecurity professionals and tech enthusiasts"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="seo-tone" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">4. Tone of Voice</label>
                <select
                    id="seo-tone"
                    value={input.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    {tones.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                </select>
            </div>
        </div>
    );
};
