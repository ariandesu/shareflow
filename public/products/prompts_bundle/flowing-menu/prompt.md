# Flowing Menu

- **Category:** UI Component
- **Slug:** `flowing-menu`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** ui component, nav

---

## Architectural Philosophy & Overview
A premium menu component with a flowing marquee effect on hover. Features smooth GSAP animations, directional edge detection for entry/exit transitions, and infinite scrolling image-text ribbons.

Source: ReactBits

---

## Production System Prompt Specification
```
You are given a task to integrate an existing React component in the codebase

~~~/README.md
# FlowingMenuShowcase

A premium menu component featuring an infinite marquee effect that triggers on hover. The component uses directional edge detection to ensure smooth entry and exit transitions based on mouse position.

## Features
- **Directional Transitions**: Animates in from the top or bottom depending on which edge the mouse enters from.
- **Infinite Marquee**: Smooth, performance-optimized GSAP marquee loop.
- **Customizable**: Control colors, speeds, and content easily through props.
- **Minimalist Aesthetic**: Clean, high-end look suitable for luxury or editorial brands.

## Dependencies
- `gsap`: ^3.12.5
- `lucide-react`: ^0.344.0
- `framer-motion`: ^11.0.8

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItemData[]` | `[]` | Array of menu items with text, link, and image URL. |
| `speed` | `number` | `15` | Speed of the marquee animation (lower is faster). |
| `textColor` | `string` | `hsl(var(--foreground))` | Color of the static menu text. |
| `bgColor` | `string` | `hsl(var(--background))` | Background color of the menu container. |
| `marqueeBgColor` | `string` | `hsl(var(--primary))` | Background color of the marquee hover state. |
| `marqueeTextColor` | `string` | `hsl(var(--primary-foreground))` | Color of the marquee text. |
| `borderColor` | `string` | `hsl(var(--border))` | Color of the item separators. |

## Usage
```tsx
import { FlowingMenu } from '@/sd-components/ca24445b-fa72-453d-93bf-922ab552f386';

const items = [
  { link: '#', text: 'Design', image: 'https://placehold.co/600x400' },
  { link: '#', text: 'Code', image: 'https://placehold.co/600x400' }
];

function MyApp() {
  return (
    <div style={{ height: '500px' }}>
      <FlowingMenu items={items} />
    </div>
  );
}
```
~~~

~~~/src/App.tsx
/**
 * Demo for FlowingMenuShowcase
 */

import React from 'react';
import FlowingMenu from './Component';

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&h=400&auto=format&fit=crop' },
  { link: '#', text: 'Sonoma', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&h=400&auto=format&fit=crop' },
  { link: '#', text: 'Monterey', image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=600&h=400&auto=format&fit=crop' },
  { link: '#', text: 'Sequoia', image: 'https://images.unsplash.com/photo-1544084944-15269ec7b5a0?q=80&w=600&h=400&auto=format&fit=crop' }
];

export default function App() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F9F9F9] p-20">
      <div className="w-full max-w-4xl h-[600px] relative rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-border">
        <FlowingMenu 
          items={demoItems} 
          bgColor="transparent"
          textColor="hsl(var(--foreground))"
          marqueeBgColor="hsl(var(--primary))"
          marqueeTextColor="hsl(var(--primary-foreground))"
          borderColor="hsl(var(--border))"
        />
      </div>
    </div>
  );
}
~~~

~~~/package.json
{
  "name": "flowing-menu-showcase",
  "description": "A premium marquee menu with directional hover animations",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gsap": "^3.12.5",
    "lucide-react": "^0.344.0",
    "framer-motion": "^11.0.8"
  }
}
~~~

~~~/src/Component.tsx
/**
 * FlowingMenu Component
 * A sophisticated menu with infinite marquee hover effects and directional transitions.
 */

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

export interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isFirst: boolean;
}

export const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = 'hsl(var(--foreground))',
  bgColor = 'hsl(var(--background))',
  marqueeBgColor = 'hsl(var(--primary))',
  marqueeTextColor = 'hsl(var(--primary-foreground))',
  borderColor = 'hsl(var(--border))'
}) => {
  return (
    <div className="w-full h-full overflow-hidden" style={{ backgroundColor: bgColor }}>
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const animationDefaults = { duration: 0.6, ease: 'expo.out' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / (contentWidth || 100)) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    const timer = setTimeout(setupMarquee, 100);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    
    gsap.timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    
    gsap.timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      className="flex-1 relative overflow-hidden text-center"
      ref={itemRef}
      style={{ borderTop: isFirst ? 'none' : `1px solid ${borderColor}` }}
    >
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-[4vh] transition-opacity hover:opacity-0"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </a>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%]"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="h-full w-fit flex" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center flex-shrink-0" key={idx} style={{ color: marqueeTextColor }}>
              <span className="whitespace-nowrap uppercase font-normal text-[4vh] leading-[1] px-[1vw]">{text}</span>
              <div
                className="w-[200px] h-[7vh] my-[2em] mx-[2vw] rounded-[50px] bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
~~~

Implementation Guidelines

1. Analyze the component structure, styling, animation implementations
2. Review the component's arguments and state
3. Think through what is the best place to adopt this component/style into the design we are doing
4. Then adopt the component/design to our current system

Help me integrate this into my design
```
