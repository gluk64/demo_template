# MOTION SPEC
### [APP_NAME] — Version 1.0
### Animation System and Interaction Physics

---

## MOTION PHILOSOPHY

### The Three Laws

**Law 1: Motion carries meaning.**
Every animation must communicate something — a state change, a relationship, a progression. If removing the animation would lose information, it's justified. If not, remove it.

**Law 2: Motion respects attention.**
The user's eye is a finite resource. Animations that compete for attention dilute the message. One thing moves at a time. One thing draws focus at a time.

**Law 3: Motion serves continuity.**
Animations connect states. They show where something came from and where it went. They are the conjunctions in the visual sentence.

---

## TIMING SYSTEM

### Duration Scale

| Token | Duration | Use case |
|-------|----------|----------|
| Instant | 80ms | Micro-interactions: button press, checkbox tick |
| Fast | 120ms | Color transitions, hover states, icon morphs |
| Normal | 200ms | State transitions, card reveals |
| Enter | 220ms | Element entrance animations |
| Exit | 150ms | Element exit animations (always faster than enter) |
| Slow | 300ms | Complex reveals, multi-element staggers |
| Page | 400ms | Route transitions (maximum allowed) |

### Easing Vocabulary

| Name | Value | Use |
|------|-------|-----|
| Ease Out | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Entering elements (decelerating) |
| Ease In | `cubic-bezier(0.4, 0.0, 1, 1)` | Exiting elements (accelerating) |
| Standard | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Moving elements, state changes |

### Permanently Banned Easings

| Easing | Why banned |
|--------|-----------|
| `spring()` | Playful, not institutional |
| `bounce` | Consumer-grade, undermines trust |
| Any elastic | Overshooting suggests instability |
| `linear` | Mechanical, not human |
| `ease` (CSS default) | Too generic, imprecise |

---

## ANIMATION CATALOG

### 1. Route Transitions

```typescript
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

const pageTransition = {
  duration: 0.22,
  ease: [0.0, 0.0, 0.2, 1],
}
```

**Direction rule:** Forward navigation moves content UP (y: 8 → 0). Back navigation moves content DOWN (y: -8 → 0).

### 2. Button Press

```typescript
whileTap={{ scale: 0.98 }}
transition={{ duration: 0.08 }}
```

No color flash. No ripple. Just a subtle scale to confirm the press was registered.

### 3. Copy Button Morph

```typescript
// Icon morphs: copy → checkmark → copy
const sequence = [
  { icon: 'check', color: 'success', delay: 0 },
  { icon: 'copy', color: 'secondary', delay: 1200 },
]
```

Duration: 100ms for each morph. Total cycle: 1400ms. Never use a toast for copy confirmation.

### 4. List Item Insertion

```typescript
const itemVariants = {
  initial: { opacity: 0, height: 0, marginBottom: 0 },
  animate: {
    opacity: 1,
    height: 'auto',
    marginBottom: 8,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.15, delay: 0.05 },
    },
  },
}
```

New items appear at the top with height expansion, then fade in.

### 5. Status Morph

```typescript
// Status indicator transitions between states
const statusVariants = {
  pending: { backgroundColor: 'var(--text-secondary)', scale: 1 },
  confirmed: { backgroundColor: 'var(--success)', scale: [1, 1.2, 1] },
  failed: { backgroundColor: 'var(--error)', scale: 1 },
}
```

### 6. Hero Value Update

```typescript
// Balance changes with a brief highlight
const highlightVariants = {
  updated: {
    color: ['var(--text-primary)', 'var(--accent)', 'var(--text-primary)'],
    transition: { duration: 0.6, times: [0, 0.3, 1] },
  },
}
```

### 7. Private Mode Toggle

```typescript
// Blur transition
const blurVariants = {
  visible: { filter: 'blur(0px)', transition: { duration: 0.2 } },
  hidden: { filter: 'blur(8px)', transition: { duration: 0.2 } },
}
```

### 8. Modal Open/Close

```typescript
// Overlay
const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}

// Content
const modalVariants = {
  closed: { opacity: 0, scale: 0.96, y: 8 },
  open: { opacity: 1, scale: 1, y: 0 },
}

const modalTransition = {
  enter: { duration: 0.2, ease: [0.0, 0.0, 0.2, 1] },
  exit: { duration: 0.15, ease: [0.4, 0.0, 1, 1] },
}
```

### 9. Form Validation Feedback

```typescript
// Error message entrance
const errorVariants = {
  initial: { opacity: 0, height: 0, y: -4 },
  animate: { opacity: 1, height: 'auto', y: 0 },
  exit: { opacity: 0, height: 0, y: -4 },
}

const errorTransition = { duration: 0.15 }
```

### 10. Toast Notifications

```typescript
const toastVariants = {
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
}

const toastTransition = {
  enter: { duration: 0.2, ease: [0.0, 0.0, 0.2, 1] },
  exit: { duration: 0.15, ease: [0.4, 0.0, 1, 1] },
}
```

Auto-dismiss: 4 seconds for info/success, 6 seconds for errors.

---

## FRAMER MOTION IMPLEMENTATION GUIDE

### Standard Component Pattern

```typescript
import { motion, useReducedMotion } from 'framer-motion'

export const AnimatedComponent = ({ children }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### AnimatePresence for Exits

```typescript
<AnimatePresence mode="wait">
  <motion.div key={currentStep} {...variants}>
    {content}
  </motion.div>
</AnimatePresence>
```

---

## REDUCED MOTION FALLBACK

**Every Framer Motion component must respect `prefers-reduced-motion`:**

```typescript
const shouldReduceMotion = useReducedMotion()

// Reduced motion: opacity-only transitions, max 100ms
// Full motion: translate + opacity, standard timing
```

---

## PERFORMANCE GUIDELINES

- All animations use `transform` and `opacity` only (GPU-composited properties)
- Never animate `width`, `height`, `top`, `left`, or `margin`
- Use `layoutId` for shared element transitions
- `will-change: transform` only on elements that animate frequently
- Stagger delays never exceed 300ms total

---

## ANIMATION TESTING

Every animation must pass these checks:

1. **The Delete Test:** Remove the animation. Did the user lose information? If not, the animation is decorative — remove it.
2. **The 2x Speed Test:** Play at double speed. Does it still communicate? If not, the timing is too slow.
3. **The Reduced Motion Test:** Does the component still function with `prefers-reduced-motion: reduce`?
4. **The Repeat Test:** Trigger the animation 10 times in a row. Is it irritating? If so, simplify.
