import React from 'react';

interface StellaSystemStatusProps {
    activeIntent: string;
}

const StatusIndicator: React.FC<{ status: 'ONLINE' | 'ACTIVE' | 'READY', children: React.ReactNode }> = ({ status, children }) => {
    const color = status === 'ONLINE' || status === 'ACTIVE' || status === 'READY' ? 'bg-green-500' : 'bg-gray-500';
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
            <span className="text-sm text-gray-700 dark:text-gray-300">{children}</span>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color}`}></div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{status}</span>
            </div>
        </div>
    );
};

const Metric: React.FC<{ label: string; value: string | React.ReactNode; unit?: string }> = ({ label, value, unit }) => (
    <div className="flex items-baseline justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
        <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
            {value}
            {unit && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
        </p>
    </div>
);

const IntentDisplay: React.FC<{ intent: string }> = ({ intent }) => (
     <div className="flex items-baseline justify-between py-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">Active Intent</span>
        <p className="font-mono text-sm text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 px-2 py-0.5 rounded">
            {intent}
        </p>
    </div>
);

export const StellaSystemStatus: React.FC<StellaSystemStatusProps> = ({ activeIntent }) => {
    const confidence = (Math.random() * (99.8 - 97.5) + 97.5).toFixed(2);
    const latency = (Math.random() * (95 - 70) + 70).toFixed(0);

    return (
        <div className="font-mono text-xs">
            <StatusIndicator status="ONLINE">ASR Model (es_US)</StatusIndicator>
            <StatusIndicator status="ONLINE">NLU Model</StatusIndicator>
            <StatusIndicator status="ACTIVE">Dialog Policy</StatusIndicator>
            <StatusIndicator status="READY">TTS Engine</StatusIndicator>
            <Metric label="Latency" value={latency} unit="ms" />
            <Metric label="Confidence" value={`${confidence}`} unit="%" />
            <IntentDisplay intent={activeIntent} />
        </div>
    );
};