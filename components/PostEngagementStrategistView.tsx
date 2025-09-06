import React from 'react';
import { GeneratedContent } from '../types';
import { FacebookPost } from './FacebookPost';
import { ChatBubbleIcon, SparklesIcon, LightBulbIcon } from './ui/icons';

interface PostEngagementStrategistViewProps {
  post: Extract<GeneratedContent, { type: 'post_engagement_strategist' }>;
  onReview: () => void;
}

const getCommentIcon = (type: 'Positive' | 'Negative' | 'Question') => {
    switch (type) {
        case 'Positive': return <span role="img" aria-label="positive">👍</span>;
        case 'Negative': return <span role="img" aria-label="negative">👎</span>;
        case 'Question': return <span role="img" aria-label="question">❓</span>;
    }
}

export const PostEngagementStrategistView: React.FC<PostEngagementStrategistViewProps> = ({ post, onReview }) => {
    const { basePost, engagementStrategy } = post;
    const { simulatedComments, suggestedReplies, boostStrategy, followUpPostIdea } = engagementStrategy;
    
    return (
        <div className="space-y-6">
            <FacebookPost post={basePost} onReview={onReview} />

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
                <div className="p-4 sm:p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6 text-yellow-500" />
                        AI Engagement Strategy
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">A plan to maximize this post's impact after publishing.</p>
                </div>
                
                <div className="p-4 sm:p-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-6">
                    {/* Comments and Replies */}
                    <section>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2"><ChatBubbleIcon className="h-5 w-5" /> Simulated Comments & Suggested Replies</h3>
                        <div className="space-y-4">
                            {simulatedComments.map((comment, index) => {
                                const reply = suggestedReplies.find(r => r.type === comment.type);
                                return (
                                    <div key={index} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-0.5">{getCommentIcon(comment.type)}</span>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">@{comment.username}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{comment.comment}"</p>
                                            </div>
                                        </div>
                                        {reply && (
                                            <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex items-start gap-3">
                                                 <img src="https://api.dicebear.com/7.x/initials/svg?seed=GIX" alt="GIX" className="w-6 h-6 rounded-full flex-shrink-0" />
                                                 <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Suggested Reply:</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{reply.reply}</p>
                                                 </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                    
                    {/* Boost Strategy */}
                    <section>
                         <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">🚀 Automated Boost Plan</h3>
                         <div className="p-4 bg-blue-500/10 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-gray-800 dark:text-gray-200">{boostStrategy.recommendation}</p>
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2">{boostStrategy.simulatedOutcome}</p>
                         </div>
                    </section>

                    {/* Follow-up Idea */}
                    <section>
                         <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2"><LightBulbIcon className="h-5 w-5" /> Follow-up Post Idea</h3>
                         <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                             <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{followUpPostIdea}"</p>
                         </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
