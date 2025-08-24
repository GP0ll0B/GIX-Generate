import React from 'react';
import { LightBulbIcon } from './ui/icons';

const guideContent = `
<!-- 
  **G|I|X GENERATE BLOG POST TEMPLATE V2.0**
  INSTRUCTIONS FOR AI: Populate each commented section below according to the GIX persona.
  Focus on clarity, insightful analysis, and a forward-thinking, optimistic tone.
-->

<!-- SECTION 1: THE HOOK -->
<!-- HOOK: Start with a provocative question or a bold, counter-intuitive statement that challenges a common assumption about technology. -->
<!-- ANALOGY: Introduce a simple, elegant analogy to frame the complex topic for a broad audience. This is a GIX signature. -->
<!-- THESIS: Clearly state the post's main argument or what the reader will learn. End the intro with a sentence that creates anticipation for the next section. -->


<h2>The Core Idea: From [Concept A] to [Concept B]</h2>
<!-- HEADER: The H2 title should frame the central topic as a shift or evolution. -->

<!-- DEFINITION: Define the central concept in clear, concise terms. Avoid jargon where possible, or explain it immediately if necessary. -->

<!-- EXAMPLES: Provide 2-3 specific, real-world examples to illustrate the concept in action. Use a list format for maximum readability. This makes the abstract tangible. -->
<ul>
  <li><strong>For the [Relevant Profession #1, e.g., Scientist]:</strong> <!-- Explain how the concept applies to this field. --></li>
  <li><strong>For the [Relevant Profession #2, e.g., Artist]:</strong> <!-- Explain how the concept applies to this field. --></li>
  <li><strong>For the [Relevant Profession #3, e.g., Strategist]:</strong> <!-- Explain how the concept applies to this field. --></li>
</ul>


<h2>Implications: Three Shifts on the Horizon</h2>
<!-- HEADER: The H2 title should promise actionable, forward-looking insights. -->

<!-- FRAME: Frame this section as a numbered list of key takeaways or industry-wide shifts. This provides structure and value. -->

<ol>
  <li><strong>[Name of Shift #1, e.g., The Democratization of Skill]:</strong> <!-- Describe the first major implication. Explain what it is, why it matters, and who it will affect. --></li>
  <li><strong>[Name of Shift #2, e.g., The Rise of the 'AI Curator']:</strong> <!-- Describe the second major implication. Build on the previous point if possible. --></li>
  <li><strong>[Name of Shift #3, e.g., A New Focus on Ethical Frameworks]:</strong> <!-- Describe the third major implication. This is a great place to integrate GIX's ethical perspective. --></li>
</ol>


<h2>A Note from AikoInfinity</h2>
<!-- PURPOSE: Connect the post's abstract topic directly to AikoInfinity's concrete mission, values, or technology. Reinforce the "why" behind the company's work and its vision for the future. -->


<hr>

<!-- CONCLUDING THOUGHT: A final, powerful, and optimistic sentence that summarizes the GIX perspective on the topic. -->

<em><!-- ENGAGEMENT QUESTION: Ask a specific, open-ended question directly related to the article to drive high-quality comments. Avoid a generic "What are your thoughts?". --></em>
`;

const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Instruction: React.FC<{ title: string; text: string }> = ({ title, text }) => (
    <div className="flex items-start gap-3 p-3 bg-blue-500/10 dark:bg-blue-900/20 rounded-lg">
        <LightBulbIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
            <p className="font-semibold text-blue-800 dark:text-blue-300">{title}</p>
            <p className="text-sm text-gray-700 dark:text-gray-400">{text}</p>
        </div>
    </div>
);

const HtmlPreview: React.FC<{ html: string }> = ({ html }) => (
    <div className="bg-gray-900 text-gray-300 text-xs rounded-lg p-4 font-mono overflow-x-auto">
        <pre><code>{html.trim()}</code></pre>
    </div>
);


const AIGuideView: React.FC = () => {
    const whyItWorksPoints = [
      { title: "More Directive for the AI", text: "Specific instructions (e.g., 'use an analogy') enforce the GIX style." },
      { title: "Structured for Readability", text: "Enforces lists (<ul>, <ol>) to make content scannable and digestible." },
      { title: "Persona-Infused Headers", text: "Dynamic <h2> titles make the structure itself part of the brand voice." },
      { title: "Built-in Value Proposition", text: "Numbered lists of 'shifts' explicitly promise organized, valuable insights." },
      { title: "Stronger Call to Action", text: "Separates the concluding thought from a specific, thought-provoking engagement question." },
    ];
    
    return (
         <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Enhanced Blog Post Template
                    </h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        A structured prompt for G|I|X Generate to produce high-quality, on-brand articles.
                    </p>
                </div>
                
                <GuideSection title="The Template">
                    <p className="text-gray-600 dark:text-gray-400">This HTML structure includes comments that act as direct instructions for the AI, guiding it to populate each section according to the GIX persona.</p>
                    <HtmlPreview html={guideContent.trim()} />
                </GuideSection>

                <GuideSection title="Why This Template is Effective">
                     <div className="space-y-4">
                        {whyItWorksPoints.map(point => (
                             <Instruction key={point.title} title={point.title} text={point.text} />
                        ))}
                    </div>
                </GuideSection>
            </div>
        </div>
    )
};

export default AIGuideView;