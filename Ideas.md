# Portfolio Ideas & Experiments

---

## 2026-03-29 — Moon to Sun Theme Transition

### Concept

Create an interactive theme switcher where the moon transitions into the sun.

### Behavior

* User clicks the moon
* Moon moves downward out of view
* Background transitions from dark blue → orange/red → white/light
* Sun rises from bottom after moon disappears

### Visual Details

* Use pure CSS (no SVG)
* Build sun using border-radius and background
* Smooth easing for all movements

### Enhancements

* Add clouds instead of rain
* Clouds appear during transition and move slightly
* Light glow effect on sun

### Tech Notes

* Keep animation smooth and minimal
* Focus on visual clarity


-----------------------------------------------------------------------------------------

## 2026-03-31 — Interactive Background Depth

### Concept

Create a background that reacts to cursor movement to simulate depth.

### Behavior

* Background shifts slightly with mouse movement
* Elements move at different speeds

### Details

* Keep movement subtle
* Avoid performance-heavy calculations

### Tech Notes

* Use mousemove event
* Apply transform: translate for layers
