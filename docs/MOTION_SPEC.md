# MOTION SPECIFICATION
### Not a Bank — Version 2.0
### Animation System and Interaction Physics

> Motion in this product is not decoration. It is information. Every animation must justify its existence by answering: "What does this teach the user about what just changed?"

---

## MOTION PHILOSOPHY

### The Three Laws of Motion

**Law 1: Motion Carries Meaning**
Every animated state change communicates a relationship: spatial (where did this come from?), temporal (when did this happen?), or causal (what triggered this?). Decorative animation is permanently banned.

**Law 2: Motion Respects Attention**
Financial interfaces demand focus. Animation that steals attention from the user's primary task is a failure. Transitions must be felt, not watched.

**Law 3: Motion Serves Continuity**
The user's mental model of the UI should never be disrupted. Animation explains changes rather than creating surprises. If removing the animation would cause confusion, it belongs. If removing it would simplify, remove it.

---

## TIMING SYSTEM

### Duration Scale

```
Instant:   80ms   → Button press, checkbox tick, toggle flip
Fast:     120ms   → Badge state change, input focus ring, icon swap
Normal:   200ms   → Card appearance, inline message, status change
Slow:     300ms   → Modal content fade, route preparation
Enter:    220ms   → Elements entering the DOM
Exit:     150ms   → Elements leaving the DOM (always faster than enter)
Page:     280ms   → Route transitions
```

**Rule: Exit is always faster than Enter.** Delays on exit feel like the interface is fighting the user. Quick exits, deliberate entrances.

**Rule: Maximum 400ms.** Any animation exceeding 400ms must include visible progress indication or will be cut.

### Easing Vocabulary

```
ease-enter:    cubic-bezier(0.0, 0.0, 0.2, 1)   — Decelerate into final position
ease-exit:     cubic-bezier(0.4, 0.0, 1, 1)     — Accelerate away from current position
ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1)   — Standard element movement
ease-emphasis: cubic-bezier(0.2, 0.0, 0.0, 1)   — High-deceleration for important moments
```

**Permanently banned:**
- `ease-bounce` — no spring, no overshoot, no elastic
- `ease-in-out` (CSS keyword) — too symmetric, use standard instead
- Linear easing for UI transitions — mechanical, unnatural

---

## ANIMATION CATALOG

### 1. Route Transitions

**Pattern:** Fade + subtle vertical translate

**Enter:**
```typescript
initial: { opacity: 0, y: 8 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }
```

**Exit:**
```typescript
exit: { opacity: 0, y: -4 }
transition: { duration: 0.15, ease: [0.4, 0.0, 1, 1] }
```

**Rules:**
- Y displacement: max 8px enter, max 4px exit (subtle, not dramatic)
- Never scale during route transitions
- Never use X-axis translation for routes (implies back/forward navigation only)
- `AnimatePresence` with `mode="wait"` — never overlap old and new routes

---

### 2. Button Press

**Pattern:** Scale compression on press, release

```typescript
whileTap: { scale: 0.97 }
transition: { duration: 0.08, ease: [0.4, 0.0, 0.2, 1] }
```

**Color transition (hover):**
```css
transition: background-color 120ms cubic-bezier(0.4, 0.0, 0.2, 1),
            color 120ms cubic-bezier(0.4, 0.0, 0.2, 1),
            border-color 120ms cubic-bezier(0.4, 0.0, 0.2, 1);
```

**Disabled state:**
- No transform animation
- No hover state
- `cursor: not-allowed`
- `opacity: 0.4` (not animated — instant)

---

### 3. Copy Button Morph

**Pattern:** Icon morphs from copy → checkmark → copy

**Implementation using AnimatePresence + key swap:**
```typescript
// Phase 1 (0ms): Copy icon exits
exit: { opacity: 0, scale: 0.6 }
transition: { duration: 0.1, ease: [0.4, 0.0, 1, 1] }

// Phase 2 (100ms): Checkmark enters
initial: { opacity: 0, scale: 0.6 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.12, ease: [0.0, 0.0, 0.2, 1] }

// Color shift at same time:
// --text-secondary → --success (120ms transition)

// Phase 3 (1200ms hold): Begin reverse
// Phase 4 (1400ms): Color returns --success → --text-secondary
// Phase 5 (1500ms): Icon swaps back
```

**Rule:** Never use a toast notification for copy feedback. The inline morph is sufficient and less disruptive.

---

### 4. Activity Feed Insertion (Optimistic Transaction)

**Pattern:** New item slides in from top, pushing existing items down

**New item enter:**
```typescript
initial: { opacity: 0, height: 0, y: -8 }
animate: { opacity: 1, height: 'auto', y: 0 }
transition: { 
  duration: 0.22, 
  ease: [0.0, 0.0, 0.2, 1],
  height: { duration: 0.18 }
}
```

**Existing items:**
```typescript
layout: true  // Framer Motion layout animation
transition: { duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }
```

**Rule:** `layout` prop on `motion.li` elements enables automatic position animation when items above insert. This creates the "push down" effect without manual coordination.

---

### 5. Transaction Status Morph (Pending → Confirmed / Failed)

**Pattern:** Status indicator morphs in place

**Status dot + label:**
```typescript
// Pending: pulsing dot
animate: { opacity: [0.4, 1, 0.4] }
transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }

// On confirmation: pulse stops, color transitions
// '--pending' → '--success' or '--error'
transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }
```

**Amount display on confirmation:**
```typescript
// Brief highlight flash on confirmed amount
keyframes: { 
  '0%': { color: 'var(--text-primary)' },
  '30%': { color: 'var(--success)' },
  '100%': { color: 'var(--text-primary)' }
}
duration: 600ms
```

---

### 6. Balance Hero Update

**Pattern:** Number transition with subtle flash

**Trigger:** Balance changes due to incoming/outgoing transaction

```typescript
// The amount text flashes to brand accent briefly
// Implementation: CSS animation on the amount wrapper

@keyframes balance-flash {
  0%   { color: var(--text-primary); }
  25%  { color: var(--accent-primary); }
  100% { color: var(--text-primary); }
}

animation: balance-flash 500ms ease-out;
```

**Number counting animation:**
```typescript
// Use Framer Motion useMotionValue + useTransform
// Animate from old value to new value over 400ms
// Display with Intl.NumberFormat on every frame
transition: { duration: 0.4, ease: [0.0, 0.0, 0.2, 1] }
```

---

### 7. Private Mode Toggle

**Pattern:** Blur fade in/out with opacity shift

**Enter private mode:**
```css
filter: blur(8px);
transition: filter 200ms ease-out, opacity 200ms ease-out;
opacity: 0.5;
```

**Exit private mode:**
```css
filter: blur(0px);
opacity: 1;
transition: filter 200ms ease-out, opacity 150ms ease-out;
```

**Stagger:** Multiple amount elements stagger by 30ms each (top-to-bottom).

---

### 8. Modal Open/Close

**Overlay:**
```typescript
initial: { opacity: 0 }
animate: { opacity: 1 }
exit:    { opacity: 0 }
transition: { duration: 0.15 }
```

**Modal container:**
```typescript
initial: { opacity: 0, scale: 0.96, y: 8 }
animate: { opacity: 1, scale: 1, y: 0 }
exit:    { opacity: 0, scale: 0.96, y: 4 }
transition: { 
  enter: { duration: 0.2, ease: [0.0, 0.0, 0.2, 1] },
  exit:  { duration: 0.15, ease: [0.4, 0.0, 1, 1] }
}
```

**Rule:** Modal content does not animate separately from the container. One coordinated enter.

---

### 9. Address Character Reveal

**Pattern:** Monospace address reveals character-by-character on generation

```typescript
// Split address string into character array
// Each character animates in with stagger

const address = "0x742d35Cc663..."
const chars = address.split('')

// Per-character:
initial: { opacity: 0 }
animate: { opacity: 1 }
transition: { 
  delay: index * 0.018,  // 18ms stagger per character
  duration: 0.08 
}
```

**Total duration:** ~42 chars × 18ms = ~756ms. Maximum allowed; justified by the significance of generating a unique address.

---

### 10. Form Validation Feedback

**Error shake (inline, not toast):**
```typescript
// When user submits with invalid input
animate: { x: [0, -4, 4, -4, 4, 0] }
transition: { duration: 0.3, ease: 'easeInOut' }
```

**Error message reveal:**
```typescript
initial: { opacity: 0, height: 0 }
animate: { opacity: 1, height: 'auto' }
transition: { duration: 0.15, ease: [0.0, 0.0, 0.2, 1] }
```

**Success checkmark (for field-level validation):**
```typescript
initial: { opacity: 0, scale: 0.5 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.12, ease: [0.0, 0.0, 0.2, 1] }
```

---

### 11. Toast Notifications

**Pattern:** Slide in from bottom-right (desktop) or bottom (mobile)

**Enter:**
```typescript
initial: { opacity: 0, y: 16, scale: 0.95 }
animate: { opacity: 1, y: 0, scale: 1 }
transition: { duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }
```

**Exit:**
```typescript
exit: { opacity: 0, y: 8, scale: 0.95 }
transition: { duration: 0.15, ease: [0.4, 0.0, 1, 1] }
```

**Auto-dismiss:** 4000ms for success, 6000ms for error (users need more time to read errors).

**Toast usage rules:**
- Error recovery notifications: YES
- Transaction failure: YES
- Copy feedback: NO (use inline morph)
- General success: NO (use inline state change)
- System messages: YES

---

## FRAMER MOTION IMPLEMENTATION GUIDE

### Standard Setup
```typescript
// All animated pages use this wrapper
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

const pageTransition = {
  enter: { duration: 0.22, ease: [0.0, 0.0, 0.2, 1] },
  exit: { duration: 0.15, ease: [0.4, 0.0, 1, 1] },
}

export default function Page() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* content */}
    </motion.div>
  )
}
```

### Reduced Motion Fallback
```typescript
// All animations must have a reduced-motion variant
const getVariants = (reduceMotion: boolean) => ({
  enter: reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 },
  exit: reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -4, scale: 0.98 },
})
```

### Performance Guidelines
- Use `transform` and `opacity` only for animated properties (GPU-composited)
- Never animate `height`, `width`, `padding`, `margin` directly — use `layout` prop instead
- Use `will-change: transform` sparingly — only on elements that animate frequently
- `layoutId` for shared element transitions between routes (receive address card)

---

## ANIMATION TESTING

### Unit Tests
- All animation variants must have corresponding snapshot tests
- Reduced motion variants must be tested separately

### E2E Verification
- Playwright must verify no animations exceed 400ms
- Measure time from trigger to final state using `page.waitForFunction`
- Test on CPU throttled (4x) to catch performance issues
