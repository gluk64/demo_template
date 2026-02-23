# Style Guide
### [APP_NAME] — Visual Identity & Design Reference

---

## Visual Character

Dark-first, typographically driven, spatially generous. Inspired by Linear, Vercel, and private banking interfaces. One accent color — everything else is neutral. No decoration that doesn't serve a function.

**What we are not:** fintech-playful, crypto-loud, enterprise-heavy, consumer-casual.

---

## Color System

### Backgrounds (5 levels of elevation)
| Token              | Value     | Use                        |
|--------------------|-----------|----------------------------|
| `--bg-base`        | `#09090B` | Page background            |
| `--bg-surface`     | `#111113` | Cards, panels, sidebar     |
| `--bg-raised`      | `#18181B` | Elevated elements, hovers  |
| `--bg-overlay`     | `#27272A` | Modals, dropdowns, inputs  |
| `--bg-muted`       | `#3F3F46` | Disabled, dividers         |

### Text
| Token              | Value     | Use                        |
|--------------------|-----------|----------------------------|
| `--text-primary`   | `#FAFAFA` | Headings, primary content  |
| `--text-secondary` | `#A1A1AA` | Labels, metadata           |
| `--text-tertiary`  | `#71717A` | Placeholders, captions     |
| `--text-disabled`  | `#52525B` | Disabled state             |
| `--text-inverse`   | `#09090B` | Text on light backgrounds  |

### Accent (Brand Blue)
| Token              | Value                        | Use                    |
|--------------------|------------------------------|------------------------|
| `--accent-primary` | `#4F6EF7`                    | Primary CTA, focus     |
| `--accent-hover`   | `#7B96FA`                    | Hover state            |
| `--accent-active`  | `#3B5BF6`                    | Active/pressed         |
| `--accent-subtle`  | `rgba(79, 110, 247, 0.12)`   | Tint backgrounds       |
| `--accent-border`  | `rgba(79, 110, 247, 0.30)`   | Accent borders         |

### Borders
| Token              | Value                        | Use                    |
|--------------------|------------------------------|------------------------|
| `--border-subtle`  | `rgba(255, 255, 255, 0.06)`  | Card borders (hairline)|
| `--border-default` | `rgba(255, 255, 255, 0.10)`  | Input borders          |
| `--border-strong`  | `rgba(255, 255, 255, 0.18)`  | Focus borders          |

### Semantic States
| Token              | Value     | Use                        |
|--------------------|-----------|----------------------------|
| `--success`        | `#22C55E` | Confirmed, verified        |
| `--warning`        | `#F59E0B` | Caution, unverified        |
| `--error`          | `#EF4444` | Failed (actual failures only) |
| `--pending`        | `#94A3B8` | Processing                 |

Each has a `-subtle` variant at 10% opacity for backgrounds and a `-border` variant at 25% opacity.

---

## Typography

**Primary:** Inter (all UI text) — `font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'`
**Monospace:** JetBrains Mono (numeric values, IDs, code) — `font-variant-numeric: tabular-nums`

### Type Scale (Tailwind classes)
| Class        | Size  | Line Height | Weight | Use              |
|--------------|-------|-------------|--------|------------------|
| `text-display`| 48px | 1.2         | 600    | Hero values      |
| `text-h1`    | 32px  | 1.35        | 600    | Page titles      |
| `text-h2`    | 24px  | 1.35        | 600    | Section headers  |
| `text-h3`    | 20px  | 1.35        | 500    | Card titles      |
| `text-base`  | 16px  | 1.5         | 400    | Body text        |
| `text-sm`    | 14px  | 1.5         | 400    | Secondary text   |
| `text-label` | 12px  | 1.2         | 500    | UI labels        |
| `text-micro` | 11px  | 1.2         | 500    | Badges, captions |

---

## Spacing (8pt Grid)

```
4px   → space-1 / p-1     (micro)
8px   → space-2 / p-2     (tight)
12px  → space-3 / p-3     (element gap)
16px  → space-4 / p-4     (standard / mobile page padding)
24px  → space-6 / p-6     (card padding)
32px  → space-8 / p-8     (section gap / desktop page padding)
48px  → space-12           (large section)
64px  → space-16           (page section)
```

---

## Component Specs

### Button
| Variant     | Background           | Text              | Border                   |
|-------------|----------------------|-------------------|--------------------------|
| Primary     | `accent-primary`     | white             | none                     |
| Secondary   | transparent          | `text-primary`    | `border-default`         |
| Ghost       | transparent          | `text-secondary`  | none                     |
| Destructive | `error`              | white             | none (confirm modals only)|

All: height 44px, radius 8px, padding 12px 16px, font 14px/500. Hover: raised bg or accent-hover. Active: `scale(0.98)`. Disabled: opacity 40%.

### Card
Background `bg-surface`, border `border-subtle`, radius 12px, padding 24px, shadow `0 1px 3px rgba(0,0,0,0.3)`.

### Input
Background `bg-overlay`, border `border-default`, radius 8px, height 44px, padding 12px 16px, font 14px. Focus: `border-strong` + accent shadow ring. Error: `error` border.

### Badge
Pill shape (radius full), padding 2px 8px, font 11px/500 uppercase. Variants: success (green), warning (amber), error (red), neutral (overlay bg).

### Modal
Overlay `rgba(0,0,0,0.6)`, bg `bg-overlay`, radius 16px, padding 32px, max-width 480px. Enter: 200ms scale from 0.96. Exit: 150ms.

### Navigation
**Desktop sidebar:** 240px fixed, bg `bg-surface`, border-right subtle. Active item: accent-subtle bg, accent text.
**Mobile bottom nav:** 64px + safe area, bg `bg-surface`, border-top subtle. Active: accent icon + label.

---

## Animation Catalog

### Page Transition
```typescript
initial: { opacity: 0, y: 8 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -4 }
transition: { duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }
```

### Button Press
```typescript
whileTap={{ scale: 0.97 }}
transition={{ duration: 0.08 }}
```

### List Item Insert
```typescript
initial: { opacity: 0, height: 0 }
animate: { opacity: 1, height: 'auto', transition: { height: { duration: 0.2 }, opacity: { duration: 0.15, delay: 0.05 } } }
```

### Modal
```typescript
// Overlay: opacity 0 → 1
// Content: { opacity: 0, scale: 0.96, y: 8 } → { opacity: 1, scale: 1, y: 0 }
// Enter: 200ms ease-out. Exit: 150ms ease-in.
```

### Reduced Motion Fallback
```typescript
const shouldReduceMotion = useReducedMotion()
// Reduced: opacity-only, max 100ms. Full: translate + opacity, standard timing.
```

---

## Forbidden Patterns

- Neon or fluorescent colors
- Color gradients as decoration
- Glow, bloom, glassmorphism effects
- Emoji in UI
- Illustrations, photography, decorative imagery
- White backgrounds (dark-first always)
- Multiple accent colors
- Animations > 400ms without progress
- Spring, bounce, or elastic easings

---

## Icons

Lucide React only. Sizes: navigation 20px, card action 18px, inline 16px, badge 12px. Decorative icons: `aria-hidden="true"`. State-communicating icons: require `aria-label`.
