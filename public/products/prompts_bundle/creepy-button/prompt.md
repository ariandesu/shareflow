# Creepy Button

- **Category:** UI Component
- **Slug:** `creepy-button`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** ui component, button

---

## Architectural Philosophy & Overview
A playful, interactive button with eyes that blink and track the cursor movement. Perfect for gamified interfaces or playful call-to-actions.

Source: https://codepen.io/jkantner/pen/ZYWKvqW

---

## Production System Prompt Specification
```
You are given a task to integrate an existing React component in the codebase

~~~/README.md
# Creepy Button

A playful, interactive button component with eyes that track the cursor and blink automatically. Perfect for adding character and delight to your UI.

## Features

- **Interactive Eye Tracking**: The button's eyes follow the user's cursor movement.
- **Playful Animation**: On hover, the button "ducks" away slightly.
- **Automatic Blinking**: Eyes blink naturally at intervals.
- **Customizable**: Colors can be customized via CSS variables.
- **Production Ready**: Fully typed with TypeScript.

## Usage

```tsx
import { CreepyButton } from '@/sd-components/9c1481ab-97d8-4d7d-b758-355f8d6751b3';

function App() {
  return (
    <CreepyButton onClick={() => console.log('Boo!')}>
      Hover Me
    </CreepyButton>
  );
}
```

## Customization

You can customize the button colors by wrapping it in a container that redefines the component's CSS variables:

```tsx
<div style={{ 
  '--cb-primary5': '#ef4444', // Main color
  '--cb-primary6': '#dc2626', // Hover color
  '--cb-primary3': '#fca5a5'  // Focus ring
} as React.CSSProperties}>
  <CreepyButton>Angry Button</CreepyButton>
</div>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | The content to display inside the button |
| onClick | () => void | Callback when button is clicked |
| className | string | Optional additional classes |
| ...props | ButtonHTMLAttributes | All standard button attributes |
~~~

~~~/src/App.tsx
import React, { useState } from 'react';
import { CreepyButton } from './Component';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center p-8 font-sans text-slate-800">
      <div className="max-w-md w-full text-center space-y-12">
        
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900" style={{ fontFamily: '"Londrina Solid", sans-serif' }}>
            Don't look at me!
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-sm mx-auto">
            These buttons are watching your every move. Hover over them to see them react!
          </p>
        </header>

        <div className="grid gap-8 place-items-center">
          
          <div className="p-12 bg-white rounded-[2rem] shadow-xl border-4 border-slate-100 flex flex-col items-center gap-8 w-full">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-400">Default Style</h2>
            <CreepyButton onClick={() => setCount(c => c + 1)}>
              Click Me! {count > 0 && `(${count})`}
            </CreepyButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
             <div className="p-8 bg-slate-900 rounded-[2rem] shadow-lg flex flex-col items-center gap-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-500">Dark Mode</h2>
                {/* Override styles with inline style or class if needed, but the component uses internal vars. 
                    To customize colors, one would override the CSS variables in a parent scope */}
                <div style={{ 
                  '--cb-primary5': '#ef4444', 
                  '--cb-primary6': '#dc2626',
                  '--cb-primary3': '#fca5a5' 
                } as React.CSSProperties}>
                  <CreepyButton>
                    Angry Button
                  </CreepyButton>
                </div>
             </div>

             <div className="p-8 bg-emerald-50 rounded-[2rem] shadow-lg border-2 border-emerald-100 flex flex-col items-center gap-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-emerald-600/50">Custom Color</h2>
                <div style={{ 
                  '--cb-primary5': '#10b981', 
                  '--cb-primary6': '#059669',
                  '--cb-primary3': '#6ee7b7' 
                } as React.CSSProperties}>
                  <CreepyButton>
                    Go Green
                  </CreepyButton>
                </div>
             </div>
          </div>

        </div>

        <footer className="text-sm text-slate-400 font-medium">
          Move your cursor around to test the eye tracking
        </footer>
      </div>
    </div>
  );
}
~~~

~~~/package.json
{
  "name": "creepy-button",
  "description": "A playful, interactive button with eyes that track the cursor",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.300.0",
    "framer-motion": "^10.16.4",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
~~~

~~~/src/Component.tsx
import React, { useRef, useState } from "react";

interface CreepyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

type Coords = {
  x: number;
  y: number;
};

export function CreepyButton({
  children,
  className,
  onClick,
  ...props
}: CreepyButtonProps) {
  const eyesRef = useRef<HTMLSpanElement>(null);
  const [eyeCoords, setEyeCoords] = useState<Coords>({ x: 0, y: 0 });

  // Calculate translate values based on state
  // Using -50% + offset% logic from the original
  const translateX = -50 + eyeCoords.x * 50;
  const translateY = -50 + eyeCoords.y * 50;
  
  const eyeStyle: React.CSSProperties = {
    transform: `translate(${translateX}%, ${translateY}%)`,
  };

  const updateEyes = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    const userEvent = "touches" in e ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
    
    // get the center of the eyes container
    if (!eyesRef.current) return;
    const eyesRect = eyesRef.current.getBoundingClientRect();
    const eyesCenter: Coords = {
      x: eyesRect.left + eyesRect.width / 2,
      y: eyesRect.top + eyesRect.height / 2,
    };
    
    const cursor: Coords = {
      x: userEvent.clientX,
      y: userEvent.clientY,
    };

    // calculate the eye angle
    const dx = cursor.x - eyesCenter.x;
    const dy = cursor.y - eyesCenter.y;
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;

    // then the pupil distance from the eye center
    const visionRangeX = 150; // Adjusted slightly for feel
    const visionRangeY = 100;
    const distance = Math.min(Math.hypot(dx, dy), 200); // Cap distance effect
    
    // Calculate normalized offset (-1 to 1 range approx)
    const x = (Math.sin(angle) * distance) / visionRangeX;
    const y = (Math.cos(angle) * distance) / visionRangeY;
    
    setEyeCoords({ x, y });
  };

  const resetEyes = () => {
    setEyeCoords({ x: 0, y: 0 });
  };

  return (
    <>
      <style>
        {`
          :root {
            --cb-hue: 223deg;
            --cb-gray1: hsl(var(--cb-hue) 10% 95%);
            --cb-gray9: hsl(var(--cb-hue) 10% 15%);
            --cb-black: hsl(0 0% 0%);
            --cb-primary3: hsl(var(--cb-hue) 90% 75%);
            --cb-primary5: hsl(var(--cb-hue) 90% 55%);
            --cb-primary6: hsl(var(--cb-hue) 90% 45%);
            --cb-trans-dur: 0.3s;
          }

          .creepy-btn {
            background-color: var(--cb-black);
            border-radius: 1.25em;
            color: var(--cb-gray1);
            cursor: pointer;
            letter-spacing: 1px;
            min-width: 9em;
            padding: 0;
            border: 0;
            outline: 0.1875em solid transparent;
            transition: outline 0.1s linear;
            -webkit-tap-highlight-color: transparent;
            font-family: "Londrina Solid", sans-serif;
            font-size: 1.5rem; /* Base size */
            position: relative;
            display: inline-block;
          }

          .creepy-btn__cover {
            background-color: var(--cb-primary5);
            box-shadow: 0 0 0 0.125em var(--cb-black) inset;
            padding: 0.5em 1em;
            border-radius: inherit;
            display: block;
            position: relative;
            z-index: 1;
            transform-origin: 1.25em 50%;
            transition:
              background-color var(--cb-trans-dur),
              transform var(--cb-trans-dur) cubic-bezier(0.65, 0, 0.35, 1);
            inset: 0;
          }

          .creepy-btn__eyes {
            position: absolute;
            display: flex;
            align-items: center;
            gap: 0.375em;
            right: 1em;
            bottom: 0.6em;
            height: 0.75em;
            z-index: 0;
            pointer-events: none; 
          }

          .creepy-btn__eye {
            animation: cb-eye-blink 3s infinite;
            background-color: var(--cb-gray1);
            border-radius: 50%;
            overflow: hidden;
            width: 0.75em;
            height: 0.75em;
            position: relative;
            display: block;
          }

          .creepy-btn__pupil {
            background-color: var(--cb-black);
            border-radius: 50%;
            display: block;
            position: absolute;
            width: 0.375em;
            height: 0.375em;
            top: 50%;
            left: 50%;
            /* Transform is handled by React state inline style */
          }

          .creepy-btn:focus-visible {
            outline: 0.1875em solid var(--cb-primary3);
          }

          .creepy-btn:hover .creepy-btn__cover {
            background-color: var(--cb-primary6);
            transform: rotate(-12deg);
            transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1.65);
          }

          .creepy-btn:focus-visible .creepy-btn__cover {
            transform: rotate(-12deg);
            transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1.65);
          }

          .creepy-btn:active .creepy-btn__cover {
            transform: rotate(0);
            transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
          }

          @keyframes cb-eye-blink {
            0%,
            92%,
            100% {
              animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
              height: 0.75em;
            }

            96% {
              animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
              height: 0;
            }
          }
        `}
      </style>
      <button
        className={`creepy-btn ${className || ""}`}
        type="button"
        onClick={onClick}
        onMouseMove={updateEyes}
        onTouchMove={updateEyes}
        onMouseLeave={resetEyes}
        {...props}
      >
        <span className="creepy-btn__eyes" ref={eyesRef}>
          <span className="creepy-btn__eye">
            <span className="creepy-btn__pupil" style={eyeStyle}></span>
          </span>
          <span className="creepy-btn__eye">
            <span className="creepy-btn__pupil" style={eyeStyle}></span>
          </span>
        </span>
        <span className="creepy-btn__cover">{children}</span>
      </button>
    </>
  );
}

export default CreepyButton;
~~~

Implementation Guidelines

1. Analyze the component structure, styling, animation implementations
2. Review the component's arguments and state
3. Think through what is the best place to adopt this component/style into the design we are doing
4. Then adopt the component/design to our current system

Help me integrate this into my design
```
