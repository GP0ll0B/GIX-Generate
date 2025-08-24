



import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../constants';
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


const BrandChatAssistant: React.FC<BrandChatAssistantProps> = ({
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
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            {/* Context Editor */}
            <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                 <label htmlFor="brand-context" className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    Brand Persona & Context
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">Define the AI's personality, knowledge, and rules. Press "New Chat" to apply changes.</p>
                <textarea
                    id="brand-context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={4}
                    placeholder="e.g., You are a witty and slightly sarcastic assistant for a high-end gadget store..."
                />
            </div>

            {/* Chat Area */}
            <div className="p-4 sm:p-6 h-[50vh] overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                 <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <ChatBubble key={index} message={msg} />
                    ))}
                    {isLoading && messages[messages.length - 1]?.author === 'user' && (
                        <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-teal-500 dark:bg-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                AI
                            </div>
                            <div className="max-w-xl p-3 rounded-2xl shadow-sm bg-white dark:bg-gray-700">
                                <Loader text="Thinking..."/>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input and Controls */}
            <div className="p-4 sm:p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Ask your brand assistant anything..."
                        className="flex-grow p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !currentMessage.trim()} aria-label="Send message">
                        <SendIcon />
                    </Button>
                </div>
                 <div className="flex items-center justify-between mt-3">
                    <Button onClick={onNewChat} variant="secondary" className="!py-2 !text-sm">
                        New Chat
                    </Button>
                    <Button onClick={handleCopy} variant="secondary" className="!py-2 !text-sm" disabled={messages.length === 0}>
                        {isCopied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy Transcript</>}
                    </Button>
                 </div>
            </div>
        </div>
    );
};

export default BrandChatAssistant;