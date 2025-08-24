import React, { useState } from "react";
import { motion } from "framer-motion";
import { UseCase, USE_CASES, PRIMARY_AVATAR_URL } from '../constants';

const MotionDiv = motion.div;

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

  const fallbackAvatarUrl = "https://api.dicebear.com/7.x/initials/svg?seed=GPH";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 animate-fade-in-fast">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">

        {/* Header / Hero */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <MotionDiv initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <img 
              src={PRIMARY_AVATAR_URL}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== fallbackAvatarUrl) {
                  target.onerror = null; // prevent looping
                  target.src = fallbackAvatarUrl;
                }
              }}
              alt="Gazi Pollob Hussain" 
              className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-700 mx-auto md:mx-0" 
            />
            <h1 className="text-4xl font-extrabold text-teal-800 dark:text-teal-300">Gazi Pollob Hussain</h1>
            <p className="text-lg text-gray-700 dark:text-gray-400 italic">Founder & Visionary — AikoInfinity</p>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl">Architect of symbiotic intelligence. Champion of ethical, open, and sustainable AI that amplifies human potential.</p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
                <button 
                    className="px-5 py-2.5 bg-teal-700 text-white rounded-lg shadow-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-900 font-semibold transition-all" 
                    onClick={onNavigateToSelection}
                >
                    G|I|X Generate
                </button>
                <a 
                    className="px-4 py-2 border border-teal-700 text-teal-700 dark:border-teal-500 dark:text-teal-400 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/50" 
                    href="#pillars"
                >
                    Explore Pillars
                </a>
                <button 
                    className="px-4 py-2 border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50" 
                    onClick={() => { 
                        navigator.clipboard?.writeText(window.location.href);
                        showToast('Page URL copied to clipboard!', 'success');
                    }}
                >
                    Share Page
                </button>
            </div>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="flex justify-center items-center">
            <iframe
              src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Fg.pollob.2025%2Fvideos%2F895770499585315%2F&show_text=true&width=267&t=0"
              width="267"
              height="591"
              style={{ border: 'none', overflow: 'hidden' }}
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
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