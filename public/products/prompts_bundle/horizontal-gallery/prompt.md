# Horizontal Gallery

- **Category:** Animation
- **Slug:** `horizontal-gallery`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** animation, scroll animation

---

## Architectural Philosophy & Overview
A sticky section that locks vertical scroll and translates it into horizontal movement to showcase a gallery. Features robust GSAP ScrollTrigger initialization.

---

## Production System Prompt Specification
```
Create a 'sticky' section where the vertical scroll locks, and the content slides horizontally to showcase a gallery. 

**Technical Requirement**: Ensure the GSAP initialization is robust. Since this is a React component, please include a small delay or safety check inside useLayoutEffect to ensure the DOM is fully rendered and widths are accurate before the ScrollTrigger calculates the pinning logic.
```
