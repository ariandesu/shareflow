# Mixpanel Pricing

- **Category:** UI Component
- **Slug:** `mixpanel-pricing`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** pricing, landing page, ui component

---

## Architectural Philosophy & Overview
A pixel-perfect recreation of the Mixpanel pricing section featuring a distinctive purple gradient curtain background, interactive pricing cards, and a dynamic usage estimator slider.

---

## Production System Prompt Specification
```
Here is a reference implementation of pricing section

~~~/README.md
# Mixpanel Pricing Section

A pixel-perfect recreation of the Mixpanel pricing page, featuring:
- **Interactive Pricing Cards**: Hover states, highlighted "Growth" plan, and responsive layout.
- **Dynamic Usage Calculator**: A custom range slider to estimate costs based on event volume.
- **Immersive Background**: A multi-layered gradient "curtain" effect using pure CSS and Tailwind.
- **Responsive Design**: Adapts seamlessly from mobile to desktop.
- **Dark Mode Aesthetic**: Deep purple theme with frosted glass effects.

## Usage

```tsx
import { MixpanelPricing } from '@/sd-components/9dc00c79-c4fb-48e3-b8c8-d514614984d8';

function PricingPage() {
  return <MixpanelPricing />;
}
```

## Features

- **Curtain Background**: Complex gradient overlays create depth.
- **Calculator Logic**: Simple exponential pricing model for demonstration.
- **Framer Motion**: Smooth entrance animations for cards and text.
- **Lucide Icons**: Consistent icon set.
~~~

~~~/src/App.tsx
import React from 'react';
import { MixpanelPricing } from './Component';

export default function App() {
  return (
    <div className="w-full">
      <MixpanelPricing />
    </div>
  );
}
~~~

~~~/package.json
{
  "name": "mixpanel-pricing-section",
  "description": "A pixel-perfect pricing section with gradient curtain background",
  "dependencies": {
    "lucide-react": "^0.300.0",
    "framer-motion": "^10.16.4",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
~~~

~~~/src/Component.tsx
import React, { useState } from 'react';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icons / Logos ---
// Simple SVG placeholders for the logos seen in the image to match the visual style
const Logos = {
  DevRev: () => (
    <svg viewBox="0 0 100 24" className="h-5 w-auto" fill="currentColor">
      <path d="M10,4 L4,10 L4,14 L10,20 L16,14 L16,10 L10,4 M2,10 L10,2 L18,10 L18,14 L10,22 L2,14 Z" fill="#000"/>
      <text x="22" y="17" fontSize="16" fontWeight="bold" fontFamily="sans-serif">DevRev</text>
    </svg>
  ),
  PodcastAI: () => (
    <div className="flex items-center gap-1">
      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold">P</div>
      <span className="font-bold text-sm">PodcastAI</span>
    </div>
  ),
  MeetMe: () => (
     <div className="flex items-center gap-1">
      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white">☺</div>
      <span className="font-bold text-sm">meetme</span>
    </div>
  ),
  Noom: () => (
    <span className="font-bold text-lg tracking-tight">NOOM</span>
  ),
  Zapier: () => (
    <div className="flex items-center gap-1">
        <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
        <span className="font-bold text-sm">_zapier</span>
    </div>
  ),
  Perplexity: () => (
    <div className="flex items-center gap-1">
        <span className="font-serif italic font-bold">perplexity</span>
    </div>
  ),
  Yelp: () => (
     <div className="flex items-center gap-1">
        <span className="font-bold text-lg text-red-600">yelp</span>
        <span className="text-red-600">*</span>
    </div>
  ),
  Pinterest: () => (
    <div className="flex items-center gap-1">
        <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">P</div>
        <span className="font-bold text-sm text-red-600">Pinterest</span>
    </div>
  ),
  LG: () => (
     <div className="flex items-center gap-1">
        <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white text-[10px]">LG</div>
        <span className="font-bold text-sm text-gray-500">LG</span>
    </div>
  )
};

// --- Sub-Components ---

const BackgroundCurtains = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="absolute inset-0 bg-[#0b0216]" /> {/* Base dark background */}
      
      {/* The Curtain Effect - Vertical Gradients */}
      <div className="absolute inset-0 flex justify-center w-full h-full opacity-60">
         {/* Left Curtain */}
         <div className="w-[15%] h-full bg-gradient-to-b from-purple-500/10 via-purple-600/5 to-transparent blur-3xl transform -translate-x-full" />
         <div className="w-[10%] h-full bg-gradient-to-b from-purple-400/20 via-purple-800/10 to-transparent blur-2xl" />
         <div className="w-[8%] h-full bg-gradient-to-b from-purple-300/30 via-purple-700/10 to-transparent blur-xl" />
         
         {/* Center Pillars */}
         <div className="w-[20%] h-full bg-gradient-to-b from-purple-100/5 via-purple-900/5 to-transparent blur-[100px]" />
         
         {/* Right Curtain */}
         <div className="w-[8%] h-full bg-gradient-to-b from-purple-300/30 via-purple-700/10 to-transparent blur-xl" />
         <div className="w-[10%] h-full bg-gradient-to-b from-purple-400/20 via-purple-800/10 to-transparent blur-2xl" />
         <div className="w-[15%] h-full bg-gradient-to-b from-purple-500/10 via-purple-600/5 to-transparent blur-3xl transform translate-x-full" />
      </div>

      {/* Fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-[#0b0216] via-[#0b0216]/80 to-transparent" />
      
      {/* Overlay Mesh */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
    </div>
  );
};

interface PricingCardProps {
  title: string;
  subtitle: string;
  price?: string;
  priceDetail?: string;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
  logos: React.ReactNode[];
  highlight?: boolean;
  linkText?: string;
}

const PricingCard = ({ 
  title, 
  subtitle, 
  price, 
  priceDetail,
  buttonText, 
  buttonVariant, 
  logos, 
  highlight,
  linkText
}: PricingCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative flex flex-col p-6 rounded-[24px] h-full transition-all duration-300",
        highlight 
          ? "bg-white shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] scale-[1.02] z-10" 
          : "bg-white/95 backdrop-blur-sm shadow-xl border border-white/10"
      )}
    >
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">{subtitle}</p>
      </div>

      <div className="mb-8 min-h-[80px]">
        {price ? (
          <div className="mb-2">
            <span className="text-4xl font-semibold tracking-tight text-gray-900">{price}</span>
            {priceDetail && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{priceDetail}</p>}
          </div>
        ) : (
          <div className="mb-2 pt-2">
            <span className="text-3xl font-semibold tracking-tight text-gray-900">{title === "Enterprise" ? "Let's chat" : ""}</span>
             {title === "Enterprise" && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{priceDetail}</p>}
          </div>
        )}
      </div>

      <div className="mt-auto space-y-4">
        <button className={cn(
          "w-full rounded-full py-3 px-6 text-sm font-semibold transition-transform active:scale-95 flex items-center justify-center gap-2",
          buttonVariant === 'primary' && "bg-gray-900 text-white hover:bg-black",
          buttonVariant === 'secondary' && "bg-gray-100 text-gray-900 hover:bg-gray-200",
        )}>
          {buttonText}
          <ChevronRight className="w-4 h-4" />
        </button>

        {linkText && (
          <div className="text-center">
            <a href="#" className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-900 transition-colors">
              {linkText}
            </a>
          </div>
        )}

        <div className="pt-6 mt-2 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">Preferred by:</p>
          <div className="flex items-center gap-4 text-gray-400 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {logos.map((logo, i) => (
              <div key={i} className="flex-1 flex justify-center">{logo}</div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Calculator = () => {
  const [events, setEvents] = useState(1);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Simple exponential mapping for slider
  const getLabel = (val: number) => {
    if (val <= 1) return '1M';
    if (val <= 20) return `${val}M`;
    return '20M+';
  };
  
  const calculatePrice = (val: number) => {
    // Fake pricing logic for demo
    const base = val * 125; 
    return period === 'yearly' ? (base * 0.8).toFixed(0) : base.toFixed(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl mx-auto mt-20 p-8 rounded-[32px] bg-[#1a0b2e] border border-white/10 shadow-2xl relative overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center">
        <div className="flex-1 space-y-4">
           <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#2d1b4e] p-1 rounded-lg inline-flex">
                <button 
                  onClick={() => setPeriod('monthly')}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                    period === 'monthly' ? "bg-[#4c1d95] text-white shadow-sm" : "text-gray-400 hover:text-white"
                  )}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setPeriod('yearly')}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                    period === 'yearly' ? "bg-[#4c1d95] text-white shadow-sm" : "text-gray-400 hover:text-white"
                  )}
                >
                  Yearly
                </button>
              </div>
           </div>

           <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold text-white tracking-tight">${calculatePrice(events)}</span>
                <span className="text-gray-400">/ month</span>
              </div>
              <p className="text-xs text-gray-400">$0.00 per 1K events</p>
           </div>
        </div>

        <div className="flex-1 w-full pt-8 pb-4">
           {/* Custom Range Slider */}
           <div className="relative h-2 bg-gray-700/50 rounded-full mb-8">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-white rounded-full" 
                style={{ width: `${(events / 20) * 100}%` }}
              />
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5"
                value={events}
                onChange={(e) => setEvents(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-[0_0_0_4px_rgba(124,58,237,0.5)] cursor-pointer z-10 pointer-events-none transition-all"
                style={{ left: `${(events / 20) * 100}%`, transform: `translate(-50%, -50%)` }}
              />

              {/* Ticks */}
              <div className="absolute top-6 left-0 right-0 flex justify-between text-[10px] text-gray-500 font-mono">
                {[1, 5, 10, 15, 20].map((tick) => (
                  <span key={tick}>{tick}M</span>
                ))}
              </div>
           </div>
           
           <div className="mt-8">
             <p className="text-sm text-gray-300 mb-4">Select event volume</p>
             <button className="bg-white text-black font-semibold py-3 px-6 rounded-full text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
               Buy Online <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

export function MixpanelPricing() {
  return (
    <div className="relative min-h-screen w-full bg-[#0b0216] text-white overflow-hidden font-sans">
      <BackgroundCurtains />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-5 py-1.5 mb-8 hover:bg-white/10 transition-colors cursor-default"
          >
             <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-8 h-8 rounded-full border-2 border-[#0b0216]" />
                ))}
             </div>
             <span className="text-sm font-medium text-gray-200">Trusted by 29,000+ companies</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-semibold tracking-tight text-white mb-6"
          >
            Plans that grow with you
          </motion.h1>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          <PricingCard 
            title="Free"
            subtitle="No credit card required"
            price="Free forever"
            priceDetail="Capped at 1M monthly events. The basics to get started, including up to 5 saved reports and 10K monthly session replays."
            buttonText="Sign Up"
            buttonVariant="secondary"
            logos={[<Logos.DevRev />, <Logos.PodcastAI />, <Logos.MeetMe />]}
          />
          <PricingCard 
            highlight
            title="Growth"
            subtitle="Make your competition sweat"
            price="Starts at $0"
            priceDetail="1M monthly events free and $0.28 per 1K events after (volume discounts available). Unlimited reports, 20K monthly session replays free, cohorts, and more."
            buttonText="Start for Free"
            buttonVariant="primary"
            linkText="Calculate pricing"
            logos={[<Logos.Noom />, <Logos.Zapier />, <Logos.Perplexity />]}
          />
          <PricingCard 
            title="Enterprise"
            subtitle="Self-serve answers at scale"
            priceDetail="Unlimited monthly events. Advanced analytics, comprehensive data governance and security, premium support, and more."
            buttonText="Contact Sales"
            buttonVariant="secondary"
            logos={[<Logos.Yelp />, <Logos.Pinterest />, <Logos.LG />]}
          />
        </div>

        {/* Startups Section */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-center py-16 max-w-3xl mx-auto border-t border-white/5 border-b border-white/5 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        >
          <h2 className="text-3xl font-semibold mb-4">Startups: first year is free</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Early-stage companies that were founded less than 5 years ago, with up to $8M in total funding, and haven't redeemed any other offers can receive their first year free on the Startup Plan.
          </p>
          <button className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 mx-auto">
            Explore Startup Program <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Calculator Section */}
        <div className="pt-20 pb-10">
          <div className="max-w-xl mx-auto text-center mb-10">
            <h2 className="text-4xl font-semibold mb-4">Estimate your <br/> Growth plan price <span className="text-purple-400">*</span></h2>
            <p className="text-gray-400">Use the slider to estimate your Growth plan price.</p>
          </div>
          <Calculator />
          <p className="text-center text-xs text-gray-600 mt-8">* You may be on a legacy plan with different pricing</p>
        </div>

      </div>
      
      {/* Footer Branding Mockup */}
      <div className="border-t border-white/10 mt-20 py-8 text-center opacity-50">
        <div className="flex items-center justify-between px-10">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
               <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="currentColor">
                 <path d="M4 4h4v16H4V4zm6 6h4v10h-4V10zm6-6h4v16h-4V4z"/>
               </svg>
             </div>
             <span className="text-xl font-semibold text-white">Mixpanel</span>
           </div>
        </div>
      </div>
    </div>
  );
}
export default MixpanelPricing;
~~~
```
