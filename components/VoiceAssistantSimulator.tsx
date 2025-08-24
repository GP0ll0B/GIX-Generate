import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, STELLA_LIVE_SYSTEM_INSTRUCTION, STELLA_NLU_SYSTEM_INSTRUCTION, STELLA_NLU_SCHEMA } from '../constants';
import { MicrophoneIcon } from './ui/icons';
import { StellaDiagnosticsPanel } from './StellaDiagnosticsPanel';

const MotionDiv = motion.div as any;

// Added 'initializing' and 'uninitialized' states for clarity
type AssistantState = 'uninitialized' | 'initializing' | 'idle' | 'listening' | 'thinking' | 'speaking' | 'error' | 'unsupported' | 'permission_denied';

const Orb: React.FC<{ state: AssistantState, onClick: () => void }> = ({ state, onClick }) => {
    const isListening = state === 'listening';
    const isSpeaking = state === 'speaking';
    const isThinking = state === 'thinking' || state === 'initializing';
    const hasError = state === 'error' || state === 'unsupported' || state === 'permission_denied';

    const orbColor = hasError ? 'bg-red-500' : isSpeaking ? 'bg-teal-500' : 'bg-blue-500';
    const isDisabled = state !== 'idle' && state !== 'error' && state !== 'uninitialized';

    return (
        <div className="relative flex items-center justify-center h-48 w-48">
             <MotionDiv
                className={`absolute rounded-full ${orbColor}`}
                animate={{
                    scale: isListening ? [1, 1.3, 1] : 1,
                    opacity: isThinking ? [0.7, 0.4, 0.7] : 0.1,
                }}
                transition={{
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ width: '100%', height: '100%' }}
            />
            <MotionDiv
                className={`absolute rounded-full ${orbColor} opacity-20`}
                animate={{
                     scale: isSpeaking ? [1, 1.2, 1] : 1,
                }}
                transition={{
                     scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ width: '80%', height: '80%' }}
            />
            <button
                onClick={onClick}
                className={`relative z-10 h-24 w-24 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${orbColor} shadow-lg hover:brightness-110 disabled:bg-gray-500 disabled:cursor-not-allowed`}
                disabled={isDisabled}
                aria-label="Activate voice assistant"
            >
                <MicrophoneIcon className="h-10 w-10" />
            </button>
        </div>
    );
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.author === 'user';
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}
        >
             {!isUser && (
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                   S
                </div>
            )}
            <div className={`max-w-xl p-3 rounded-2xl shadow-sm break-words ${isUser ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
             {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                   U
                </div>
            )}
        </MotionDiv>
    )
};


export const VoiceAssistantSimulator: React.FC = () => {
    const [state, setState] = useState<AssistantState>('uninitialized');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [activeIntent, setActiveIntent] = useState('intent://IDLE');
    
    const recognitionRef = useRef<any>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis || !text) {
            setState('idle');
            return;
        }
        
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setState('speaking');
        utterance.onend = () => setState('idle');
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setState('error');
        };
        window.speechSynthesis.speak(utterance);
    }, []);

    const processTranscript = useCallback(async (transcript: string) => {
        if (!aiRef.current) return;
        setState('thinking');
        setMessages(prev => [...prev, { author: 'user', content: transcript }]);
        setActiveIntent('intent://UNDERSTANDING');

        try {
            // 1. NLU Classification Call
            const nluResponse = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: transcript,
                config: {
                    systemInstruction: STELLA_NLU_SYSTEM_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: STELLA_NLU_SCHEMA,
                },
            });

            const parsedResponse = JSON.parse(nluResponse.text.trim());
            const intent = parsedResponse.intent || 'CONVERSATIONAL';
            setActiveIntent(`intent://${intent}`);

            let responseText = "";

            // 2. Formulate response based on intent
            switch (intent) {
                case 'SET_REMINDER':
                    const { task, time } = parsedResponse.entities;
                    responseText = `Okay, I've set a reminder for you to "${task || 'do something'}" at ${time || 'a specific time'}.`;
                    break;
                case 'GET_WEATHER':
                    const { location } = parsedResponse.entities;
                    responseText = `The weather in ${location} is currently sunny and 22 degrees Celsius.`;
                    break;
                case 'CONTROL_DEVICE':
                    const { device_name, device_state } = parsedResponse.entities;
                    responseText = `Sure, turning the ${device_name} ${device_state}.`;
                    break;
                case 'GET_SPORTS_SCORE': {
                    const team = parsedResponse.entities?.team_name;
                    if (team) {
                        const score1 = Math.floor(Math.random() * 20) + 100;
                        const score2 = Math.floor(Math.random() * 20) + 100;
                        const winner = Math.random() > 0.5;
                        if (winner) {
                            responseText = `In their most recent game, the ${team} won ${Math.max(score1, score2)} to ${Math.min(score1, score2)}.`;
                        } else {
                            responseText = `Unfortunately, the ${team} lost their last game ${Math.min(score1, score2)} to ${Math.max(score1, score2)}.`;
                        }
                    } else {
                        responseText = "I can get sports scores for you. Which team are you interested in?";
                    }
                    break;
                }
                case 'CONVERSATIONAL': {
                     if (!chatRef.current) {
                        chatRef.current = aiRef.current.chats.create({
                            model: 'gemini-2.5-flash',
                            config: { systemInstruction: STELLA_LIVE_SYSTEM_INSTRUCTION },
                        });
                    }
                    const chatResponse = await chatRef.current!.sendMessage({ message: transcript });
                    responseText = chatResponse.text;
                    break;
                }
                default:
                     responseText = "Sorry, I'm not sure how to help with that.";
            }

            setMessages(prev => [...prev, { author: 'model', content: responseText }]);
            speak(responseText);

        } catch (error) {
            console.error("NLU/Gemini Error:", error);
            const errorMessage = "Sorry, I had trouble understanding that.";
            setMessages(prev => [...prev, { author: 'model', content: errorMessage }]);
            setState('error');
            speak(errorMessage);
        }
    }, [speak]);
    
    const initializeAssistant = useCallback(async () => {
        setState('initializing');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition || !window.speechSynthesis) {
            setState('unsupported');
            return;
        }
        
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            if (permissionStatus.state === 'denied') {
                 setState('permission_denied');
                 return;
            }

            await navigator.mediaDevices.getUserMedia({ audio: true });
            
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = aiRef.current.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: STELLA_LIVE_SYSTEM_INSTRUCTION },
            });

            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = () => setState('listening');
            recognition.onresult = (event: any) => processTranscript(event.results[0][0].transcript);
            recognition.onend = () => setState(s => s === 'listening' ? 'idle' : s);
            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setState('error');
            };
            
            recognitionRef.current = recognition;
            setState('idle'); // Initialization complete, now ready to listen
        } catch (err) {
            console.error("Microphone access error:", err);
            setState('permission_denied');
        }
    }, [processTranscript]);
    
    const handleListen = useCallback(async () => {
        window.speechSynthesis.cancel();
        
        if (state === 'uninitialized') {
            initializeAssistant();
            return;
        }

        if (state === 'idle' || state === 'error') {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch(e) {
                    console.error("Error starting recognition:", e);
                    // This can happen if start() is called too soon after another session
                    // Resetting state allows the user to try again.
                    setState('idle');
                }
            } else {
                 // This case handles if initialization failed silently before but user tries again.
                initializeAssistant();
            }
        }
    }, [state, initializeAssistant]);

    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
            recognitionRef.current?.abort();
        };
    }, []);

    const getStatusMessage = () => {
        switch (state) {
            case 'uninitialized': return "Tap the orb to initialize the assistant and grant microphone access.";
            case 'initializing': return "Initializing assistant... Please allow microphone access.";
            case 'listening': return "Listening...";
            case 'thinking': return "Thinking...";
            case 'speaking': return "Speaking...";
            case 'unsupported': return "Voice features are not supported by your browser.";
            case 'permission_denied': return "Microphone access is required. Please enable it in your browser settings and reload.";
            case 'error': return "An error occurred. Tap to try again.";
            default: return "Assistant is ready. Tap the orb to speak.";
        }
    };
    
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Stella AI Assistant</h2>
                 <p className={`mt-2 text-sm min-h-[2.5rem] flex items-center justify-center ${state === 'error' || state === 'permission_denied' || state === 'unsupported' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                    {getStatusMessage()}
                </p>
            </div>

            <div className="h-[45vh] overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Conversation will appear here.
                    </div>
                )}
                {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center justify-center p-4 border-y border-gray-200/50 dark:border-gray-700/50">
                <Orb state={state} onClick={handleListen} />
            </div>
            
            <StellaDiagnosticsPanel activeIntent={activeIntent} />
        </div>
    );
};