import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { DocumentCheckIcon, InfoIcon, ErrorIcon, CheckCircleIcon, QuestionMarkCircleIcon } from './ui/icons';

type AdsTxtStatus = 'Not found' | 'Authorised' | 'Unauthorised' | 'Not applicable';
interface Result {
  status: AdsTxtStatus;
  message: string;
}

const getResultProps = (status: AdsTxtStatus) => {
    switch (status) {
        case 'Authorised':
            return { icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />, color: 'text-green-700 dark:text-green-300', bg: 'bg-green-500/10' };
        case 'Unauthorised':
            return { icon: <ErrorIcon className="h-8 w-8 text-red-500" />, color: 'text-red-700 dark:text-red-300', bg: 'bg-red-500/10' };
        case 'Not found':
            return { icon: <QuestionMarkCircleIcon className="h-8 w-8 text-yellow-500" />, color: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-500/10' };
        case 'Not applicable':
            return { icon: <InfoIcon className="h-8 w-8 text-blue-500" />, color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-500/10' };
        default:
            return { icon: <InfoIcon className="h-8 w-8 text-gray-500" />, color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-500/10' };
    }
}


export const AdsTxtStatusChecker: React.FC = () => {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState<Result | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleCheckStatus = () => {
        if (!domain.trim()) return;
        setStatus('loading');
        setResult(null);

        setTimeout(() => {
            const statuses: AdsTxtStatus[] = ['Not found', 'Authorised', 'Unauthorised', 'Not applicable'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const formattedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

            let message = '';
            switch (randomStatus) {
                case 'Not found':
                    message = `No ads.txt file was found when we last crawled http://${formattedDomain}.`;
                    break;
                case 'Authorised':
                    message = `Your publisher ID was found in http://${formattedDomain}/ads.txt. Your site is ready to show AdSense ads.`;
                    break;
                case 'Unauthorised':
                    message = `Your publisher ID was not found in http://${formattedDomain}/ads.txt. To prevent severe impact to your revenue, download your ads.txt file and upload it to your site.`;
                    break;
                case 'Not applicable':
                    message = `Your publisher ID isn't needed in the ads.txt file for http://${formattedDomain}.`;
                    break;
            }

            setResult({ status: randomStatus, message });
            setStatus('success');
        }, 1500);
    };
    
    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <DocumentCheckIcon />
                ads.txt Status
            </h3>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg border border-white/20 dark:border-white/10 p-4 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter your domain to check if your ads.txt file is set up correctly to authorize AdSense.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        className="w-full p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Button 
                        onClick={handleCheckStatus}
                        disabled={status === 'loading' || !domain.trim()}
                        className="flex-shrink-0"
                    >
                        {status === 'loading' ? <Loader text="Checking..." /> : 'Check Status'}
                    </Button>
                </div>
                <div className="min-h-[100px] flex items-center justify-center p-2">
                    {status === 'idle' && <p className="text-sm text-gray-500 dark:text-gray-400">Status will appear here.</p>}
                    {status === 'loading' && <Loader text="Analyzing domain..." />}
                    {status === 'success' && result && (
                        <div className={`w-full p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 animate-fade-in-fast ${getResultProps(result.status).bg}`}>
                           <div className="flex-shrink-0">{getResultProps(result.status).icon}</div>
                            <div>
                                <h4 className={`text-lg font-bold ${getResultProps(result.status).color}`}>{result.status}</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{result.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
