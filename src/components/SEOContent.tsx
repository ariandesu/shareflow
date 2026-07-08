import React from 'react';
import { motion } from 'framer-motion';

interface SEOContentProps {
  title: string;
  description: string;
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export function SEOContent({ title, description, steps, faqs }: SEOContentProps) {
  return (
    <div className="mt-16 border-t border-white/10 pt-16 space-y-16 max-w-5xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tighter uppercase">How to Use the {title}</h2>
          <p className="text-white/50 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/5 p-6 border border-white/10 space-y-4 hover:border-white/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-sm">
                {index + 1}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">{step.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8 pb-16"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tighter uppercase">Frequently Asked Questions</h2>
          <p className="text-white/50 text-sm">Common questions about the {title}.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/5 p-6 border border-white/10 space-y-2 hover:border-white/20 transition-colors">
              <h3 className="text-sm font-bold tracking-wider text-white/90">{faq.question}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
