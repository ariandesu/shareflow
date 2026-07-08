import React from 'react';
import { motion } from 'framer-motion';

interface SEOContentProps {
  title: string;
  description: string;
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export function SEOContent({ title, description, steps, faqs }: SEOContentProps) {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.dataset.zone = '11258520';
    script.src = 'https://n6wxm.com/vignette.min.js';
    
    const target = [document.documentElement, document.body].filter(Boolean).pop();
    if (target) {
      target.appendChild(script);
    }
    
    return () => {
      if (target && script.parentNode === target) {
        target.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="mt-16 border-t border-white/10 pt-16 space-y-16 max-w-5xl mx-auto w-full">
      {/* Google Ad Space */}
      <div className="w-full">
        <div 
          className="w-full min-h-[90px] md:min-h-[120px] bg-white/5 border border-white/10 border-dashed flex items-center justify-center"
          id="ad-slot-tool-page"
        >
          {/* 
            Replace this div with your Google AdSense code:
            <ins className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          */}
          <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Ad Space</span>
        </div>
      </div>

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
            <div key={index} className="faq-item bg-white/5 p-6 border border-white/10 space-y-2 hover:border-white/20 transition-colors">
              <h3 className="faq-question text-sm font-bold tracking-wider">{faq.question}</h3>
              <p className="faq-answer text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
