import React from 'react';
import { PostType, SidebarNavGroup } from '../../types';
import { SIDEBAR_NAV_GROUPS } from '../../appData';

interface SidebarProps {
    activePostType: PostType;
    onSelect: (postType: PostType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePostType, onSelect }) => {
    return (
        <aside className="h-full bg-gray-100/50 dark:bg-gray-800/50 p-4 overflow-y-auto w-72 flex-shrink-0 border-r border-gray-200/50 dark:border-gray-700/50">
            <nav className="space-y-6">
                {SIDEBAR_NAV_GROUPS.map(group => (
                    <div key={group.title}>
                        <h3 className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                            {group.title}
                        </h3>
                        <ul className="mt-2 space-y-1">
                            {group.items.map(item => {
                                const Icon = item.icon;
                                const isActive = activePostType === item.id;
                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => onSelect(item.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                isActive
                                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60'
                                            }`}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            <Icon className="h-5 w-5 flex-shrink-0" />
                                            <span className="text-left">{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};