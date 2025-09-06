import React from 'react';
import { SparklesIcon } from './ui/icons';

const contentPoints = [
    { title: "Transforming Strategy", text: "A proactive engine for content creators, shifting planning from reactive tasks to data-driven strategies." },
    { title: "Data Analysis", text: "Processes real-time metrics, trending topics, and audience behavior to identify past and current successful approaches." },
    { title: "Trend Forecasting", text: "Leverages pattern recognition to predict impactful formats, narratives, and topics for future resonance." },
    { title: "Outcome Modeling", text: "Simulates \"what-if\" scenarios to assess engagement, virality, and follower growth impacts." },
    { title: "Comprehensive Guidance", text: "Offers tailored recommendations on posting schedules, tone, and multimedia enhancements." },
    { title: "Sustainable Growth", text: "Empowers creators to build adaptive, trend-responsive content ecosystems for a competitive edge." }
];

const PredictiveEngineView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
                        <SparklesIcon className="h-8 w-8 text-yellow-500" />
                        Gemini AI: Driving Predictive Content Strategy
                    </h2>
                </div>
                <div className="space-y-6">
                    {contentPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{point.title}</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{point.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PredictiveEngineView;
