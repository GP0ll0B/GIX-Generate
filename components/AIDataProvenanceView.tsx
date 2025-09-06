import React from 'react';
import { AI_DATA_PROVENANCE_DATA } from '../appData';
import { DocumentSearchIcon, CheckCircleIcon, UsersIcon, CubeIcon, HandshakeIcon, LockIcon, GridIcon } from './ui/icons';
import { RadialProgress } from './ui/RadialProgress';

// Helper to format keys from camelCase or gix:prefixed to Title Case
const formatKey = (key: string) => {
    const withoutPrefix = key.replace(/^(gix:|prov:|sec:)/, '');
    const result = withoutPrefix.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-blue-500/50 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </section>
);

const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <div className="text-gray-800 dark:text-gray-200">{children}</div>
    </div>
);

const TagList: React.FC<{ items: string[] }> = ({ items }) => (
    <div className="flex flex-wrap gap-2 mt-1">
        {items.map((item, index) => (
            <span key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs font-medium rounded-full">
                {formatKey(item)}
            </span>
        ))}
    </div>
);

const ComplianceCard: React.FC<{ assessment: any }> = ({ assessment }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center p-4 bg-black/5 dark:bg-white/5 rounded-lg text-center">
            <RadialProgress score={Math.round(assessment['gix:dignityScore'] * 100)} />
            <p className="mt-2 font-bold text-gray-700 dark:text-gray-300">Dignity Score</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-black/5 dark:bg-white/5 rounded-lg text-center">
            <RadialProgress score={Math.round(assessment['gix:mindfulnessScore'] * 100)} />
            <p className="mt-2 font-bold text-gray-700 dark:text-gray-300">Mindfulness Score</p>
        </div>
        <div className="sm:col-span-2 p-4 bg-yellow-500/10 dark:bg-yellow-900/20 rounded-lg">
            <p className="font-semibold text-yellow-800 dark:text-yellow-300">Violation Detected</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Type:</strong> {assessment['gix:violationDetected']['gix:violationType']}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Action:</strong> {assessment['gix:violationDetected']['gix:remedialAction']}
            </p>
        </div>
    </div>
);


export const AIDataProvenanceView: React.FC = () => {
    const data = AI_DATA_PROVENANCE_DATA.AIDataInteractionRecord as any;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
                        <DocumentSearchIcon />
                        AI Data Interaction Record
                    </h2>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
                        A structured, human-readable log detailing the provenance and ethical compliance of an AI interaction.
                    </p>
                </div>

                <div className="space-y-8">
                    <Section title="Human User" icon={<UsersIcon />}>
                        <Detail label="User Handle">{data['gix:humanUser']['gix:userHandle']}</Detail>
                        <Detail label="User Role">{data['gix:humanUser']['gix:userRole']}</Detail>
                    </Section>

                    <Section title="Project Details" icon={<GridIcon />}>
                         <Detail label="Project Name">{data['gix:projectDetails']['gix:projectName']}</Detail>
                         <Detail label="Project ID">{data['gix:projectDetails']['gix:projectId']}</Detail>
                         <Detail label="Project Number">{data['gix:projectDetails']['gix:projectNumber']}</Detail>
                    </Section>

                    <Section title="AI Model" icon={<CubeIcon />}>
                         <Detail label="Name">{data['gix:aiModel']['gix:name']}</Detail>
                         <Detail label="Version">{data['gix:aiModel']['gix:version']}</Detail>
                         <Detail label="Data Handling Policy">{data['gix:aiModel']['gix:dataHandlingPolicy']}</Detail>
                         <Detail label="Capabilities"><TagList items={data['gix:aiModel']['gix:capabilities']} /></Detail>
                    </Section>
                    
                     <Section title="Compliance Assessment" icon={<CheckCircleIcon />}>
                        <ComplianceCard assessment={data['gix:complianceAssessment']} />
                    </Section>

                     <Section title="Provenance" icon={<HandshakeIcon />}>
                        <Detail label="Start Time">{new Date(data['prov:wasGeneratedBy']['prov:startedAtTime']).toLocaleString()}</Detail>
                        <Detail label="End Time">{new Date(data['prov:wasGeneratedBy']['prov:endedAtTime']).toLocaleString()}</Detail>
                        <Detail label="Associated Agent">{data['prov:wasGeneratedBy']['prov:wasAssociatedWith']['prov:agent']}</Detail>
                        <Detail label="Agent Role">{data['prov:wasGeneratedBy']['prov:wasAssociatedWith']['prov:role']}</Detail>
                    </Section>
                    
                    <Section title="Security Proof" icon={<LockIcon />}>
                        <Detail label="Proof Purpose">{data['sec:proof']['sec:proofPurpose']}</Detail>
                        <Detail label="Proof Value">
                            <code className="text-xs p-2 bg-gray-200 dark:bg-gray-700 rounded-md block break-all">
                                {data['sec:proof']['sec:proofValue']}
                            </code>
                        </Detail>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default AIDataProvenanceView;