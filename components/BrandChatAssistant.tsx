import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { CopyIcon, CheckIcon, SendIcon, SparklesIcon } from './ui/icons';

interface BrandChatAssistantProps {
    context: string;
    setContext: (context: string) => void;
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    onNewChat: () => void;
    isLoading: boolean;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.author === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && (
                <div className="w-8 h-8 rounded-full bg-teal-500 dark:bg-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                   AI
                </div>
            )}
            <div className={`max-w-xl p-3 rounded-2xl shadow-sm whitespace-pre-wrap break-words ${isUser ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
             {isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                   U
                </div>
            )}
        </div>
    )
};


export const BrandChatAssistant: React.FC<BrandChatAssistantProps> = ({
    context, setContext, messages, onSendMessage, onNewChat, isLoading
}) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (currentMessage.trim()) {
            onSendMessage(currentMessage.trim());
            setCurrentMessage('');
        }
    };

    const handleCopy = () => {
        const transcript = messages.map(m => `${m.author === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
        navigator.clipboard.writeText(transcript);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Brand Chat Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chat with an AI aligned to your brand context.</p>
                <div className="mt-2 flex gap-2">
                    <Button onClick={onNewChat} variant="secondary" className="!py-1 !px-2 !text-xs">New Chat</Button>
                    <Button onClick={handleCopy} variant="secondary" className="!py-1 !px-2 !text-xs">
                        {isCopied ? <CheckIcon /> : <CopyIcon />} Copy Transcript
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                        <SparklesIcon />
                        <p className="mt-2 font-semibold">Start the conversation</p>
                        <p className="text-sm">Type your message below to begin.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => <ChatBubble key={index} message={msg} />)
                )}
                <div ref={messagesEndRef} />
            </div>
            {isLoading && <div className="p-4"><Loader text="Assistant is thinking..." /></div>}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                    <textarea
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                    />
                    <Button onClick={handleSend} disabled={isLoading || !currentMessage.trim()}>
                        <SendIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};
