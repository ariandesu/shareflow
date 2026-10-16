# Pastel Gradient Background

- **Category:** Animation
- **Slug:** `pastel-gradient-background`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** background, animation

---

## Architectural Philosophy & Overview
A soft, rotating pastel gradient background with blur effects and smooth animation.

---

## Production System Prompt Specification
```
Here is the reference implementation of a gradient background

~~~/README.md
# Pastel Gradient Background

A dreamy, animated background component featuring rotating conic gradients and soft blur effects.

## Features

- 🎨 **Soft Pastel Palette**: Uses a carefully selected range of pastel colors (pink, peach, yellow, mint, blue, lavender).
- 🔄 **Double Rotation**: Two layers rotating in opposite directions for depth and dynamic movement.
- 🌫️ **Glassmorphism Ready**: Creates a perfect backdrop for frosted glass UI elements.
- 📱 **Responsive**: Fills the container or viewport completely.

## Usage

```tsx
import { PastelGradientBackground } from '@/sd-components/2846c5a3-16f5-428d-ba75-6752c5d018d9';

export default function MyPage() {
  return (
    <PastelGradientBackground>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Hello World</h1>
      </div>
    </PastelGradientBackground>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to render on top of the background |
| className | string | - | Additional classes for the wrapper div |
| ...props | HTMLAttributes | - | Standard div attributes |
~~~

~~~/src/App.tsx
import React from 'react';
import { PastelGradientBackground } from './Component';

export default function App() {
  return (
    <PastelGradientBackground />
  );
}
~~~

~~~/package.json
{
  "name": "pastel-gradient-background",
  "version": "1.0.0",
  "description": "A soft, rotating pastel gradient background with blur effects",
  "main": "src/Component.tsx",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  }
}
~~~

~~~/src/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
~~~

~~~/src/Component.tsx
import React from 'react';
import { cn } from './utils';

export interface PastelGradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function PastelGradientBackground({ 
  children, 
  className,
  ...props 
}: PastelGradientBackgroundProps) {
  return (
    <div 
      className={cn("relative w-full h-full min-h-screen overflow-hidden", className)}
      style={{
        background: 'linear-gradient(135deg, #ffe8f3, #d9f3ff)'
      }}
      {...props}
    >
      <style>
        {`
          @keyframes rotate {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
          @keyframes rotate-reverse {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(-360deg);
            }
          }
          .pastel-bg-layer-1 {
            background: conic-gradient(
              from 0deg,
              #ff9aa2,
              #ffb7b2,
              #ffdac1,
              #e2f0cb,
              #a2e4ff,
              #c9afff,
              #ffb7b2,
              #ff9aa2
            );
            animation: rotate 8s linear infinite;
          }
          .pastel-bg-layer-2 {
            background: conic-gradient(
              from 0deg,
              #ff9aa2,
              #ffb7b2,
              #ffdac1,
              #e2f0cb,
              #a2e4ff,
              #c9afff,
              #ffb7b2,
              #ff9aa2
            );
            animation: rotate-reverse 10s linear infinite;
          }
        `}
      </style>

      {/* Container Background (Radial) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.1))'
        }}
      />

      {/* Rotating Layers */}
      <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-hidden opacity-80 blur-[50px] pastel-bg-layer-1" />
      <div className="absolute top-1/2 left-1/2 w-[180%] h-[180%] -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-hidden opacity-60 blur-[50px] pastel-bg-layer-2" />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

export default PastelGradientBackground;
~~~

Implementation Guidelines

1. Analyze the component structure, styling, animation implementations
2. Review the component's arguments and state
3. Think through what is the best place to adopt this component/style into the design we are doing
4. Then adopt the component/design to our current system

Help me integrate this into my design
```
