import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UseCase, FilterCategory } from '../../types';
import { USE_CASES } from '../../appData';
import { UseCaseCard } from '../ui/UseCaseCard';
import { 
    DocumentTextIcon, MegaphoneIcon, VideoCameraIcon, 
    LightBulbIcon, FileJsonIcon, ChartBarIcon, SparklesIcon,
    GridIcon, CubeIcon, WorkflowIcon, ChatBubbleIcon, UsersIcon, BuildingStorefrontIcon, LockIcon, MicrophoneIcon, HandshakeIcon, LightningBoltIcon, DocumentDollarIcon, DocumentSearchIcon, QuestionMarkCircleIcon, DocumentCheckIcon 
} from '../ui/icons';

const MotionDiv = motion.div as any;

interface UseCaseSelectionProps {
    onSelectUseCase: (useCase: UseCase) => void;
}

const getIconForUseCase = (id: string): React.ReactNode => {
    if (id.includes('text') || id.includes('fact-checked') || id.includes('analysis')) return <DocumentTextIcon />;
    if (id.includes('ad') && !id.includes('alliance')) return <MegaphoneIcon />;
    if (id.includes('alliance')) return <HandshakeIcon />;
    if (id.includes('guided')) return <MegaphoneIcon />;
    if (id.includes('video')) return <VideoCameraIcon />;
    if (id.includes('image')) return <LightBulbIcon />;
    if (id.includes('strategy')) return <FileJsonIcon />;
    if (id.includes('gantt')) return <ChartBarIcon />;
    if (id.includes('all-tools')) return <GridIcon />;
    if (id.includes('math-equation')) return <CubeIcon />;
    if (id.includes('json-workflow')) return <WorkflowIcon />;
    if (id.includes('stella')) return <MicrophoneIcon />;
    if (id.includes('chat') || id.includes('dialog')) return <ChatBubbleIcon />;
    if (id.includes('comment') || id.includes('dashboard')) return <UsersIcon />;
    if (id.includes('google-business')) return <BuildingStorefrontIcon />;
    if (id.includes('amp-prototype')) return <LightningBoltIcon />;
    if (id.includes('monetized-campaign')) return <DocumentDollarIcon />;
    if (id.includes('crypto')) return <LockIcon />;
    if (id.includes('ai-data-provenance')) return <DocumentSearchIcon />;
    if (id.includes('ethical-protocol')) return <DocumentCheckIcon />;
    if (id.includes('predictive-engine')) return <SparklesIcon className="h-6 w-6" />;
    return <DocumentTextIcon />;
};

const filterOptions: { label: string; value: FilterCategory }[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'All', value: 'all' },
    { label: 'Content', value: 'content' },
    { label: 'Ads & Monetization', value: 'ads' },
    { label: 'Messaging & Analysis', value: 'messaging' },
    { label: 'Other Tools', value: 'other' },
];

export const UseCaseSelection: React.FC<UseCaseSelectionProps> = ({ onSelectUseCase }) => {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('featured');

    const filteredUseCases = activeFilter === 'all'
        ? USE_CASES
        : USE_CASES.filter(uc => uc.categories.includes(activeFilter));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    What would you like to create?
                </h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Select a tool to start generating content with the G|I|X AI Engine.
                </p>
            </div>
            <div className="flex justify-center flex-wrap gap-2 mb-8">
                {filterOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setActiveFilter(option.value)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 ${activeFilter === option.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <MotionDiv
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredUseCases.map(useCase => (
                    <MotionDiv key={useCase.id} variants={cardVariants}>
                        <UseCaseCard
                            useCase={useCase}
                            onSelect={() => onSelectUseCase(useCase)}
                            icon={getIconForUseCase(useCase.id)}
                        />
                    </MotionDiv>
                ))}
            </MotionDiv>
        </div>
    );
};