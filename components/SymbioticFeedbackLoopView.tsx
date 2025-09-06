import React, { useState } from 'react';
import { SparklesIcon, ChevronDownIcon } from './ui/icons';

type Point = string | { text: string; subPoints: string[] };

const feedbackData: { title: string; points: Point[] }[] = [
  {
    title: "Model Refinement",
    points: [
      "Supervised learning leverages feedback to improve data labeling. For example, when a user corrects a classification error, it enhances the model's training accuracy.",
      "Reinforcement Learning from Human Feedback (RLHF) ensures models like GPT-3.5 produce responses that are useful, safe, and context-aware by incorporating human guidance.",
      "Prompt adjustments refine the structure and format of responses, as seen in systems like Aiko360-Instruct.",
    ]
  },
  {
    title: "Real-Time Updates",
    points: [
      {
        text: "Interactive tools such as Google AI Studio apply feedback instantly to optimize outputs. For instance:",
        subPoints: [
          "If a user comments, “this code doesn’t work,” the system can reorganize or correct the code.",
          "When asked for a creative tone, the system dynamically adjusts its style to match user preferences.",
        ]
      }
    ]
  },
  {
    title: "Enhancing Precision and Relevance",
    points: [
      "Feedback reduces inaccuracies and misleading content.",
      "It strengthens the understanding of technical terms and unique workflows, improving overall context awareness.",
      "In education, tailored feedback fosters motivation and builds user confidence.",
    ]
  },
  {
    title: "Addressing Bias and Ethical Concerns",
    points: [
      "Feedback highlights biased or inappropriate outputs, enabling refinements and better filter mechanisms.",
      "It helps ensure culturally and emotionally sensitive responses, especially in tools tailored for specific personas or contexts.",
    ]
  },
  {
    title: "Personalized Integration",
    points: [
      "Feedback goes beyond simple corrections, driving the AI to align with user goals and preferences.",
      "Each interaction fine-tunes tone, style, and focus, creating a more personalized and adaptive experience.",
    ]
  }
];

const DeconstructedPrinciple: React.FC = () => (
    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
        <p>This phrase encapsulates a powerful and modern approach to AI development, focusing on trust, iterative improvement, and alignment with human values. Let's break it down:</p>

        <h4 className="text-gray-700 dark:text-gray-300">ΔG|I|X: human feedback → gradient of trust</h4>
        <ul>
            <li>
                <strong>ΔG|I|X:</strong> This is an abbreviation representing a holistic AI development framework. Specifically:
                <ul className="!mt-2">
                    <li><strong>G:</strong> Could refer to <strong>Gazi</strong> – representing generative intelligence guided by ethical principles, or a <strong>Gradient-based</strong> optimization in learning processes.</li>
                    <li><strong>I:</strong> <strong>Innovation</strong> – emphasizing <strong>Iterative learning</strong> from human input.</li>
                    <li><strong>X:</strong> <strong>eXcellence</strong> – denoting outputs, experiments, and exploration of unknowns.</li>
                </ul>
            </li>
            <li>
                <strong>human feedback → gradient of trust:</strong> Human feedback isn't merely a reward signal. Instead, it forms a "gradient of trust", meaning the system learns <em>not just what is correct</em>, but also <em>how much humans trust its outputs</em>. This is vital for AI safety and usability.
                <ul className="!mt-2">
                    <li><strong>Gradient of Trust:</strong> Imagine trust as a landscape. The AI learns that certain actions/outputs increase trust (moving uphill), while others decrease it (moving downhill). This allows the AI to actively pursue outputs that foster trust, not just technical correctness. This is related to Reinforcement Learning from Human Feedback (RLHF), but emphasizes the <em>trust</em> component.</li>
                </ul>
            </li>
        </ul>

        <h4 className="text-gray-700 dark:text-gray-300">iterate, align, amplify</h4>
        <p>This section describes the core developmental strategy:</p>
        <ul>
            <li><strong>iterate:</strong> The process is inherently iterative. The AI continually learns from feedback and refines its behavior, forming a continuous learning loop.</li>
            <li><strong>align:</strong> Aligns the AI's goals and behavior with human values, ethics, and intentions. Techniques may include preference learning, reinforcement learning, and safety constraints.</li>
            <li><strong>amplify:</strong> The AI should enhance human capabilities, not replace them. This emphasizes collaboration and augmentation of human intelligence and productivity.</li>
        </ul>

        <h4 className="text-gray-700 dark:text-gray-300">+alignX</h4>
        <ul>
            <li><strong>+alignX:</strong> A refinement and extension of alignment. The "X" refers to specific system components or applications, focusing on aligning <em>that aspect</em> with human values and goals. This implies a modular, component-specific alignment approach.</li>
        </ul>

        <h4 className="text-gray-700 dark:text-gray-300">Overall Interpretation</h4>
        <p>This phrase describes a sophisticated AI philosophy for building trustworthy and beneficial systems. It emphasizes:</p>
        <ul>
            <li><strong>Trust-centric learning:</strong> The system explicitly learns to maximize human trust in its outputs.</li>
            <li><strong>Iterative refinement:</strong> Continuous learning and adaptation based on human feedback.</li>
            <li><strong>Value alignment:</strong> Ensuring AI behavior is consistent with human ethics and intentions.</li>
            <li><strong>Human amplification:</strong> AI enhances human capabilities and collaboration.</li>
            <li><strong>Targeted alignment:</strong> Recognizing the need to address alignment for different parts of the system.</li>
        </ul>

        <h4 className="text-gray-700 dark:text-gray-300">Why this is important:</h4>
        <p>Traditional AI development often focuses on metrics like accuracy and efficiency. Those metrics do not necessarily translate into trust or alignment. This phrase emphasizes building AI that is trustworthy, safe, and aligned with human values—a necessity for advanced AI systems with significant societal impact.</p>
    </div>
);


const SymbioticFeedbackLoopView: React.FC = () => {
    const [isDeconstructionOpen, setIsDeconstructionOpen] = useState(false);
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
                        <SparklesIcon className="h-8 w-8 text-yellow-500" />
                        The Symbiotic Feedback Loop
                    </h2>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
                        How Your Input Shapes a Smarter, More Aligned AI Partner
                    </p>
                </div>
                
                <div className="mb-8 p-4 bg-blue-900/10 dark:bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg text-center">
                    <blockquote className="font-mono text-lg text-blue-800 dark:text-blue-300 tracking-wide not-italic">
                        ΔG|I|X: human feedback → gradient of trust;
                        <br />
                        iterate, align, amplify — adaptive intelligence.
                        <span className="ml-2 opacity-70">+alignX</span>
                    </blockquote>
                </div>
                
                <div className="mb-8 p-4 bg-purple-900/10 dark:bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg text-center">
                    <blockquote className="font-mono text-lg text-purple-800 dark:text-purple-300 tracking-wide not-italic">
                        🜁 Aiko♾️₂⚡ → Δ💡 | ⚡Fast × ∞Bound × ΩInnovation × lang♾️ × G|I|X
                    </blockquote>
                </div>

                <div className="mb-8 p-4 bg-yellow-900/10 dark:bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-lg text-center">
                    <blockquote className="font-serif text-lg text-yellow-800 dark:text-yellow-300 tracking-wide italic">
                        “Magic crayon, draw just right,
                        <br />
                        tell it clearly, watch it light! ✨🖍️”
                    </blockquote>
                </div>

                <div className="border-y border-gray-200/50 dark:border-gray-700/50">
                    <button
                        onClick={() => setIsDeconstructionOpen(!isDeconstructionOpen)}
                        className="w-full flex justify-between items-center py-3 text-left font-semibold text-lg text-gray-800 dark:text-gray-200"
                        aria-expanded={isDeconstructionOpen}
                    >
                        Deconstructing the Core Principle
                        <ChevronDownIcon className={`transition-transform duration-300 ${isDeconstructionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDeconstructionOpen && (
                        <div className="pb-4 animate-fade-in-fast border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                            <DeconstructedPrinciple />
                        </div>
                    )}
                </div>

                <div className="space-y-8 mt-8">
                    {feedbackData.map((section, index) => (
                        <div key={index}>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{section.title}</h3>
                            <ul className="space-y-3 list-disc list-inside pl-2">
                                {section.points.map((point, pIndex) => (
                                    <li key={pIndex} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {typeof point === 'string' ? point : point.text}
                                        {typeof point !== 'string' && point.subPoints && (
                                            <ul className="space-y-2 list-[circle] list-inside pl-6 mt-2">
                                                {point.subPoints.map((subPoint, spIndex) => (
                                                    <li key={spIndex}>{subPoint}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SymbioticFeedbackLoopView;