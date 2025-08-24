import React from 'react';
import { PRIMARY_AVATAR_URL } from '../constants';

interface PostHeaderProps {
  variant?: 'default' | 'video';
}

export const PostHeader: React.FC<PostHeaderProps> = ({ variant = 'default' }) => {
    const isVideo = variant === 'video';
    const userName = "Gazi Pollob Hussain";

    const fallbackAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=008080,009688,4caf50&backgroundType=gradient`;

    return (
        <div className={isVideo ? "flex items-center" : "flex items-center mb-4"}>
            <img
                src={PRIMARY_AVATAR_URL}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== fallbackAvatarUrl) {
                      target.onerror = null; // prevent looping
                      target.src = fallbackAvatarUrl;
                    }
                }}
                alt={userName}
                className={`w-10 h-10 rounded-full mr-3 object-cover ${isVideo ? 'border-2 border-white/50' : ''}`}
            />
            <div>
                <p className={isVideo ? "font-bold text-white" : "font-bold text-gray-800 dark:text-gray-100"}>{userName}</p>
                <p className={isVideo ? "text-xs text-gray-200" : "text-xs text-gray-500 dark:text-gray-400"}>GIX · Science & Tech · Just now · 🌐</p>
            </div>
        </div>
    );
};