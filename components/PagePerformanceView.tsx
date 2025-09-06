import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { PagePerformanceAnalysisData } from '../types';
import { useFacebook } from '../hooks/useFacebook';
import { PAGE_PERFORMANCE_DATA } from '../appData';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { ChartBarIcon, ErrorIcon, SparklesIcon, TrendingUpIcon, TrendingDownIcon, LightBulbIcon, UsersIcon, VideoCameraIcon, ChevronDownIcon, ExternalLinkIcon, TableIcon } from './ui/icons';

interface PagePerformanceViewProps {
    onAnalyze: () => void;
    isLoading: boolean;
    analysisResult: PagePerformanceAnalysisData | null;
    error: string | null;
}

const MetricCard: React.FC<{ title: string; value: string; trend: 'up' | 'down'; change: string; }> = ({ title, value, trend, change }) => (
    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-1">{value}</p>
        <div className={`flex items-center text-sm mt-1 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend === 'up' ? <TrendingUpIcon className="h-4 w-4" /> : <TrendingDownIcon className="h-4 w-4" />}
            <span className="ml-1 font-semibold">{change}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last 28 days (simulated)</span>
        </div>
    </div>
);

const DetailedDataView: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const chartData = PAGE_PERFORMANCE_DATA.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
        Impressions: day.impressions,
        Reach: day.reach,
        Views: day.views,
    }));
    
    return (
        <div className="bg-black/5 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left font-sans font-semibold text-gray-700 dark:text-gray-200"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2"><TableIcon /> Detailed Daily Data</span>
                <ChevronDownIcon className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-6 animate-fade-in-fast">
                    <div>
                        <h4 className="font-bold text-center mb-4">Daily Trends (28 Days)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                                        borderColor: '#4b5563',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="Impressions" stroke="#8884d8" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Reach" stroke="#82ca9d" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Views" stroke="#ffc658" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="p-2">Date</th>
                                    <th className="p-2 text-right">Impressions</th>
                                    <th className="p-2 text-right">Interactions</th>
                                    <th className="p-2 text-right">Follows</th>
                                    <th className="p-2 text-right">Reach</th>
                                    <th className="p-2 text-right">Views</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                                {PAGE_PERFORMANCE_DATA.map(day => (
                                    <tr key={day.date}>
                                        <td className="p-2">{day.date}</td>
                                        <td className="p-2 text-right font-mono">{day.impressions}</td>
                                        <td className="p-2 text-right font-mono">{day.interactions}</td>
                                        <td className="p-2 text-right font-mono">{day.net_follows}</td>
                                        <td className="p-2 text-right font-mono">{day.reach}</td>
                                        <td className="p-2 text-right font-mono">{day.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

const AnalysisResultDisplay: React.FC<{ result: PagePerformanceAnalysisData, totals: any }> = ({ result, totals }) => {
    return (
        <div className="space-y-6 animate-fade-in-fast">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Total Page Reach" value={totals.reach.toLocaleString()} trend="up" change="+12.5%" />
                <MetricCard title="Total Engagement" value={totals.engagement.toLocaleString()} trend="up" change="+8.2%" />
                <MetricCard title="Total Net Followers" value={`+${totals.followers_growth.toLocaleString()}`} trend="down" change="-2.1%" />
            </div>

            <DetailedDataView />

            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">AI Strategic Summary</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 p-4 bg-black/5 dark:bg-white/5 rounded-md">{result.strategic_summary}</p>
            </div>
             <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"><LightBulbIcon className="h-5 w-5 text-green-500" /> Actionable Recommendations</h3>
                <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-gray-700 dark:text-gray-300">
                    {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
            </div>
        </div>
    );
};

const PagePerformanceView: React.FC<PagePerformanceViewProps> = ({
    onAnalyze, isLoading, analysisResult, error
}) => {
    const { selectedPage, isLoggedIn } = useFacebook();
    
    const totals = useMemo(() => {
        return PAGE_PERFORMANCE_DATA.reduce((acc, day) => {
            acc.reach += day.reach;
            acc.engagement += day.interactions;
            acc.followers_growth += day.net_follows;
            return acc;
        }, { reach: 0, engagement: 0, followers_growth: 0 });
    }, []);
    
    if (!isLoggedIn) {
        return (
            <div className="text-center p-8 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                 <ErrorIcon className="h-12 w-12 mx-auto text-red-500" />
                 <h3 className="mt-4 font-semibold text-lg text-gray-800 dark:text-gray-200">Not Connected</h3>
                 <p className="mt-1 text-gray-600 dark:text-gray-400">Please connect to a Facebook Page via the "Publish" modal in another tool to use the analyzer.</p>
            </div>
        )
    }

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div>
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                        <ChartBarIcon /> Page Performance Analyzer
                    </h2>
                    {selectedPage && (
                        <div className="flex items-center gap-2 mt-2">
                             <img src={selectedPage.picture?.data?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedPage.name)}`} alt={selectedPage.name} className="w-6 h-6 rounded-full" />
                             <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing: <span className="font-semibold">{selectedPage.name}</span></p>
                        </div>
                    )}
                </div>
                <Button onClick={onAnalyze} disabled={isLoading} className="w-full sm:w-auto flex-shrink-0">
                    {isLoading ? <Loader text="Analyzing..." /> : "Analyze Page Performance"}
                </Button>
            </div>
            
             <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <Loader text="AI is analyzing your page data..." />
                    </div>
                ) : error && !analysisResult ? (
                     <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
                        <ErrorIcon className="h-12 w-12" />
                        <p className="mt-4 font-semibold">Analysis Failed</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                ) : analysisResult ? (
                    <AnalysisResultDisplay result={analysisResult} totals={totals} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center space-y-6">
                        <div className="flex flex-col items-center justify-center">
                            <SparklesIcon />
                            <p className="mt-4 font-semibold">Ready for your performance review?</p>
                            <p className="text-sm mt-1">Click "Analyze Page Performance" to get AI-driven insights based on the detailed data below.</p>
                        </div>
                        <DetailedDataView />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PagePerformanceView;
