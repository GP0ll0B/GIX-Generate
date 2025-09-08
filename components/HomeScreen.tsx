import React, { useState } from "react";
import { motion } from "framer-motion";
import { UseCase } from '../types';
import { USE_CASES } from '../appData';
import { PRIMARY_AVATAR_URL } from '../constants';

const MotionDiv = motion.div as any;

// Props for the HomeScreen component
interface HomeScreenProps {
  onSelectUseCase: (useCase: UseCase) => void;
  onNavigateToSelection: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const PILLARS = [
  {
    id: "ethics",
    title: "Ethical AI — Conscience",
    color: "from-teal-600 to-emerald-400",
    desc:
      "Our Conscience Layer ensures fairness, privacy, and accountability are inseparable from intelligence itself, building the trust necessary for symbiosis.",
    targetUseCaseId: 'fact-checked-post',
  },
  {
    id: "openness",
    title: "Open Knowledge — Circulation",
    color: "from-cyan-600 to-teal-400",
    desc:
      "Fostering a living partnership between humanity and technology. Open collaboration accelerates discovery, improves energy efficiency, and ensures the tools of intelligence belong to everyone.",
    targetUseCaseId: 'text-post',
  },
  {
    id: "sustainability",
    title: "Sustainable Ecosystem — Environment",
    color: "from-emerald-600 to-lime-400",
    desc:
      "Energy-efficient intelligence, responsible data practices, and inclusive prosperity for the long term.",
    targetUseCaseId: 'image-post',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectUseCase, onNavigateToSelection, showToast }) => {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  const handleCreatePost = (useCaseId: string) => {
    const selectedUseCase = USE_CASES.find(uc => uc.id === useCaseId);
    if (selectedUseCase) {
      onSelectUseCase(selectedUseCase);
    } else {
      // Fallback to a default use case if not found
      const defaultUseCase = USE_CASES.find(uc => uc.id === 'text-post');
      if (defaultUseCase) onSelectUseCase(defaultUseCase);
    }
  };

  const pillVariants = {
    hidden: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 animate-fade-in-fast">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">

        {/* Header / Hero */}
        <div className="grid md:grid-cols-1 gap-8 items-center">
          <MotionDiv initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
             <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-gray-100">GIX.AI</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto">Forging Ethical AI: A Symbiotic Future</p>
            <div className="flex flex-wrap items-center gap-3 mt-4 justify-center">
                <a 
                    href="https://gix-ai.blogspot.com/#partnership"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-teal-700 text-white rounded-lg shadow-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-900 font-semibold transition-all"
                >
                    Contact Us
                </a>
                <button 
                    className="px-4 py-2 border border-teal-700 text-teal-700 dark:border-teal-500 dark:text-teal-400 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/50" 
                    onClick={onNavigateToSelection}
                >
                    Launch G|I|X Generate
                </button>
            </div>
          </MotionDiv>
        </div>

        {/* Pillars interactive */}
        <MotionDiv id="pillars" variants={pillVariants} initial="hidden" animate="enter" className="mt-16 grid md:grid-cols-3 gap-6">
          {PILLARS.map((p) => (
            <MotionDiv key={p.id} variants={pillVariants} whileHover={{ scale: 1.02 }} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 dark:border-white/10 hover:shadow-xl cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-br ${p.color} flex-shrink-0`}>{p.id.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{p.title}</h4>
                    <button className="text-sm text-teal-600 dark:text-teal-400" onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}>{activePillar === p.id ? 'Close' : 'Explore'}</button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{p.desc}</p>
                </div>
              </div>

              {activePillar === p.id && (
                <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                  <h5 className="font-semibold">What we do</h5>
                  <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-400">
                    <li>Embed values into model architectures and evaluation.</li>
                    <li>Publish open frameworks, datasets, and standards.</li>
                    <li>Optimize models for energy efficiency and responsible data usage.</li>
                  </ul>
                  <div className="mt-4 flex gap-3">
                    <button className="px-3 py-1 bg-teal-600 text-white rounded" onClick={() => handleCreatePost(p.targetUseCaseId)}>Create Post</button>
                    <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded" onClick={()=>setActivePillar(null)}>Done</button>
                  </div>
                </MotionDiv>
              )}
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </div>
  );
}