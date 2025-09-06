import React from 'react';

interface SignatureBlockProps {
  variant: 'text' | 'video';
}

export const SignatureBlock: React.FC<SignatureBlockProps> = ({ variant }) => {
  if (variant === 'video') {
    return (
      <div className="font-sans text-sm leading-tight text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>
        <p className="m-0 p-0 font-bold">Gazi Pollob Hussain</p>
        <p className="m-0 p-0 text-xs">Symbiotic Strategist, AikoInfinity</p>
      </div>
    );
  }

  // Default is 'text' variant
  return (
    <div className="font-sans text-sm leading-normal text-gray-700 dark:text-gray-300 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
      <p className="m-0 p-0 font-bold text-gray-900 dark:text-gray-100">Gazi Pollob Hussain</p>
      <p className="m-0 p-0 text-xs text-gray-600 dark:text-gray-400">Symbiotic Strategist, AikoInfinity</p>
      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
        <span>#AIforGood</span>
        <span>#TechEthics</span>
      </div>
    </div>
  );
};
