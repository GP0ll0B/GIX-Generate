
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { CheckCircleIcon, ErrorIcon, LockIcon } from './ui/icons';

// --- Helper Functions to Simulate Crypto Operations ---

const generateSimulatedKey = (length: number) => {
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

const generateSimulatedSignature = (message: string, privateKey: string): string => {
    // In a real app, this would be a complex hash and sign operation.
    // Here, we just combine hashes to simulate a unique signature.
    const messageHash = message.length * 31;
    const keyHash = privateKey.substring(0, 16).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `sig-${(messageHash + keyHash).toString(16)}-${generateSimulatedKey(32)}`;
};

// --- React Component ---

export const CryptoSimulator: React.FC = () => {
    const [privateKey, setPrivateKey] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [messageToSign, setMessageToSign] = useState('Hello, world!');
    const [signature, setSignature] = useState('');
    
    const [verificationMessage, setVerificationMessage] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'valid' | 'invalid'>('pending');

    const generateKeys = useCallback(() => {
        const newPrivateKey = `priv-${generateSimulatedKey(64)}`;
        const newPublicKey = `pub-${generateSimulatedKey(32)}`;
        setPrivateKey(newPrivateKey);
        setPublicKey(newPublicKey);
        setSignature('');
        setVerificationMessage('');
        setVerificationStatus('pending');
    }, []);

    useEffect(() => {
        generateKeys();
    }, [generateKeys]);
    
    const handleSignMessage = () => {
        if (!messageToSign || !privateKey) return;
        const newSignature = generateSimulatedSignature(messageToSign, privateKey);
        setSignature(newSignature);
        setVerificationMessage(messageToSign); // Auto-populate verification message
        setVerificationStatus('pending');
    };

    const handleVerifySignature = () => {
        // This is the core of the simulation logic
        const expectedSignature = generateSimulatedSignature(verificationMessage, privateKey);
        if (signature && signature === expectedSignature) {
            setVerificationStatus('valid');
        } else {
            setVerificationStatus('invalid');
        }
    };
    
    // Auto-update verification status when the message is tampered with
    useEffect(() => {
        if (verificationStatus !== 'pending') {
            handleVerifySignature();
        }
    }, [verificationMessage, signature, privateKey, verificationStatus]);


    const StatusBadge = () => {
        switch (verificationStatus) {
            case 'valid':
                return (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-700 dark:text-green-300 rounded-lg">
                        <CheckCircleIcon />
                        <span className="font-bold">SIGNATURE VALID</span>
                    </div>
                );
            case 'invalid':
                return (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-700 dark:text-red-300 rounded-lg">
                        <ErrorIcon />
                        <span className="font-bold">SIGNATURE INVALID</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 p-3 bg-gray-500/10 text-gray-700 dark:text-gray-300 rounded-lg">
                        <p className="font-bold">PENDING VERIFICATION</p>
                    </div>
                );
        }
    };

    const SimPanel: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-md border border-white/20 dark:border-white/10 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">{title}</h3>
            {children}
        </div>
    );
    
    const KeyDisplay: React.FC<{ label: string, value: string }> = ({ label, value }) => (
         <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</label>
            <textarea
                readOnly
                value={value}
                className="w-full h-24 p-2 font-mono text-xs bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md resize-none"
            />
        </div>
    );


    return (
        <div className="max-w-7xl mx-auto animate-fade-in-fast">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
                   <LockIcon /> Cryptographic Signature Simulator
                </h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                   An interactive demonstration of how digital signatures ensure data integrity.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- SIGNING PANEL --- */}
                <SimPanel title="1. Signer">
                     <Button onClick={generateKeys} variant="secondary" className="w-full">Generate New Keys</Button>
                     <KeyDisplay label="Private Key (Secret)" value={privateKey} />
                     <KeyDisplay label="Public Key (Shareable)" value={publicKey} />
                     <div>
                        <label htmlFor="message-to-sign" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Message to Sign</label>
                        <textarea
                            id="message-to-sign"
                            value={messageToSign}
                            onChange={(e) => { setMessageToSign(e.target.value); setVerificationStatus('pending'); }}
                            className="w-full p-2 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={3}
                        />
                    </div>
                    <Button onClick={handleSignMessage} disabled={!messageToSign}>Sign Message</Button>
                    <KeyDisplay label="Generated Signature" value={signature} />
                </SimPanel>
                
                {/* --- VERIFICATION PANEL --- */}
                 <SimPanel title="2. Verifier">
                    <KeyDisplay label="Public Key" value={publicKey} />
                    <div>
                        <label htmlFor="message-to-verify" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Message to Verify (Try editing this!)</label>
                        <textarea
                            id="message-to-verify"
                            value={verificationMessage}
                            onChange={(e) => setVerificationMessage(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={3}
                        />
                    </div>
                    <KeyDisplay label="Signature" value={signature} />
                    <Button onClick={handleVerifySignature} disabled={!signature}>Verify Signature</Button>
                    <div className="pt-2">
                        <StatusBadge />
                    </div>
                </SimPanel>
            </div>
        </div>
    );
};
