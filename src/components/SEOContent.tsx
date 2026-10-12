import React from 'react';
import { motion } from 'motion/react';
import { AdBanner } from './AdBanner';

interface SEOContentProps {
  title: string;
  description: string;
  steps: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export function SEOContent({ title, description, steps, faqs }: SEOContentProps) {
  return (
    <div className="mt-16 border-t border-[#e5e5ea] dark:border-white/10 pt-16 space-y-16 max-w-5xl mx-auto w-full transition-colors">
      <AdBanner />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tighter uppercase text-[#1d1d1f] dark:text-white">How to Use the {title}</h2>
          <p className="text-[#6e6e73] dark:text-white/50 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white dark:bg-white/5 p-6 border border-[#e5e5ea] dark:border-white/10 space-y-4 hover:border-[#0071e3] dark:hover:border-white/20 transition-all rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-sm">
                {index + 1}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white/80">{step.title}</h3>
              <p className="text-sm text-[#6e6e73] dark:text-white/50 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {faqs && faqs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8 pb-16"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter uppercase text-[#1d1d1f] dark:text-white">Frequently Asked Questions</h2>
            <p className="text-[#6e6e73] dark:text-white/50 text-sm">Common questions about the {title}.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item bg-white dark:bg-white/5 p-6 border border-[#e5e5ea] dark:border-white/10 space-y-2 hover:border-[#0071e3] dark:hover:border-white/20 transition-all rounded-2xl shadow-xs">
                <h3 className="faq-question text-sm font-bold tracking-wider text-[#1d1d1f] dark:text-white">{faq.question}</h3>
                <p className="faq-answer text-sm leading-relaxed text-[#6e6e73] dark:text-white/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
