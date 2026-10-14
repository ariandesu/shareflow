# WebGL Motion Studio — 12 Practical React Three Fiber Prompts

**Product summary:** A guided set of prompts for designing and implementing efficient interactive 3D scenes and motion-led web experiences.
**Suggested price:** BDT 79 / USD 1.99 (adjust in store)
**Gumroad listing title:** WebGL Motion Studio — 12 React Three Fiber & Three.js Prompts

## Important use notes
These prompts guide implementation; they do not include licensed models, textures, fonts, or guaranteed working code. Confirm package versions and project setup before using generated code. Respect reduced-motion preferences, provide a non-WebGL fallback, and test on target devices. Don't claim performance is verified until profiling the actual page.

## Shared brief
Build an interactive [SCENE/EXPERIENCE] for [PRODUCT] using the Three.js stack already present in [PROJECT]. Inspect package manifests and current renderer before suggesting dependencies. Target [DESKTOP/MOBILE/DEVICE CLASS], with a graceful fallback for unsupported WebGL. Visual direction: [ART DIRECTION], palette [PALETTE]. User action: [INTERACTION]. Honor `prefers-reduced-motion`, provide pause/disable controls for continuous motion, handle context loss, and avoid blocking page content while the scene loads. Keep semantic text and key controls in the DOM, not embedded only in the canvas.

## 1 — Project and runtime reconnaissance
Inspect the existing project files and report its framework, Three.js/R3F versions, renderer, installed helpers, route conventions, and existing canvas components. Cite paths. Then propose the smallest viable scene architecture. Do not invent imports or add dependencies before confirming they are available.

## 2 — Lightweight hero scene
Create a hero scene containing [SUBJECT] with restrained movement and a clear focal point. Keep page headline and CTA as accessible DOM elements. Use a fixed or bounded camera, predictable lighting, and an explicit loading fallback. Include a static poster/fallback for reduced motion or unavailable WebGL. Explain which values are safe to tune.

## 3 — Particle field
Create a particle field of [COUNT RANGE] points shaped as [FORM]. Use deterministic seeded positions, typed buffers, and a single draw call where practical. Define initialization and cleanup. Avoid per-frame object allocation. Scale particle density for mobile and honor reduced motion with a still composition.

## 4 — Pointer parallax with restraint
Add subtle pointer-based camera or object parallax bounded to [MAX DEGREES/PIXELS]. Smooth input without expensive React state updates per frame. Disable on coarse-pointer/touch devices and reduced-motion mode. Ensure pointer movement never prevents scrolling, clicking, or keyboard operation.

## 5 — Scroll-triggered transitions
Create a scroll-driven scene transition across [SECTION COUNT] sections. Use the motion library already installed, if any; otherwise prefer a small requestAnimationFrame observer strategy without adding a dependency. Clamp progress, handle resize, clean up observers, and disable/replace movement for reduced-motion users. Keep each section's meaning in regular HTML text.

## 6 — Material and lighting study
Develop a material/lighting setup for [MATERIAL/OBJECT] with controlled highlights and readable silhouette. State whether textures are procedural or external; don't invent asset URLs. Keep environment maps optional. Provide a basic material fallback and name the performance tradeoffs of shadows, transparency, and postprocessing.

## 7 — Interactive object viewer
Build a viewer for [MODEL FORMAT/OBJECT] with orbit controls limited to sensible bounds, reset view, zoom limits, keyboard-operable controls, loading/error states, and a static preview. Check that model assets exist and are licensed before referencing them. Avoid auto-rotation by default; if used, provide pause and reduced-motion handling.

## 8 — GLSL shader effect
Write a [EFFECT] shader appropriate for the project's actual WebGL version. Document uniforms, coordinate spaces, color-space assumptions, and fallback. Keep shader code bounded and avoid claims of cross-device support until tested. Include a CSS or static-image alternative if shader compilation fails.

## 9 — React lifecycle and cleanup
Review a supplied R3F component for lifecycle correctness. Identify allocations in render/frame loops, event listener cleanup, geometry/material disposal, texture reuse, async asset races, canvas resize handling, and context loss. Return minimal targeted changes and a small test plan. Do not silently rewrite surrounding components.

## 10 — Mobile performance budget
Inspect the actual scene and set a provisional frame/render budget for target device [DEVICE]. Reduce DPR and effects where needed, gate expensive work by visibility, and provide lower-detail alternatives. Recommend concrete DevTools profiling steps. Label all budgets provisional until measured on device; never claim a frame rate without a real trace.

## 11 — Accessible motion and controls
Add a clear pause/play control, reduced-motion behavior, keyboard-accessible interactions, visible focus, and text descriptions for the meaningful scene. Ensure the canvas doesn't capture pointer or keyboard input unnecessarily. Continuous animation must not be required to understand or use the page.

## 12 — Production release checklist
Review the scene for asset license, lazy-loading, loading and error state, mobile fallback, WebGL context loss, reduced motion, resource cleanup, bundle impact, console errors, and real-device profiling. Return a checklist of tested vs not-yet-tested items. Don't mark tests passed unless run and evidenced.
