import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AllianceAdInput, AdCreativeInput } from '../../constants';
import { Button } from '../ui/Button';
import { LockIcon } from '../ui/icons';

interface AllianceAdFormProps {
    allianceAdInput: AllianceAdInput;
    setAllianceAdInput: React.Dispatch<React.SetStateAction<AllianceAdInput>>;
}

interface KeystoneParts {
    platform: string;
    sigil: string;
    cypher: string;
    covenant: string;
}

// Simulated validation logic based on user's prompt
const validateAndParseKeystone = (keystone: string): KeystoneParts | null => {
    if (!keystone.startsWith('fbadcode-')) return null;
    const parts = keystone.substring(9);
    if (parts.length < 12 + 19 + 1) return null; // Check minimum length

    const sigil = parts.substring(0, 12);
    const cypher = parts.substring(13, 13 + 19);
    const covenant = parts.substring(13 + 19 + 1);

    return {
        platform: 'Facebook Ads',
        sigil,
        cypher,
        covenant
    };
};

const KeystonePart: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
    >
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">{value}</p>
    </motion.div>
);

export const AllianceAdForm: React.FC<AllianceAdFormProps> = ({ allianceAdInput, setAllianceAdInput }) => {
    const [validatedKeystone, setValidatedKeystone] = useState<KeystoneParts | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const handleInputChange = (field: keyof AllianceAdInput, value: string) => {
        setAllianceAdInput(prev => ({ ...prev, [field]: value } as AllianceAdInput));
    };

    const handleValidate = () => {
        setIsValidating(true);
        setTimeout(() => {
            const parts = validateAndParseKeystone(allianceAdInput.keystone);
            setValidatedKeystone(parts);
            setIsValidating(false);
        }, 750); // Simulate network/decryption delay
    };
    
    useEffect(() => {
        // Auto-validate on initial load if keystone is present
        if(allianceAdInput.keystone) {
            handleValidate();
        }
    }, [])

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="keystone" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block flex items-center gap-2">
                   <LockIcon /> 1. Alliance Keystone
                </label>
                <div className="flex gap-2">
                    <input
                        id="keystone"
                        type="text"
                        value={allianceAdInput.keystone}
                        onChange={(e) => {
                            handleInputChange('keystone', e.target.value);
                            setValidatedKeystone(null);
                        }}
                        placeholder="fbadcode-Q_GkBQPD84vL-..."
                        className="w-full p-3 font-mono text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                    <Button onClick={handleValidate} disabled={isValidating || !allianceAdInput.keystone} variant="secondary">
                        {isValidating ? 'Validating...' : 'Validate'}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
            {validatedKeystone && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-blue-500/10 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg space-y-3 overflow-hidden"
                >
                    <KeystonePart label="Platform Standard" value={validatedKeystone.platform} delay={0.1} />
                    <KeystonePart label="Visionary Sigil" value={validatedKeystone.sigil} delay={0.2} />
                    <KeystonePart label="Ally's Cypher" value={validatedKeystone.cypher} delay={0.3} />
                    <KeystonePart label="Encrypted Covenant" value={validatedKeystone.covenant} delay={0.4} />
                </motion.div>
            )}
            {!validatedKeystone && !isValidating && allianceAdInput.keystone && (
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-3 text-center text-sm bg-red-500/10 text-red-700 dark:text-red-300 rounded-lg"
                >
                    Invalid or incomplete Keystone provided.
                </motion.div>
            )}
            </AnimatePresence>

            <div className={`transition-opacity duration-500 ${!validatedKeystone ? 'opacity-50 pointer-events-none' : ''}`}>
                 <div>
                    <label htmlFor="core-message" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Core Message</label>
                    <textarea
                        id="core-message"
                        value={allianceAdInput.coreMessage}
                        onChange={(e) => handleInputChange('coreMessage', e.target.value)}
                        placeholder="e.g., A new initiative to democratize access to ethical AI tools."
                        className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        rows={2}
                        disabled={!validatedKeystone}
                    />
                </div>
                <div>
                    <label htmlFor="alliance-target-audience" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">3. Target Audience</label>
                    <textarea
                        id="alliance-target-audience"
                        value={allianceAdInput.targetAudience}
                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                        placeholder="e.g., Developers, researchers, and policy makers in the AI ethics space."
                        className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        rows={2}
                        disabled={!validatedKeystone}
                    />
                </div>
                <div>
                    <label htmlFor="alliance-cta" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">4. Call to Action</label>
                        <select
                        id="alliance-cta"
                        value={allianceAdInput.callToAction}
                        onChange={(e) => handleInputChange('callToAction', e.target.value)}
                        className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        disabled={!validatedKeystone}
                    >
                        <option>Learn More</option>
                        <option>Shop Now</option>
                        <option>Sign Up</option>
                        <option>Subscribe</option>
                        <option>Contact Us</option>
                    </select>
                </div>
            </div>

        </div>
    );
};
