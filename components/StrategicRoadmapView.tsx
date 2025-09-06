import React from 'react';
import { motion } from 'framer-motion';
import { STRATEGIC_ROADMAP_DATA } from '../appData';
import { TargetIcon, ErrorIcon, CheckCircleIcon, PlayIcon, ChartBarIcon, CubeIcon, UsersIcon, LightningBoltIcon, MegaphoneIcon, DocumentTextIcon, SparklesIcon, WorkflowIcon } from './ui/icons';

const MotionDiv = motion.div as any;

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-blue-500/50 flex items-center gap-3">
            {icon} {title}
        </h3>
        {children}
    </section>
);

const FixCard: React.FC<{ fix: { area: string, action: string, details: string } }> = ({ fix }) => {
    const areaIconMap: { [key: string]: React.ReactNode } = {
        'Messaging': <MegaphoneIcon className="h-5 w-5" />,
        'Content': <DocumentTextIcon className="h-5 w-5" />,
        'Engagement': <UsersIcon className="h-5 w-5" />,
        'Analytics': <ChartBarIcon className="h-5 w-5" />,
        'Engineering': <CubeIcon className="h-5 w-5" />,
        'Technology': <SparklesIcon className="h-5 w-5" />,
        'Operations': <WorkflowIcon className="h-5 w-5" />,
    };

    return (
        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                {areaIconMap[fix.area] || <CheckCircleIcon />} {fix.area}
            </p>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mt-1">{fix.action}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{fix.details}</p>
        </div>
    );
};

export const StrategicRoadmapView: React.FC = () => {
    const { strategicRoadmap } = STRATEGIC_ROADMAP_DATA;
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6 sm:p-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        AikoVenv Strategic Roadmap
                    </h2>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
                        A high-level overview of the mission, challenges, and plan for success.
                    </p>
                </div>

                <MotionDiv variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
                    <MotionDiv variants={itemVariants}>
                        <Section title="Core Mission" icon={<TargetIcon />}>
                            <div className="space-y-3">
                                <p className="font-semibold text-gray-700 dark:text-gray-300">{strategicRoadmap.coreMission.objective}</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 pl-2">
                                    {strategicRoadmap.coreMission.approach.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </Section>
                    </MotionDiv>
                    
                    <MotionDiv variants={itemVariants}>
                        <Section title="Key Challenges" icon={<ErrorIcon className="text-yellow-500" />}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {strategicRoadmap.keyChallenges.map((item, i) => (
                                    <div key={i} className="p-4 bg-yellow-500/10 dark:bg-yellow-900/20 rounded-lg">
                                        <h4 className="font-bold text-yellow-800 dark:text-yellow-300">{item.challenge}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </MotionDiv>
                    
                    <MotionDiv variants={itemVariants}>
                        <Section title="High-Impact Fixes" icon={<CheckCircleIcon className="text-green-500" />}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {strategicRoadmap.highImpactFixes.map((fix, i) => <FixCard key={i} fix={fix} />)}
                            </div>
                        </Section>
                    </MotionDiv>

                    <MotionDiv variants={itemVariants}>
                        <Section title="Immediate Next Steps" icon={<PlayIcon />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Content</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        {strategicRoadmap.immediateNextSteps.content.map((step, i) => <li key={i}>{step}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Engineering</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        {strategicRoadmap.immediateNextSteps.engineering.map((step, i) => <li key={i}>{step}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </Section>
                    </MotionDiv>

                    <MotionDiv variants={itemVariants}>
                        <Section title="Key Metrics for Success" icon={<ChartBarIcon />}>
                            <div className="flex flex-col sm:flex-row justify-around text-center gap-6">
                                {strategicRoadmap.keyMetricsForSuccess.map((metric, i) => (
                                    <div key={i}>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metric.target}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{metric.metric}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </MotionDiv>
                </MotionDiv>
            </div>
        </div>
    );
};