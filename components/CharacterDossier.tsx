import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    DocumentTextIcon, UsersIcon, ChatBubbleIcon, MegaphoneIcon, 
    LightBulbIcon, CodeIcon, DocumentCheckIcon, GridIcon 
} from './ui/icons';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="py-6 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-blue-500/50 flex items-center gap-3">
            {icon} {title}
        </h3>
        {children}
    </section>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-gray-800 dark:text-gray-200">{value}</p>
    </div>
);

const TagList: React.FC<{ items: string[] }> = ({ items }) => (
    <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
            <span key={index} className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-xs font-medium rounded-full">
                {item}
            </span>
        ))}
    </div>
);

export const CharacterDossier: React.FC = () => {
    const [character, setCharacter] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCharacterData = async () => {
            try {
                const response = await fetch('/Aikoinfinity-Enhanced.json');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setCharacter(data.character);
            } catch (e) {
                console.error("Failed to load character data:", e);
                setError("Failed to load character dossier. The data file might be missing or malformed.");
            }
        };
        fetchCharacterData();
    }, []);

    if (error) {
        return (
            <div className="max-w-4xl mx-auto text-center p-8 bg-red-500/10 text-red-700 dark:text-red-300 rounded-lg">
                <h3 className="font-bold">Error Loading Dossier</h3>
                <p className="text-sm mt-2">{error}</p>
            </div>
        );
    }

    if (!character) {
        return (
             <div className="max-w-4xl mx-auto text-center p-8">
                <p>Loading character dossier...</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                        {character.name}
                    </h1>
                    <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-400">
                        {character.role}
                    </p>
                </div>

                <div className="space-y-8">
                    <Section title="Visual Description" icon={<DocumentTextIcon />}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            {Object.entries(character.visualDescription).map(([key, value]) => (
                                <Detail key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(value)} />
                            ))}
                        </div>
                    </Section>

                    <Section title="Personality Profile" icon={<UsersIcon />}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Virtues</p>
                                <TagList items={character.personality.virtues} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Fault Lines</p>
                                <TagList items={character.personality.faultLines} />
                            </div>
                        </div>
                    </Section>
                    
                    <Section title="Speech Patterns" icon={<ChatBubbleIcon />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <Detail label="Style" value={character.speechPatterns.style} />
                            <Detail label="Tone" value={character.speechPatterns.tone} />
                            <div className="md:col-span-2">
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Motifs</p>
                                <TagList items={character.speechPatterns.motifs} />
                            </div>
                        </div>
                    </Section>

                    <Section title="Sample Lines" icon={<MegaphoneIcon />}>
                        <div className="space-y-3">
                            {character.sampleLines.map((line: string, index: number) => (
                                <blockquote key={index} className="p-3 bg-black/5 dark:bg-white/5 border-l-4 border-blue-500/50 rounded-r-lg italic text-gray-700 dark:text-gray-300">
                                    "{line}"
                                </blockquote>
                            ))}
                        </div>
                    </Section>
                    
                    <Section title="Roleplay Hooks" icon={<LightBulbIcon />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {character.roleplayHooks.map((hook: {title: string; prompt: string}) => (
                                <div key={hook.title} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{hook.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{hook.prompt}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Image Prompt" icon={<CodeIcon />}>
                        <div className="p-4 font-mono text-xs bg-gray-900 text-gray-300 rounded-lg">
                            <code>{character.imagePrompt}</code>
                        </div>
                    </Section>
                    
                    <Section title="Meta" icon={<GridIcon />}>
                        <div className="space-y-4">
                             <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Archetypes</p>
                                <TagList items={character.meta.archetypes} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Themes</p>
                                <TagList items={character.meta.themes} />
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};
