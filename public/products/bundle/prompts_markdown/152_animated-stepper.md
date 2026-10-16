# Animated Stepper

**Category:** UI Component  
**Tags:** ui component  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://component-3420ef1d-633b-45bb-aae4-34f413835528.preview.superdesign.dev/?projectId=477d6239-9596-4e4b-a765-cd405af71799](https://component-3420ef1d-633b-45bb-aae4-34f413835528.preview.superdesign.dev/?projectId=477d6239-9596-4e4b-a765-cd405af71799)  
**Local Standalone Preview:** `previews/animated-stepper.html`

---

## Architectural & Aesthetic Breakdown
A reusable, animated stepper component with smooth slide transitions, progress indicators, and customizable step content. Follows a minimalist aesthetic with clean lines and refined motion.

Source: ReactBits

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
You are given a task to integrate an existing React component in the codebase

~~~/README.md
# AnimatedStepper

A production-grade, minimalist stepper component with fluid Framer Motion transitions and dynamic height adjustment.

## Features
- **Fluid Motion**: Uses custom Power3 easing for professional entrance and slide transitions.
- **Dynamic Height**: The container smoothly adjusts its height to fit the content of the current step.
- **Progress Tracking**: Interactive or disabled step indicators with completion states.
- **Customizable**: Built with Tailwind CSS variables for easy theming.

## Dependencies
- `framer-motion`: ^11.0.0
- `lucide-react`: ^0.344.0

## Props

### AnimatedStepper
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Multiple `<Step>` components |
| `initialStep` | `number` | `1` | The starting step index |
| `onStepChange` | `(step: number) => void` | - | Callback when step changes |
| `onFinalStepCompleted` | `() => void` | - | Callback after clicking 'Complete' on last step |
| `backButtonText` | `string` | `"Back"` | Label for the back button |
| `nextButtonText` | `string` | `"Continue"` | Label for the next button |
| `disableStepIndicators` | `boolean` | `false` | If true, user cannot click indicators to jump steps |

### Step
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Optional title displayed at the top of the step |
| `children` | `ReactNode` | Content of the step |

## Usage

```tsx
import { AnimatedStepper, Step } from '@/sd-components/59f1e3dc-3550-45c2-aa02-048138d93ebe';

export default function MyWizard() {
  return (
    <AnimatedStepper onFinalStepCompleted={() => console.log('Done!')}>
      <Step title="Account Setup">
        <p>Your account information goes here...</p>
      </Step>
      <Step title="Preferences">
        <p>Choose your notification settings...</p>
      </Step>
    </AnimatedStepper>
  );
}
```
~~~

~~~/src/App.tsx
import React, { useState } from 'react';
import { AnimatedStepper, Step } from './Component';

export default function App() {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center font-sans">
      <AnimatedStepper 
        onFinalStepCompleted={() => alert('Wizard Completed!')}
      >
        <Step title="Step 1: Introduction">
          <p className="mb-4">Welcome to the minimalist stepper showcase. This component is built for production-grade interfaces with a focus on fluid motion.</p>
          <div className="h-32 w-full rounded-2xl bg-secondary/50 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">Custom visual content here</span>
          </div>
        </Step>
        
        <Step title="Step 2: Interactive Input">
          <p className="mb-4">Forms and inputs integrate seamlessly with the dynamic height adjustment of the stepper container.</p>
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground block">Your Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your name..."
              className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </Step>
        
        <Step title="Step 3: Final Review">
          <p className="mb-2 text-lg">Almost there, {name || 'Explorer'}!</p>
          <p className="text-muted-foreground">Confirm your choices and complete the setup. The animations use high-end Power3 easing for that premium feel.</p>
          <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">User Status</span>
              <span className="text-primary font-bold">Ready</span>
            </div>
          </div>
        </Step>
      </AnimatedStepper>
    </div>
  );
}
~~~

~~~/package.json
{
  "name": "animated-stepper",
  "description": "A minimalist, production-grade animated stepper component",
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  }
}
~~~

~~~/src/Component.tsx
/**
 * AnimatedStepper Component
 * A reusable multi-step indicator and content container with smooth Framer Motion transitions.
 * 
 * Features:
 * - Slide transitions between steps
 * - Dynamic height adjustment
 * - Progress indicators with completion states
 * - Fully customizable step content via <Step> sub-component
 * - Responsive design following minimalist principles
 */

import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

export function AnimatedStepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className={`flex min-h-[400px] w-full flex-col items-center justify-center p-4 sm:p-8 ${rest.className || ''}`}
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] ${stepCircleContainerClassName}`}
      >
        {/* Indicators */}
        <div className={`flex w-full items-center p-8 pb-4 ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content Area */}
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-4 px-8 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {/* Footer Actions */}
        {!isCompleted && (
          <div className={`px-8 pb-8 pt-4 ${footerClassName}`}>
            <div className={`flex items-center ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-foreground/80 text-muted-foreground ${
                    currentStep === 1 ? 'pointer-events-none opacity-0' : 'opacity-100'
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold tracking-tight text-primary-foreground transition-all duration-300 hover:opacity-90 active:scale-95"
                {...nextButtonProps}
              >
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Step Content Wrapper with dynamic height and slide animation
 */
function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = ''
}: {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}) {
  const [parentHeight, setParentHeight] = useState<number>(0);
  
  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight || 'auto' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={h => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }: {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 20 : -20,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -20 : 20,
    opacity: 0
  })
};

/**
 * Step Sub-component for individual step content
 */
export function Step({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="py-4">
      {title && <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">{title}</h2>}
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

/**
 * Step Indicator Circle
 */
function StepIndicator({ 
  step, 
  currentStep, 
  onClickStep, 
  disableStepIndicators = false 
}: {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  
  return (
    <motion.div
      onClick={() => !disableStepIndicators && onClickStep(step)}
      className={`relative flex items-center justify-center ${!disableStepIndicators ? 'cursor-pointer' : ''}`}
      animate={status}
    >
      <motion.div
        variants={{
          inactive: { 
            scale: 1, 
            backgroundColor: 'hsl(var(--secondary))', 
            color: 'hsl(var(--muted-foreground))',
            borderColor: 'hsl(var(--border))'
          },
          active: { 
            scale: 1, 
            backgroundColor: 'hsl(var(--background))', 
            color: 'hsl(var(--primary))',
            borderColor: 'hsl(var(--primary))'
          },
          complete: { 
            scale: 1, 
            backgroundColor: 'hsl(var(--primary))', 
            color: 'hsl(var(--primary-foreground))',
            borderColor: 'hsl(var(--primary))'
          }
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors duration-300"
      >
        {status === 'complete' ? (
          <Check className="h-5 w-5" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </motion.div>
      
      {status === 'active' && (
        <motion.div
          layoutId="active-glow"
          className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

/**
 * Connector line between indicators
 */
function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-4 h-[2px] flex-1 overflow-hidden rounded-full bg-border">
      <motion.div
        className="absolute inset-0 bg-primary origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isComplete ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      />
    </div>
  );
}

export default AnimatedStepper;
~~~

Implementation Guidelines

1. Analyze the component structure, styling, animation implementations
2. Review the component's arguments and state
3. Think through what is the best place to adopt this component/style into the design we are doing
4. Then adopt the component/design to our current system

Help me integrate this into my design
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
