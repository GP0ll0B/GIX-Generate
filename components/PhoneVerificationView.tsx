import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { PhoneIcon, CheckCircleIcon, ErrorIcon } from './ui/icons';

const MotionDiv = motion.div as any;

type VerificationStep = 'enter_phone' | 'sending_code' | 'enter_code' | 'verifying' | 'verified';

const PhoneVerificationView: React.FC = () => {
    const [step, setStep] = useState<VerificationStep>('enter_phone');
    const [phoneNumber, setPhoneNumber] = useState('+1 ');
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState<string | null>(null);
    const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (step === 'enter_code') {
            codeInputsRef.current[0]?.focus();
        }
    }, [step]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.startsWith('+1 ')) {
            const numericValue = value.substring(3).replace(/\D/g, '');
            let formatted = '+1 ';
            if (numericValue.length > 0) {
                formatted += `(${numericValue.substring(0, 3)}`;
            }
            if (numericValue.length > 3) {
                formatted += `) ${numericValue.substring(3, 6)}`;
            }
            if (numericValue.length > 6) {
                formatted += `-${numericValue.substring(6, 10)}`;
            }
            setPhoneNumber(formatted);
        } else {
            setPhoneNumber(value);
        }
    };

    const handleSendCode = () => {
        setError(null);
        if (phoneNumber.replace(/\D/g, '').length < 11) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setStep('sending_code');
        setTimeout(() => {
            setStep('enter_code');
        }, 1500);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newCode = [...code];
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === '') {
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                codeInputsRef.current[index + 1]?.focus();
            }
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            codeInputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerifyCode = () => {
        setError(null);
        const enteredCode = code.join('');
        if (enteredCode.length < 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }
        setStep('verifying');
        setTimeout(() => {
            if (enteredCode === '123456') {
                setStep('verified');
            } else {
                setError('The code you entered is incorrect. Please try again.');
                setStep('enter_code');
                setCode(Array(6).fill(''));
                codeInputsRef.current[0]?.focus();
            }
        }, 1500);
    };

    const handleReset = () => {
        setStep('enter_phone');
        setPhoneNumber('+1 ');
        setCode(Array(6).fill(''));
        setError(null);
    };
    
    const renderStep = () => {
        switch(step) {
            case 'verified':
                return (
                    <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Verification Successful!</h3>
                        <p className="text-gray-600 dark:text-gray-400">The phone number {phoneNumber} has been successfully linked to your ad account.</p>
                        <Button onClick={handleReset}>Verify Another Number</Button>
                    </MotionDiv>
                );
            default:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="phone-number" className="font-semibold text-gray-800 dark:text-gray-200">Phone Number</label>
                            <input 
                                id="phone-number"
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="+1 (555) 555-5555"
                                className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                disabled={step !== 'enter_phone'}
                            />
                        </div>

                        <AnimatePresence>
                        {(step === 'enter_code' || step === 'verifying') && (
                            <MotionDiv 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-2"
                            >
                                <label className="font-semibold text-gray-800 dark:text-gray-200">Verification Code</label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Enter the 6-digit code sent to your phone. (Hint: it's 123456)</p>
                                <div className="flex justify-center gap-2" onPaste={(e) => {
                                    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').substring(0,6);
                                    if(pasted) setCode(pasted.split(''));
                                }}>
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => { codeInputsRef.current[index] = el; }}
                                            type="tel"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-12 h-14 text-center text-2xl font-bold border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            disabled={step !== 'enter_code'}
                                        />
                                    ))}
                                </div>
                            </MotionDiv>
                        )}
                        </AnimatePresence>

                        {error && (
                             <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-700 dark:text-red-300 rounded-lg text-sm">
                                <ErrorIcon />
                                <span>{error}</span>
                            </div>
                        )}

                        {step === 'enter_phone' && <Button onClick={handleSendCode} className="w-full">Send Code</Button>}
                        {step === 'sending_code' && <Button disabled className="w-full"><Loader text="Sending Code..." /></Button>}
                        {step === 'enter_code' && <Button onClick={handleVerifyCode} className="w-full">Verify</Button>}
                        {step === 'verifying' && <Button disabled className="w-full"><Loader text="Verifying..." /></Button>}
                    </div>
                );
        }
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden max-w-lg mx-auto p-6 sm:p-8">
            <div className="text-center mb-6">
                <PhoneIcon className="h-12 w-12 text-blue-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">Verify Your Phone Number</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    To run ads, we need to confirm your phone number. This helps keep our platform secure.
                </p>
            </div>
            {renderStep()}
        </div>
    );
};

export default PhoneVerificationView;