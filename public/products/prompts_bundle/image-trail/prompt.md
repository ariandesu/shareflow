# Image Trail

- **Category:** UI Component
- **Slug:** `image-trail`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** ui component, landing page

---

## Architectural Philosophy & Overview
A premium minimalist showcase for a high-end image trail animation effect. Features multiple animation variants (lerp-based movement, scaling, brightness shifts, 3D rotations) with a clean, editorial aesthetic.

Source: ReactBits

---

## Production System Prompt Specification
```
You are given a task to integrate an existing React component in the codebase

~~~/README.md
# ImageTrail Showcase

A premium, interactive image trail animation system powered by GSAP. Designed for high-end digital experiences that require tactile, fluid interaction.

## Features
- **8 Distinct Animation Variants**: From basic lerp to 3D perspective and directional motion blur.
- **High Performance**: Optimized GSAP timelines with canvas-grade responsiveness.
- **Minimalist Aesthetic**: Clean editorial layout with floating containers and soft shadows.
- **Fully Responsive**: Works with mouse and touch events.

## Dependencies
- `gsap`: ^3.12.5
- `framer-motion`: ^11.0.0
- `lucide-react`: ^0.454.0

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `string[]` | `[]` | Array of image URLs to display in the trail |
| `variant` | `number` | `1` | Animation style (1-8) |
| `threshold` | `number` | `80` | Distance in pixels mouse must move to trigger next image |

## Usage
```tsx
import { ImageTrail } from '@/sd-components/f308db27-073d-452f-95ac-7700415b625a';

function MyGallery() {
  const images = [
    'https://picsum.photos/id/101/600/600',
    'https://picsum.photos/id/102/600/600',
    // ...
  ];

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <ImageTrail 
        items={images} 
        variant={2} 
        threshold={100} 
      />
    </div>
  );
}
```
~~~

~~~/src/App.tsx
import React, { useState } from 'react';
import { ImageTrail } from './Component';

/**
 * ImageTrailShowcase Demo
 * 
 * Demonstrates the premium minimalist showcase style for the ImageTrail effect.
 * Uses an editorial monochrome palette with a single accent color.
 */
export default function App() {
  const [variant, setVariant] = useState(1);
  const [key, setKey] = useState(0);

  const images = [
    'https://picsum.photos/id/287/600/600',
    'https://picsum.photos/id/1001/600/600',
    'https://picsum.photos/id/1025/600/600',
    'https://picsum.photos/id/1026/600/600',
    'https://picsum.photos/id/1027/600/600',
    'https://picsum.photos/id/1028/600/600',
    'https://picsum.photos/id/1029/600/600',
    'https://picsum.photos/id/1030/600/600',
    'https://picsum.photos/id/1031/600/600',
    'https://picsum.photos/id/1032/600/600',
    'https://picsum.photos/id/1033/600/600',
    'https://picsum.photos/id/1035/600/600',
  ];

  const variants = [
    { id: 1, name: 'Classic Lerp' },
    { id: 2, name: 'Luminous Bloom' },
    { id: 3, name: 'Ethereal Ascent' },
    { id: 4, name: 'Motion Drift' },
    { id: 5, name: 'Angular Flow' },
    { id: 6, name: 'Kinetic Blur' },
    { id: 7, name: 'Depth Stack' },
    { id: 8, name: '3D Perspective' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-20 font-sans text-[#1A1A1B]">
      {/* Editorial Header */}
      <div className="mb-12 text-center max-w-2xl">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          {variants.find(v => v.id === variant)?.name}
        </h1>
        <p className="text-muted-foreground font-light text-lg">
          Move your cursor across the frame to reveal the trail.
        </p>
      </div>

      {/* Main Canvas Container */}
      <div className="relative w-full max-w-4xl aspect-video bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border-none overflow-hidden cursor-crosshair group">
        <ImageTrail key={key} items={images} variant={variant} />
        
        {/* Subtle Branding/Instruction */}
        <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground pointer-events-none">
          Interactive Motion Showcase — v1.0
        </div>
      </div>

      {/* Navigation / Controls */}
      <div className="mt-16 flex flex-wrap justify-center gap-3">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setVariant(v.id);
              setKey(prev => prev + 1);
            }}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              variant === v.id
                ? 'bg-[#1A1A1B] text-white shadow-lg'
                : 'bg-white text-[#1A1A1B] border border-transparent hover:border-[#1A1A1B] shadow-sm'
            }`}
          >
            {v.id}
          </button>
        ))}
        
        <button
          onClick={() => setKey(prev => prev + 1)}
          className="ml-4 px-6 py-2.5 rounded-full text-sm font-medium bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Replay
        </button>
      </div>

      {/* Style Guide Enforcement Note */}
      <div className="fixed bottom-10 right-10 text-[10px] uppercase tracking-[0.3em] font-semibold text-[#1A1A1B]/20 pointer-events-none vertical-text">
        Minimalist Showcase
      </div>
    </div>
  );
}
~~~

~~~/package.json
{
  "name": "image-trail-showcase",
  "description": "A high-end interactive image trail component with multiple GSAP-powered animation variants.",
  "dependencies": {
    "gsap": "^3.12.5",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.454.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  }
}
~~~

~~~/src/Component.tsx
/**
 * ImageTrail Component
 * 
 * A high-performance image trail animation system powered by GSAP.
 * Supports multiple visual variants:
 * 1. Basic Lerp Trail
 * 2. Brightness & Scale Bloom
 * 3. Physics-like Upward Ejection
 * 4. Directional Motion Blur
 * 5. Rotational Trail
 * 6. Speed-based Size/Blur
 * 7. Infinite Stack Trail
 * 8. 3D Perspective Trail
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): { x: number; y: number } {
  let clientX = 0,
    clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    const mouseEv = e as MouseEvent;
    clientX = mouseEv.clientX;
    clientY = mouseEv.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null } = {
    el: null as unknown as HTMLDivElement,
    inner: null
  };
  public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 };
  public rect: DOMRect | null = null;
  private resize!: () => void;

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner');
    this.getRect();
    this.initEvents();
  }

  private initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }

  private getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  public destroy() {
    window.removeEventListener('resize', this.resize);
  }
}

abstract class ImageTrailBase {
  protected container: HTMLDivElement;
  protected images: ImageItem[];
  protected imagesTotal: number;
  protected imgPosition: number = 0;
  protected zIndexVal: number = 1;
  protected activeImagesCount: number = 0;
  protected isIdle: boolean = true;
  protected threshold: number = 80;
  protected mousePos: { x: number; y: number } = { x: 0, y: 0 };
  protected lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  protected cacheMousePos: { x: number; y: number } = { x: 0, y: 0 };
  private rafId: number | null = null;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLDivElement));
    this.imagesTotal = this.images.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };

    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
  }

  protected abstract render(): void;
  protected abstract showNextImage(): void;

  protected onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  protected onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }

  public destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.images.forEach(img => img.destroy());
  }
}

class ImageTrailVariant1 extends ImageTrailBase {
  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 1, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
    }, {
      duration: 0.4, ease: 'power1',
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2
    }, 0)
    .to(img.DOM.el, {
      duration: 0.4, ease: 'power3', opacity: 0, scale: 0.2
    }, 0.4);
  }
}

class ImageTrailVariant2 extends ImageTrailBase {
  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
    }, {
      duration: 0.4, ease: 'power1', scale: 1,
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2
    }, 0)
    .fromTo(img.DOM.inner, { scale: 2.8, filter: 'brightness(250%)' }, {
      duration: 0.4, ease: 'power1', scale: 1, filter: 'brightness(100%)'
    }, 0)
    .to(img.DOM.el, {
      duration: 0.4, ease: 'power2', opacity: 0, scale: 0.2
    }, 0.45);
  }
}

class ImageTrailVariant3 extends ImageTrailBase {
  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal,
      xPercent: 0, yPercent: 0,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
    }, {
      duration: 0.4, ease: 'power1', scale: 1,
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2
    }, 0)
    .to(img.DOM.el, {
      duration: 0.6, ease: 'power2', opacity: 0, scale: 0.2,
      xPercent: () => gsap.utils.random(-30, 30),
      yPercent: -200
    }, 0.6);
  }
}

class ImageTrailVariant4 extends ImageTrailBase {
  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist !== 0) { dx /= dist; dy /= dist; }
    dx *= dist / 100;
    dy *= dist / 100;

    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
    }, {
      duration: 0.4, ease: 'power1', scale: 1,
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2
    }, 0)
    .fromTo(img.DOM.inner, {
      scale: 2,
      filter: `brightness(${Math.max((400 * dist) / 100, 100)}%) contrast(${Math.max((400 * dist) / 100, 100)}%)`
    }, {
      duration: 0.4, ease: 'power1', scale: 1, filter: 'brightness(100%) contrast(100%)'
    }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power3', opacity: 0 }, 0.4)
    .to(img.DOM.el, { duration: 1.5, ease: 'power4', x: `+=${dx * 110}`, y: `+=${dy * 110}` }, 0.05);
  }
}

class ImageTrailVariant5 extends ImageTrailBase {
  private lastAngle: number = 0;

  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    let startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist !== 0) { dx /= dist; dy /= dist; }
    dx *= dist / 150; dy *= dist / 150;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, filter: 'brightness(80%)', scale: 0.1, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2,
      rotation: startAngle
    }, {
      duration: 1, ease: 'power2', scale: 1, filter: 'brightness(100%)',
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2 + dx * 70,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2 + dy * 70,
      rotation: this.lastAngle
    }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'expo', opacity: 0 }, 0.5)
    .to(img.DOM.el, { duration: 1.5, ease: 'power4', x: `+=${dx * 120}`, y: `+=${dy * 120}` }, 0.05);
  }
}

class ImageTrailVariant6 extends ImageTrailBase {
  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    const dx = this.mousePos.x - this.cacheMousePos.x;
    const dy = this.mousePos.y - this.cacheMousePos.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    
    const scaleFactor = 0.3 + (1.7) * Math.min(speed / 200, 1);
    const brightnessValue = 1 + (0.3) * Math.min(speed / 70, 1);
    const blurValue = 20 * (1 - Math.min(speed / 90, 1));
    const grayscaleValue = 1 * (1 - Math.min(speed / 90, 1));

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
    }, {
      duration: 0.8, ease: 'power3', scale: scaleFactor,
      filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2
    }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power3.in', opacity: 0, scale: 0.2 }, 0.45);
  }
}

class ImageTrailVariant7 extends ImageTrailBase {
  private visibleImagesCount: number = 0;
  private visibleImagesTotal: number = 9;

  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    ++this.visibleImagesCount;
    gsap.killTweensOf(img.DOM.el);
    const scaleValue = gsap.utils.random(0.5, 1.6);
    
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      scale: scaleValue - 0.4, rotationZ: 0, opacity: 1, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
    }, {
      duration: 0.4, ease: 'power3', scale: scaleValue,
      rotationZ: gsap.utils.random(-3, 3),
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2
    }, 0);

    if (this.visibleImagesCount >= this.visibleImagesTotal) {
      const lastInQueue = (this.imgPosition - this.visibleImagesTotal + this.imagesTotal) % this.imagesTotal;
      const oldImg = this.images[lastInQueue];
      gsap.to(oldImg.DOM.el, { duration: 0.4, ease: 'power4', opacity: 0, scale: 1.3 });
    }
  }
}

class ImageTrailVariant8 extends ImageTrailBase {
  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  protected showNextImage() {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;
    
    const rotX = -(relY / centerY) * 30;
    const rotY = (relX / centerX) * 30;
    const distFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const zValue = (distFromCenter / maxDist) * 1200 - 600;
    const brightness = 0.2 + ((zValue + 600) / 1200) * 2.3;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .set(this.container, { perspective: 1000 })
    .fromTo(img.DOM.el, {
      opacity: 1, z: 0, scale: 1 + zValue / 1000, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2,
      rotationX: rotX, rotationY: rotY, filter: `brightness(${brightness})`
    }, {
      duration: 1, ease: 'expo', scale: 1 + zValue / 1000,
      x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
      y: this.mousePos.y - (img.rect?.height ?? 0) / 2,
      rotationX: rotX, rotationY: rotY
    }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power2', opacity: 0, z: -800 }, 0.3);
  }
}

const variantMap: Record<number, any> = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
  3: ImageTrailVariant3,
  4: ImageTrailVariant4,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6,
  7: ImageTrailVariant7,
  8: ImageTrailVariant8
};

export interface ImageTrailProps {
  /** Array of image URLs to trail */
  items: string[];
  /** Animation variant (1-8) */
  variant?: number;
  /** Custom threshold for triggering next image (distance in px) */
  threshold?: number;
}

/**
 * ImageTrail Component
 * 
 * Renders a sequence of images that follow the cursor with various animation effects.
 * Perfect for landing pages, portfolio showcases, or editorial interactive sections.
 */
export function ImageTrail({ items = [], variant = 1, threshold = 80 }: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const Cls = variantMap[variant] || variantMap[1];
    instanceRef.current = new Cls(containerRef.current);
    
    // Set threshold if custom
    if (instanceRef.current && threshold !== 80) {
      instanceRef.current.threshold = threshold;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, [variant, items, threshold]);

  return (
    <div 
      className="w-full h-full relative z-[100] rounded-lg bg-transparent overflow-visible touch-none" 
      ref={containerRef}
    >
      {items.map((url, i) => (
        <div
          className="content__img w-[190px] aspect-[1.1] rounded-[15px] absolute top-0 left-0 opacity-0 overflow-hidden [will-change:transform,filter] shadow-2xl"
          key={i}
        >
          <div
            className="content__img-inner bg-center bg-cover w-[calc(100%+20px)] h-[calc(100%+20px)] absolute top-[-10px] left-[-10px]"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}

export default ImageTrail;
~~~

Implementation Guidelines

1. Analyze the component structure, styling, animation implementations
2. Review the component's arguments and state
3. Think through what is the best place to adopt this component/style into the design we are doing
4. Then adopt the component/design to our current system

Help me integrate this into my design
```
