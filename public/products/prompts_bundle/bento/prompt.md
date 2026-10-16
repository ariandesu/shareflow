# Bento

- **Category:** UI Component
- **Slug:** `bento`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** ui component, landing page

---

## Architectural Philosophy & Overview
A high-end, minimalist bento grid component with advanced interactive effects including spotlight, border glow, particles (stars), tilt, and magnetism. Designed for modern dashboards and landing pages.

Source: ReactBits

---

## Production System Prompt Specification
```
You are given a task to integrate an existing React component in the codebase

~~~/README.md
# MagicBento

A high-performance, interactive Bento Grid component featuring advanced animations and hover effects. Built with React, GSAP, and Tailwind CSS.

## Features
- **Spotlight Effect**: Mouse-following radial gradient overlay.
- **Border Glow**: Interactive border highlighting based on mouse position.
- **Particle Stars**: Floating, animated particles that react to hover.
- **3D Tilt**: Perspective-based card rotation.
- **Magnetism**: Cards subtly follow the cursor within their bounds.
- **Ripple Click**: Visual feedback on click events.
- **Responsive**: Adapts layout from mobile to desktop.

## Dependencies
- `react`: ^18.0.0
- `gsap`: ^3.12.0
- `lucide-react`: ^0.454.0
- `clsx`: ^2.1.1
- `tailwind-merge`: ^2.5.4

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `textAutoHide` | `boolean` | `true` | Clips description text to 2 lines. |
| `enableStars` | `boolean` | `true` | Enables particle animation on hover. |
| `enableSpotlight` | `boolean` | `true` | Enables global spotlight hover effect. |
| `enableBorderGlow` | `boolean` | `true` | Enables reactive border glow. |
| `enableTilt` | `boolean` | `true` | Enables 3D perspective tilt on hover. |
| `enableMagnetism` | `boolean` | `true` | Enables magnetic pull effect. |
| `clickEffect` | `boolean` | `true` | Enables ripple effect on click. |
| `spotlightRadius` | `number` | `300` | Radius of the spotlight in pixels. |
| `particleCount` | `number` | `12` | Number of particles generated per card. |
| `glowColor` | `string` | `"132, 0, 255"` | RGB color string for effects. |
| `disableAnimations` | `boolean` | `false` | Global toggle to disable all animations. |

## Usage

```tsx
import { MagicBento } from '@/sd-components/9da9b1d0-f2b5-4597-b725-71b35ff930aa';

function MyDashboard() {
  return (
    <MagicBento 
      enableStars={true}
      enableTilt={true}
      glowColor="59, 130, 246"
    />
  );
}
```
~~~

~~~/src/App.tsx
import React from 'react';
import MagicBento from './Component';

/**
 * App Demo
 * Shows the MagicBento component in its minimalist glory.
 */
export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] flex items-center justify-center p-20">
      <div className="w-full max-w-5xl rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.05)] overflow-hidden">
        <MagicBento 
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        />
      </div>
    </div>
  );
}
~~~

~~~/package.json
{
  "name": "magic-bento",
  "description": "Interactive bento grid with spotlight and particle effects",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "gsap": "^3.12.5",
    "lucide-react": "^0.454.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  }
}
~~~

~~~/src/Component.tsx
/**
 * MagicBento Component
 * A highly interactive bento grid with spotlight effects, particle stars, 
 * 3D tilt, magnetism, and border glow.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  {
    color: '#060010',
    title: 'Analytics',
    description: 'Track user behavior and growth trends with real-time insights.',
    label: 'Insights'
  },
  {
    color: '#060010',
    title: 'Dashboard',
    description: 'Centralized data view for all your critical metrics.',
    label: 'Overview'
  },
  {
    color: '#060010',
    title: 'Collaboration',
    description: 'Work together seamlessly across teams and timezones.',
    label: 'Teamwork'
  },
  {
    color: '#060010',
    title: 'Automation',
    description: 'Streamline workflows with intelligent trigger actions.',
    label: 'Efficiency'
  },
  {
    color: '#060010',
    title: 'Integration',
    description: 'Connect your favorite tools into one unified platform.',
    label: 'Connectivity'
  },
  {
    color: '#060010',
    title: 'Security',
    description: 'Enterprise-grade protection for your sensitive data.',
    label: 'Protection'
  }
];

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const particle = createParticleElement(x, y, glowColor);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });
      }, i * 100);
      timeoutsRef.current.push(timeoutId);
    }
  }, [particleCount, glowColor]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      gsap.to(element, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(element, { rotateX, rotateY, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        magnetismAnimationRef.current = gsap.to(element, { x: magnetX, y: magnetY, duration: 0.3, ease: 'power2.out' });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(${glowColor}, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1000;
      `;
      element.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 50, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div ref={cardRef} className={className} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
};

export const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldDisableAnimations = disableAnimations || isMobile;

  useEffect(() => {
    if (!enableSpotlight || shouldDisableAnimations) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('.bento-card');
      
      cards.forEach(card => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        (card as HTMLElement).style.setProperty('--spotlight-radius', `${spotlightRadius}px`);
        (card as HTMLElement).style.setProperty('--glow-color', `rgba(${glowColor}, 0.15)`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableSpotlight, shouldDisableAnimations, spotlightRadius, glowColor]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-[#060010]">
      <style>
        {`
          .bento-grid {
            display: grid;
            gap: 1rem;
            width: 100%;
            max-width: 1000px;
            grid-template-columns: repeat(1, 1fr);
          }
          
          @media (min-width: 640px) {
            .bento-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .bento-grid {
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: repeat(2, 200px);
            }
            .card-0 { grid-column: span 2; grid-row: span 1; }
            .card-1 { grid-column: span 1; grid-row: span 1; }
            .card-2 { grid-column: span 1; grid-row: span 2; }
            .card-3 { grid-column: span 1; grid-row: span 1; }
            .card-4 { grid-column: span 2; grid-row: span 1; }
            .card-5 { grid-column: span 1; grid-row: span 1; }
          }

          .bento-card {
            background: #0a041a;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            transition: border-color 0.3s ease;
          }

          .bento-card:hover {
            border-color: rgba(${glowColor}, 0.3);
          }

          .spotlight-overlay {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: radial-gradient(
              var(--spotlight-radius) circle at var(--mouse-x) var(--mouse-y),
              var(--glow-color),
              transparent 80%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .bento-card:hover .spotlight-overlay {
            opacity: 1;
          }

          .border-glow {
            position: absolute;
            inset: 0;
            pointer-events: none;
            border-radius: inherit;
            padding: 1px;
            background: radial-gradient(
              var(--spotlight-radius) circle at var(--mouse-x) var(--mouse-y),
              rgba(${glowColor}, 0.8),
              transparent 40%
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .bento-card:hover .border-glow {
            opacity: 1;
          }
        `}
      </style>
      
      <div ref={gridRef} className="bento-grid">
        {cardData.map((card, index) => {
          const Content = (
            <div className="bento-card h-full w-full p-6 flex flex-col justify-between group">
              <div className="spotlight-overlay" />
              {enableBorderGlow && <div className="border-glow" />}
              
              <div className="relative z-10">
                <span className="text-xs font-medium tracking-wider text-purple-400 uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                  {card.label}
                </span>
                <h3 className="text-xl font-semibold text-white mt-2">
                  {card.title}
                </h3>
              </div>
              
              <div className="relative z-10">
                <p className={`text-sm text-gray-400 leading-relaxed ${textAutoHide ? 'line-clamp-2' : ''}`}>
                  {card.description}
                </p>
              </div>
            </div>
          );

          if (enableStars) {
            return (
              <ParticleCard
                key={index}
                className={`bento-card card-${index}`}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disableAnimations={shouldDisableAnimations}
              >
                {Content}
              </ParticleCard>
            );
          }

          return (
            <div key={index} className={`bento-card card-${index}`}>
              {Content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBento;
~~~

Implementation Guidelines

1. Analyze the component structure, styling, animation implementations
2. Review the component's arguments and state
3. Think through what is the best place to adopt this component/style into the design we are doing
4. Then adopt the component/design to our current system

Help me integrate this into my design
```
