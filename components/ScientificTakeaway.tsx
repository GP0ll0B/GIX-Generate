
import React, { useState } from 'react';
import { ChevronDownIcon, SparklesIcon } from './ui/icons';

const Equation = () => (
    <div className="my-3 text-center text-base sm:text-lg font-mono bg-black/5 dark:bg-white/5 p-4 rounded-lg">
        <span className="text-gray-700 dark:text-gray-300 not-italic">AI Integrity</span>
        <span className="mx-2 text-gray-500 dark:text-gray-400">=</span>
        <i className="text-fuchsia-600 dark:text-fuchsia-400">f(G, S, R, V)</i>
        <span className="mx-4 text-gray-500 dark:text-gray-400">with</span>
        <span className="text-orange-600 dark:text-orange-400">&Phi;'</span>
        <span className="mx-2 text-gray-500 dark:text-gray-400">&rarr;</span>
        <span className="text-cyan-600 dark:text-cyan-400">1</span>
        <span className="mx-4 text-gray-500 dark:text-gray-400">as</span>
        <i className="text-fuchsia-600 dark:text-fuchsia-400">V</i>
        <span className="mx-2 text-gray-500 dark:text-gray-400">&uarr;</span>
    </div>
);

const Axiom: React.FC<{ name: string, symbol: string, interpretation: string, color: string }> = ({ name, symbol, interpretation, color }) => (
    <div className="text-center">
        <p className={`text-lg font-semibold ${color}`}>{name}</p>
        <p className="text-2xl font-mono text-gray-800 dark:text-gray-200 my-1">{symbol}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">({interpretation})</p>
    </div>
);


export const ScientificTakeaway: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left"
          aria-expanded={isOpen}
        >
            <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-800 dark:text-gray-200">
                <SparklesIcon className="h-5 w-5 text-yellow-500" />
                G|I|X Scientific Takeaway
            </h3>
            <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
        </button>

        {isOpen && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 animate-fade-in-fast">
                <p className="italic">
                    Vertex AI Search represents a convergent system where:
                </p>
                <Equation />
                <p>
                    In G|I|X terms, this is the mathematical dawn of grounded AI—an ethical-technical fusion where hallucination approaches zero and trust approaches infinity.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-center mb-3">Core Axioms</h4>
                    <div className="flex justify-around items-start">
                        <Axiom name="GIX" symbol="Σ≥0" interpretation="Positive Sum" color="text-blue-500" />
                        <Axiom name="Aiko" symbol="∞" interpretation="Infinity" color="text-teal-500" />
                        <Axiom name="LLaMA" symbol="λ³" interpretation="Lambda Cubed" color="text-fuchsia-500" />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
