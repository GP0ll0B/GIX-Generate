

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKFLOW_JSON_DATA } from '../constants';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { PlayIcon, DocumentTextIcon, InfoIcon, ErrorIcon, SparklesIcon, CubeIcon, CheckCircleIcon, GridIcon, CopyIcon, CheckIcon, XIcon, WorkflowIcon } from './ui/icons';

/**
 * LogEntry defines the structure for a single log message in the simulation.
 */
interface LogEntry {
    id: number;
    type: string;
    message: string;
    details?: string[];
}

const iconMap: { [key: string]: React.ReactNode } = {
    'Versioning': <InfoIcon />,
    'Workflow': <WorkflowIcon className="h-4 w-4" />,
    'Workflow Step': <CubeIcon className="h-4 w-4" />,
    'App Validation': <CheckCircleIcon className="h-4 w-4" />,
    'Workflow Loop': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m-5.222 1.333a8.955 8.955 0 0115.555 0m-15.555 0a8.955 8.955 0 0015.555 0" />
        </svg>
    ),
    'Error': <ErrorIcon className="h-4 w-4" />,
};


/**
 * InfoModal provides an in-app guide explaining the simulator's features.
 */
const InfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-overlay-show backdrop-blur-md"
        onClick={onClose}
    >
        <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-white/10 text-gray-800 dark:text-gray-200"
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-xl font-bold flex items-center gap-2"><InfoIcon /> Simulator Guide</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400">
                    <XIcon />
                </button>
            </div>
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <section>
                    <h4 className="font-bold text-lg mb-2">Purpose</h4>
                    <p>This tool is designed to help you visualize, understand, and debug JSON-driven workflows. By providing a step-by-step simulation, it clarifies how a sequence of automated operations would execute based on a given JSON configuration.</p>
                </section>
                <section>
                    <h4 className="font-bold text-lg mb-2">Live JSON Editor</h4>
                    <p>The left panel is a fully interactive JSON editor. You can:</p>
                    <ul className="list-disc list-inside mt-2 pl-4 space-y-1 text-sm">
                        <li>Modify the values, add new properties, or even restructure the entire workflow.</li>
                        <li>Get real-time feedback on whether your JSON is valid. If there's an error, a message will appear to help you fix it.</li>
                        <li>Run the simulation with your custom JSON to see how your changes affect the outcome.</li>
                    </ul>
                </section>
                <section>
                    <h4 className="font-bold text-lg mb-2">Execution Log</h4>
                    <p>The right panel shows the execution log. When you run the simulation:</p>
                    <ul className="list-disc list-inside mt-2 pl-4 space-y-1 text-sm">
                        <li>Each step defined in the JSON is processed sequentially.</li>
                        <li>A new log entry appears for each step, indicating the type of operation and its details.</li>
                        <li>The currently executing step is highlighted with a subtle pulse animation, making it easy to follow the flow of logic.</li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
);

/**
 * Log displays a single, animated log entry in the simulation feed.
 * @param {object} props - The component props.
 * @param {LogEntry} props.entry - The log entry data.
 * @param {boolean} props.isActive - Whether this log entry is the currently active step.
 */
const Log: React.FC<{ entry: LogEntry, isActive: boolean }> = ({ entry, isActive }) => {
    const Icon = iconMap[entry.type] || <InfoIcon />;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 text-sm rounded-md p-1 -m-1 transition-colors ${isActive ? 'animate-pulse-bg' : ''}`}
        >
            <div className="w-4 h-4 mt-0.5 text-gray-400 dark:text-gray-500">{Icon}</div>
            <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-bold">[{entry.type}]</span> {entry.message}
                </p>
                {entry.details && entry.details.length > 0 && (
                    <div className="pl-4 mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                        {entry.details.map((detail, i) => <p key={i}>→ {detail}</p>)}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

/**
 * An interactive tool to visualize and debug JSON-driven workflows.
 * It features a live JSON editor with real-time validation and a step-by-step
 * animated simulation log.
 */
export const JsonWorkflowSimulator: React.FC = () => {
    const [jsonText, setJsonText] = useState(JSON.stringify(WORKFLOW_JSON_DATA, null, 2));
    const [isValidJson, setIsValidJson] = useState(true);
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [status, setStatus] = useState<'idle' | 'running' | 'finished' | 'error'>('idle');
    const [isCopied, setIsCopied] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [activeLogId, setActiveLogId] = useState<number | null>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);
    
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [])

    /**
     * Handles changes in the JSON editor, updating state and performing real-time validation.
     * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The textarea change event.
     */
    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setJsonText(newText);
        try {
            JSON.parse(newText);
            setIsValidJson(true);
            setJsonError(null);
            if (status === 'error') setStatus('idle');
        } catch (err) {
            setIsValidJson(false);
            setJsonError(err instanceof Error ? err.message.replace(/at position \d+/, '').trim() : 'Invalid JSON');
        }
    };

    /**
     * Runs the workflow simulation based on the content of the JSON editor.
     * It parses the JSON, then iterates through the workflow steps, adding animated logs.
     */
    const runSimulation = useCallback(async () => {
        if (!isValidJson) {
            setStatus('error');
            return;
        }

        setStatus('running');
        setLogs([]);
        setActiveLogId(null);
        
        let data;
        try {
            data = JSON.parse(jsonText);
        } catch (e) {
            setStatus('error');
            setJsonError(e instanceof Error ? e.message : 'Invalid JSON format.');
            return;
        }

        const addLog = (type: string, message: string, details: string[] = []) => {
            return new Promise<void>(resolve => {
                timeoutRef.current = setTimeout(() => {
                    const newLog = { id: Date.now() + Math.random(), type, message, details };
                    setLogs(prev => [...prev, newLog]);
                    setActiveLogId(newLog.id);
                    resolve();
                }, 250);
            });
        };
        
        // Step 1: Log Versioning Info
        if (data.versioning) {
            const versioning = data.versioning;
            await addLog('Versioning', `Workflow: ${versioning.workflowVersion || 'N/A'}, Schema: ${versioning.schemaVersion || 'N/A'}`, [
                `Author: ${versioning.author?.name || 'N/A'} (${versioning.author?.alias || 'N/A'})`,
                `Last Updated: ${versioning.lastUpdated ? new Date(versioning.lastUpdated).toLocaleString() : 'N/A'}`
            ]);
        } else {
            await addLog('Versioning', 'Versioning block missing in JSON.');
        }

        // Step 2: Traverse and Log the Workflow
        const workflow = data.AikoVenvWorkflow;
        if (workflow) {
            await addLog('Workflow', 'Starting AikoVenvWorkflow simulation...');
            
            let currentNodeKey = 'user'; // Starting point
            const visited = new Set();
            const MAX_STEPS = 50; // Safety break for potential cycles
            let stepCount = 0;

            while(currentNodeKey && !visited.has(currentNodeKey) && stepCount < MAX_STEPS) {
                const node = workflow[currentNodeKey];
                if (!node) {
                    await addLog('Error', `Node "${currentNodeKey}" not found in workflow definition.`);
                    break;
                }
                visited.add(currentNodeKey);
                stepCount++;

                const details = Object.entries(node)
                    .filter(([key]) => key !== 'next' && key !== 'loopBack' && key !== 'officialApps')
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`);

                await addLog('Workflow Step', `Processing Node: ${currentNodeKey}`, details);

                // Special handling for AppsValidationLayer
                if (currentNodeKey === 'AppsValidationLayer' && Array.isArray(node.officialApps)) {
                    for (const app of node.officialApps) {
                        await addLog('App Validation', `Validating ${app.name || 'Unknown App'}`, [
                            `Package: ${app.package || 'N/A'}`,
                            `Algorithm: ${app.algorithm || 'N/A'}`,
                            `Permissions: ${app.permissions?.length || 0} permissions checked.`
                        ]);
                    }
                }


                if (node.loopBack) {
                    await addLog('Workflow Loop', `Looping back from ${currentNodeKey} to ${node.loopBack.join(', ')}.`);
                    // To prevent infinite loop in this simple simulator, we'll stop here.
                    currentNodeKey = null; 
                } else if (node.next && node.next.length > 0) {
                    // For simulation, just follow the first path.
                    currentNodeKey = node.next[0];
                } else {
                    currentNodeKey = null; // End of path
                }
            }
             await addLog('Workflow', 'Simulation path finished.');
        } else {
             await addLog('Workflow', 'AikoVenvWorkflow block missing in JSON.');
        }
        
        setStatus('finished');
        setActiveLogId(null);
    }, [isValidJson, jsonText]);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden p-4 sm:p-6">
            <AnimatePresence>
                {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} />}
            </AnimatePresence>
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">JSON Text Workflow Simulator</h2>
                     <Button variant="secondary" onClick={() => setIsInfoModalOpen(true)} className="!py-2 !px-3">
                        <InfoIcon /> <span className="hidden sm:inline">Info</span>
                    </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Interactively edit, visualize, and debug JSON-driven logic in real-time.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* JSON Editor */}
                <div className="relative flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="json-editor" className="font-semibold text-sm text-gray-800 dark:text-gray-200">Live JSON Editor</label>
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 text-white"
                            aria-label="Copy JSON"
                        >
                            {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </button>
                    </div>
                    <textarea
                        id="json-editor"
                        value={jsonText}
                        onChange={handleJsonChange}
                        className={`text-xs font-mono bg-gray-900 text-gray-300 p-4 rounded-lg h-full flex-1 w-full min-h-[300px] lg:min-h-0 focus:outline-none focus:ring-2 resize-none ${isValidJson ? 'focus:ring-blue-500' : 'focus:ring-red-500 border-2 border-red-500/50'}`}
                        spellCheck="false"
                    />
                    <div className="text-xs h-5 mt-1 px-2">
                        {!isValidJson ? (
                            <p className="text-red-500 dark:text-red-400 font-semibold">{jsonError}</p>
                        ) : (
                            <p className="text-green-600 dark:text-green-400 font-semibold">✓ Valid JSON</p>
                        )}
                    </div>
                </div>

                {/* Simulation Log */}
                <div className="flex flex-col">
                    <div className="flex-1 bg-black/5 dark:bg-white/5 p-4 rounded-lg min-h-[400px] max-h-[70vh] overflow-y-auto" ref={logContainerRef}>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {logs.map(log => <Log key={log.id} entry={log} isActive={log.id === activeLogId} />)}
                            </AnimatePresence>
                             {status === 'idle' && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                                    <PlayIcon className="h-12 w-12" />
                                    <p className="mt-2 font-semibold">JSON Text Workflow Simulator</p>
                                    <p className="text-sm">Click "Run Simulation" to begin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                     <Button 
                        onClick={runSimulation} 
                        disabled={status === 'running' || !isValidJson} 
                        className="w-full mt-4"
                    >
                        {status === 'running' ? (
                            <Loader text="Simulating..." />
                        ) : (
                            <><PlayIcon className="h-5 w-5" /> {status === 'finished' ? 'Run Again' : 'Run Simulation'}</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};