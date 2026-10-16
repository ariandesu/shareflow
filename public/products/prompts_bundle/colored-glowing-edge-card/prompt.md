# Colored, Glowing Edge Card

- **Category:** UI Component
- **Slug:** `colored-glowing-edge-card`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** ui component, card, border effect, glowing

---

## Architectural Philosophy & Overview
Original source: https://codepen.io/simeydotme/pen/RNWoPRj

---

## Production System Prompt Specification
```
```apptsx
import React, { useState } from 'react';
import { GlowingEdgeCard } from './Component';
import { Sun, Moon, Github, Twitter, ExternalLink } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const toggleMode = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 ${mode === 'light' ? 'bg-[#e0e0e0] text-black' : 'bg-[#1a1c20] text-white'}`}>
      
      <div className="mb-8 flex gap-4">
        <button 
          onClick={() => setMode('light')}
          className={`p-2 rounded-full transition-all duration-300 ${mode === 'light' ? 'bg-yellow-400 text-white shadow-lg scale-110' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <Sun size={24} />
        </button>
        <button 
          onClick={() => setMode('dark')}
          className={`p-2 rounded-full transition-all duration-300 ${mode === 'dark' ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <Moon size={24} />
        </button>
      </div>

      <GlowingEdgeCard mode={mode} className="shadow-2xl">
        <div className="flex flex-col h-full p-6 sm:p-10">
          <header className="flex justify-between items-center mb-6">
            <Sun className={`w-6 h-6 transition-opacity duration-300 ${mode === 'light' ? 'opacity-100 text-yellow-500' : 'opacity-25'}`} />
            <h2 className="text-xl font-medium tracking-wide">Colored, Glowing Edges</h2>
            <Moon className={`w-6 h-6 transition-opacity duration-300 ${mode === 'dark' ? 'opacity-100 text-indigo-400' : 'opacity-25'}`} />
          </header>
          
          <div className="flex-1 overflow-y-auto space-y-6 text-left content-mask pr-2">
            <p className="text-lg font-light leading-relaxed opacity-0 animate-fade-in [animation-delay:2s] text-[color:mix(in_srgb,var(--fg),transparent_40%)]">
              This is <em className="font-medium not-italic text-[var(--fg)]">somewhat different</em> to the usual colored, glowing cards you may have seen before!
            </p>
            
            <p className="font-light leading-relaxed opacity-0 animate-fade-in [animation-delay:2.25s] text-[color:mix(in_srgb,var(--fg),transparent_40%)]">
              Building off previous concepts, this card creates a subtle colored border with glowing edges that react to your mouse position.
            </p>
    
            <p className="font-light leading-relaxed opacity-0 animate-fade-in [animation-delay:2.5s] text-[color:mix(in_srgb,var(--fg),transparent_40%)]">
              It uses <strong className="font-medium text-[var(--fg)]">a mesh gradient background</strong>, which
              is masked with radial gradients to create the edge colors. Then it's <em className="font-medium not-italic text-[var(--fg)]">masked again with a conic-gradient that 
              follows the direction of the pointer</em>.
            </p>
            
            <p className="font-light leading-relaxed opacity-0 animate-fade-in [animation-delay:2.75s] text-[color:mix(in_srgb,var(--fg),transparent_40%)]">
              The glow increases in opacity as the pointer gets closer to the edge, creating a natural magnetic feel.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-center gap-6">
             <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">
               <Github size={20} />
             </a>
             <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">
               <Twitter size={20} />
             </a>
          </div>
        </div>
      </GlowingEdgeCard>

      <div className="mt-12 flex gap-4 text-sm opacity-50">
        <div className="flex items-center gap-2">
           <ExternalLink size={14} />
           <span>Interact with the card to see the effect</span>
        </div>
      </div>

      <style>{`
        .content-mask {
            mask-image: linear-gradient(to top, transparent 5px, black 2em);
        }
        @keyframes fadeContent {
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeContent 1.5s ease-in-out both;
        }
      `}</style>
    </div>
  );
}
```

```componenttsx
import React, { useEffect, useRef, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GlowingEdgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: 'dark' | 'light';
  children?: React.ReactNode;
}

/**
 * GlowingEdgeCard
 * 
 * A distinctive card component with colored, glowing edges that follow the mouse pointer.
 * It uses complex CSS gradients and masks to create a mesh gradient border and background effect.
 * 
 * Features:
 * - Interactive glow following pointer
 * - Mesh gradient borders
 * - Smooth entrance animation
 * - Light/Dark mode support
 */
export function GlowingEdgeCard({ 
  mode = 'dark', 
  className, 
  children,
  ...props 
}: GlowingEdgeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Helper functions for math
  const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));
  const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

  const centerOfElement = (rect: DOMRect) => {
    return [rect.width / 2, rect.height / 2];
  };

  const getPointerPosition = (rect: DOMRect, e: MouseEvent | React.MouseEvent) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = clamp((100 / rect.width) * x);
    const py = clamp((100 / rect.height) * y);
    return { pixels: [x, y], percent: [px, py] };
  };

  const angleFromPointer = (dx: number, dy: number) => {
    let angleRadians = 0;
    let angleDegrees = 0;
    if (dx !== 0 || dy !== 0) {
      angleRadians = Math.atan2(dy, dx);
      angleDegrees = angleRadians * (180 / Math.PI) + 90;
      if (angleDegrees < 0) {
        angleDegrees += 360;
      }
    }
    return angleDegrees;
  };

  const closenessToEdge = (rect: DOMRect, x: number, y: number) => {
    const [cx, cy] = centerOfElement(rect);
    const dx = x - cx;
    const dy = y - cy;
    let k_x = Infinity;
    let k_y = Infinity;
    if (dx !== 0) {
      k_x = cx / Math.abs(dx);
    }
    if (dy !== 0) {
      k_y = cy / Math.abs(dy);
    }
    return clamp((1 / Math.min(k_x, k_y)), 0, 1);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const position = getPointerPosition(rect, e);
    const [px, py] = position.pixels;
    const [perx, pery] = position.percent;
    
    const [cx, cy] = centerOfElement(rect);
    const dx = px - cx;
    const dy = py - cy;
    
    const edge = closenessToEdge(rect, px, py);
    const angle = angleFromPointer(dx, dy);

    cardRef.current.style.setProperty('--pointer-x', `${round(perx)}%`);
    cardRef.current.style.setProperty('--pointer-y', `${round(pery)}%`);
    cardRef.current.style.setProperty('--pointer-deg', `${round(angle)}deg`);
    cardRef.current.style.setProperty('--pointer-d', `${round(edge * 100)}`);
    
    // Stop intro animation interaction
    if (isAnimating) {
        setIsAnimating(false);
        cardRef.current.classList.remove('animating');
    }
  };

  // Intro animation
  useEffect(() => {
    const playAnimation = () => {
      if (!cardRef.current) return;
      
      setIsAnimating(true);
      const angleStart = 110;
      const angleEnd = 465;
      
      cardRef.current.style.setProperty('--pointer-deg', `${angleStart}deg`);
      
      const startTime = performance.now();
      
      // We'll use a single rAF loop for simplicity instead of the custom animateNumber helper 
      // from the original code which had multiple sequential animations
      
      // Sequence timing:
      // 0-500ms: Delay
      // 500-1000ms: Opacity/Distance up (easeOutCubic)
      // 500-2000ms: Rotate 1 (easeInCubic) -> 50%
      // 2000-4250ms: Rotate 2 (easeOutCubic) -> 100%
      // 3000-4500ms: Opacity/Distance down (easeInCubic)
      
      const animate = (now: number) => {
        if (!cardRef.current || !cardRef.current.classList.contains('animating')) return;
        
        const elapsed = now - startTime;
        
        // Phase 1: Distance increase (fade in glow)
        if (elapsed > 500 && elapsed < 1000) {
            const t = (elapsed - 500) / 500;
            const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
            cardRef.current.style.setProperty('--pointer-d', `${ease * 100}`);
        }
        
        // Phase 2: Rotation part 1
        if (elapsed > 500 && elapsed < 2000) {
            const t = (elapsed - 500) / 1500;
            const ease = t * t * t; // easeInCubic
            const d = (angleEnd - angleStart) * (ease * 0.5) + angleStart;
            cardRef.current.style.setProperty('--pointer-deg', `${d}deg`);
        }
        
        // Phase 3: Rotation part 2
        if (elapsed >= 2000 && elapsed < 4250) {
            const t = (elapsed - 2000) / 2250;
            const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
            const d = (angleEnd - angleStart) * (0.5 + ease * 0.5) + angleStart;
            cardRef.current.style.setProperty('--pointer-deg', `${d}deg`);
        }
        
        // Phase 4: Distance decrease (fade out glow)
        if (elapsed > 3000 && elapsed < 4500) {
            const t = (elapsed - 3000) / 1500;
            const ease = t * t * t; // easeInCubic
            cardRef.current.style.setProperty('--pointer-d', `${(1 - ease) * 100}`);
        }
        
        if (elapsed < 4500) {
            requestAnimationFrame(animate);
        } else {
            setIsAnimating(false);
            cardRef.current?.classList.remove('animating');
        }
      };
      
      requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
        playAnimation();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={cn(
        "relative w-full max-w-[600px] h-[600px] max-h-[80vh]",
        "flex flex-col rounded-[1.768em]",
        "group transition-colors duration-300",
        mode === 'light' ? 'light-mode' : 'dark-mode',
        isAnimating && 'animating',
        className
      )}
      ref={cardRef}
      onPointerMove={handlePointerMove}
      style={{
        // Core CSS variables
        '--glow-sens': '30',
        '--pointer-x': '50%',
        '--pointer-y': '50%',
        '--pointer-deg': '45deg', 
        '--pointer-d': '0',
        
        // Derived variables calculated here or in CSS
        '--color-sens': 'calc(var(--glow-sens) + 20)',
        
        // Theme variables (defaults)
        '--card-bg': mode === 'light' 
           ? 'linear-gradient(8deg, color-mix(in hsl, hsl(260, 25%, 95%), #000 2.5%) 75%, hsl(260, 25%, 95%) 75.5%)'
           : 'linear-gradient(8deg, #1a1a1a 75%, color-mix(in hsl, #1a1a1a, white 2.5%) 75.5%)',
        '--blend': mode === 'light' ? 'darken' : 'soft-light',
        '--glow-blend': mode === 'light' ? 'luminosity' : 'plus-lighter',
        '--glow-color': mode === 'light' ? '280deg 90% 95%' : '40deg 80% 80%',
        '--glow-boost': mode === 'light' ? '15%' : '0%',
        '--fg': mode === 'light' ? 'black' : 'white',
      } as React.CSSProperties}
      {...props}
    >
        {/* Style tag for pseudo-elements simulation since we can't easily inline complex pseudo-styles in React */}
        <style dangerouslySetInnerHTML={{__html: `
            .glowing-card-mesh-border {
                position: absolute;
                inset: 0;
                border-radius: inherit;
                z-index: -1;
                border: 1px solid transparent;
                background:
                    linear-gradient(var(--card-bg) 0 100%) padding-box,
                    linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
                    radial-gradient(at 80% 55%, hsla(268,100%,76%,1) 0px, transparent 50%) border-box,
                    radial-gradient(at 69% 34%, hsla(349,100%,74%,1) 0px, transparent 50%) border-box,
                    radial-gradient(at 8% 6%, hsla(136,100%,78%,1) 0px, transparent 50%) border-box,
                    radial-gradient(at 41% 38%, hsla(192,100%,64%,1) 0px, transparent 50%) border-box,
                    radial-gradient(at 86% 85%, hsla(186,100%,74%,1) 0px, transparent 50%) border-box,
                    radial-gradient(at 82% 18%, hsla(52,100%,65%,1) 0px, transparent 50%) border-box,
                    radial-gradient(at 51% 4%, hsla(12,100%,72%,1) 0px, transparent 50%) border-box,
                    linear-gradient(#c299ff 0 100%) border-box;
                opacity: calc((var(--pointer-d) - var(--color-sens)) / (100 - var(--color-sens)));
                mask-image: conic-gradient(from var(--pointer-deg) at center, black 25%, transparent 40%, transparent 60%, black 75%);
                transition: opacity 0.25s ease-out;
            }
            
            .glowing-card-mesh-bg {
                position: absolute;
                inset: 0;
                border-radius: inherit;
                z-index: -1;
                border: 1px solid transparent;
                background:
                    radial-gradient(at 80% 55%, hsla(268,100%,76%,1) 0px, transparent 50%) padding-box,
                    radial-gradient(at 69% 34%, hsla(349,100%,74%,1) 0px, transparent 50%) padding-box,
                    radial-gradient(at 8% 6%, hsla(136,100%,78%,1) 0px, transparent 50%) padding-box,
                    radial-gradient(at 41% 38%, hsla(192,100%,64%,1) 0px, transparent 50%) padding-box,
                    radial-gradient(at 86% 85%, hsla(186,100%,74%,1) 0px, transparent 50%) padding-box,
                    radial-gradient(at 82% 18%, hsla(52,100%,65%,1) 0px, transparent 50%) padding-box,
                    radial-gradient(at 51% 4%, hsla(12,100%,72%,1) 0px, transparent 50%) padding-box,
                    linear-gradient(#c299ff 0 100%) padding-box;
                mask-image:
                    linear-gradient(to bottom, black, black),
                    radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
                    radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
                    radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
                    radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
                    radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
                    conic-gradient(from var(--pointer-deg) at center, transparent 5%, black 15%, black 85%, transparent 95%);
                mask-composite: subtract, add, add, add, add, add, add;
                opacity: calc((var(--pointer-d) - var(--color-sens)) / (100 - var(--color-sens)));
                mix-blend-mode: var(--blend);
                transition: opacity 0.25s ease-out;
            }
            
            .glowing-card-glow {
                position: absolute;
                inset: -40px; /* var(--pads) */
                pointer-events: none;
                z-index: 1;
                mask-image: conic-gradient(from var(--pointer-deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
                opacity: calc((var(--pointer-d) - var(--glow-sens)) / (100 - var(--glow-sens)));
                mix-blend-mode: var(--glow-blend);
                transition: opacity 0.25s ease-out;
                border-radius: inherit;
            }
            
            .glowing-card-glow::before {
                content: "";
                position: absolute;
                inset: 40px; /* var(--pads) */
                border-radius: inherit;
                box-shadow: 
                    inset 0 0 0 1px hsl(var(--glow-color) / 100%),
                    inset 0 0 1px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 60%)),
                    inset 0 0 3px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 50%)),
                    inset 0 0 6px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 40%)),
                    inset 0 0 15px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 30%)),
                    inset 0 0 25px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 20%)),
                    inset 0 0 50px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 10%)),
                    0 0 1px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 60%)),
                    0 0 3px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 50%)),
                    0 0 6px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 40%)),
                    0 0 15px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 30%)),
                    0 0 25px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 20%)),
                    0 0 50px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 10%));
            }

            .group:not(:hover):not(.animating) .glowing-card-mesh-border,
            .group:not(:hover):not(.animating) .glowing-card-mesh-bg,
            .group:not(:hover):not(.animating) .glowing-card-glow {
                opacity: 0 !important;
                transition: opacity 0.75s ease-in-out;
            }
        `}} />
        
        {/* Background Layers */}
        <div className="glowing-card-mesh-border" />
        <div className="glowing-card-mesh-bg" />
        <div className="glowing-card-glow" />
        
        {/* Content Container */}
        <div className="relative z-10 w-full h-full overflow-hidden bg-[var(--card-bg)] bg-no-repeat rounded-[inherit] border border-white/25">
             {children}
        </div>
    </div>
  );
}

export default GlowingEdgeCard;
```

Above is an implementation reference of Colored, Glowing Edge Card effect, help me implement this UI component by adding a new component node
```
