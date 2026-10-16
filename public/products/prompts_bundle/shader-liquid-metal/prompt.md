# Shader: Liquid Metal

- **Category:** Animation
- **Slug:** `shader-liquid-metal`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** shader, webgl, glsl, animated, animation, background, hero, generative, liquidmetal, blobs, dark-mode, landing, landing-page, saas, ai, portfolio, desktop, responsive

---

## Architectural Philosophy & Overview
A single ANIMATED WEBGL SHADER: Liquid Metal, a steep value ramp with a narrow specular. A warped field taken through a steep smoothstep, a narrow eighth-power highlight band and a cubed dark term, with no chroma anywhere at all. It is a full-bleed fragment shader with no page around it, about 4KB, no textures, no images and no animation library, and it reacts to the pointer. Drop it behind a hero, a section or a whole page as a living background. Under prefers-reduced-motion it renders one static frame, and it falls back cleanly where WebGL is absent.

---

## Production System Prompt Specification
```
{"summary": "A full-viewport animated WebGL fragment shader called Liquid Metal: a steep value ramp with a narrow specular. A warped field taken through a steep smoothstep, a narrow eighth-power highlight band and a cubed dark term, with no chroma anywhere at all. The page contains nothing but the canvas. A shared GLSL preamble provides a hashed value noise, a six-octave fbm and a two-level domain-warp helper; this effect draws on them and adds its own body. Pointer movement raises a smoothed intensity uniform so the effect strengthens under the cursor and relaxes when it leaves.", "style": {"description": "Generative light on a committed ground. Every colour is computed per pixel from a clock and a coordinate; nothing is sampled from an image.", "prompt": "Ground #0F0F0F with accents [\"#F5F5F5\", \"#0A0A0A\"]. There is no typography and no page chrome: the shader is the entire surface. Keep the palette to two or three values so the effect reads as one material rather than a rainbow."}, "layout_and_structure": {"description": "A single full-viewport canvas, fixed to the viewport, with a hidden fallback panel behind it.", "prompts": [{"part": "Canvas", "prompt": "One canvas fixed at inset 0 filling the viewport, with html and body at 100 percent height, margin 0 and overflow hidden. Behind it a hidden panel that is only shown when no WebGL context can be created."}, {"part": "The shader", "prompt": "A steep value ramp with a narrow specular. A warped field taken through a steep smoothstep, a narrow eighth-power highlight band and a cubed dark term, with no chroma anywhere at all."}]}, "special_ui_components": ["Full-bleed fragment shader with no surrounding page", "Smoothed pointer-intensity uniform", "No-WebGL fallback panel", "Reduced-motion single-frame path"], "implementation_notes": "Chrome is a value ramp, not a colour. Adding hue to this immediately reads as plastic. Build one WebGL program, draw two triangles, and pass resolution, time and an intensity uniform. Cap the drawing buffer below device pixel ratio (this one uses 0.85 to 0.95 of a 1.5x cap) because two-level warping costs about 18 noise samples per pixel. Under prefers-reduced-motion draw exactly one frame and never start the loop. Verification note: readPixels on a live WebGL canvas returns zeros because it reads the back buffer after present, so judge from a rendered screenshot rather than sampled pixels."}
```
