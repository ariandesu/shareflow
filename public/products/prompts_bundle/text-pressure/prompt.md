# Text Pressure

- **Category:** Animation
- **Slug:** `text-pressure`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** animation, text animation

---

## Architectural Philosophy & Overview
A typography component where characters react to mouse proximity by changing weight and width using variable font axes (pressure-sensitive effect).

---

## Production System Prompt Specification
```
Create a React component called TextPressure that implements a "pressure-sensitive" typography effect. When the user moves their mouse over the text, the characters nearest to the cursor should visually "expand" and "weight up" using Variable Font technology.

# Key Requirements

1. Variable Font Usage:

   - You MUST use a variable font that supports wght (Weight), wdth (Width), and ital (Italic) axes.

   - Inject the @font-face dynamically or via a style tag.

2. Proximity Logic:

   - The component should track the mouse cursor position globally (window event) or locally.

   - For every character in the text string, calculate the Euclidean distance between the cursor and the center of that specific character bounding box.

   - Use requestAnimationFrame to ensure this calculation runs at 60fps without lag.

3. Interpolation (The "Pressure" Math):

   - Define a maxDistance (influence radius).

   - If the cursor is within maxDistance of a character:

     - Map the distance (0 to max) to the font variation axes.

     - Closer = Higher Weight (e.g., 900), Wider Width (e.g., 100), Higher Slant.

     - Further = Lower Weight (e.g., 100), Narrower Width (e.g., 50), No Slant.

   - Use CSS `font-variation-settings
```
