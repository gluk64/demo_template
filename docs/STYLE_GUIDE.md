# STYLE GUIDE
### UISmoke — Version 2.0
### Visual Identity System

> Designed by the standards of: Apple's Human Interface Guidelines, IBM Carbon Design System, and Vercel's product aesthetic. Restrained, technical, and timeless.

---

## BRAND IDENTITY

### The Visual Character

UISmoke occupies the intersection of three aesthetics:

1. **Swiss financial precision** — The visual language of private banking. Negative space is wealth. Restraint is confidence. Nothing decorative that doesn't serve a function.

2. **Technical authority** — Dark-first, monospace numerals, cryptographic precision. The aesthetic signals that something serious and advanced is happening beneath the surface.

3. **Calm technology** — Inspired by Muji, Linear, and Calm. The interface should not demand attention. It should provide clarity and step aside.

### What We Are
- Dark-first, always
- Typographically driven
- Spatially generous
- Precisely minimal
- Institutionally calm

### What We Are Not
- Fintech-playful (no bright colors, no confetti, no celebrations)
- Crypto-loud (no neon, no glow, no "Web3 aesthetic")
- Enterprise-heavy (no tables as primary content, no dense data grids)
- Consumer-casual (no rounded-xl everywhere, no friendly illustration style)

---

## COLOR SYSTEM

### Philosophy
One accent color. Everything else is neutral. The accent is not decorative — it is functional. It appears only where user action is required or confirmed.

### Background Scale
A five-level grayscale from deepest background to highest surface:

```
--bg-base:      #09090B   (zinc-950) — Page background
--bg-surface:   #111113   (zinc-925) — Cards, panels
--bg-raised:    #18181B   (zinc-900) — Elevated elements
--bg-overlay:   #27272A   (zinc-800) — Modals, dropdowns
--bg-muted:     #3F3F46   (zinc-700) — Dividers, disabled
```

### Text Scale
```
--text-primary:    #FAFAFA   — Headings, primary content
--text-secondary:  #A1A1AA   — Labels, metadata, secondary
--text-tertiary:   #71717A   — Placeholders, captions
--text-disabled:   #52525B   — Disabled state
--text-inverse:    #09090B   — Text on light backgrounds
```

### Accent (Brand)
```
--accent-primary:   #4F6EF7   — Primary CTA, focus rings, active states
--accent-hover:     #7B96FA   — Hover state of primary
--accent-active:    #3B5BF6   — Active/pressed state
--accent-subtle:    rgba(79, 110, 247, 0.12)   — Accent tint backgrounds
--accent-border:    rgba(79, 110, 247, 0.30)   — Accent border color
```

### Semantic Colors
```
--success:          #22C55E   — Confirmed, received, verified
--success-subtle:   rgba(34, 197, 94, 0.10)
--warning:          #F59E0B   — Unverified, caution
--warning-subtle:   rgba(245, 158, 11, 0.10)
--error:            #EF4444   — Failed transactions only
--error-subtle:     rgba(239, 68, 68, 0.10)
--pending:          #94A3B8   — Processing state
```

### Border Scale
```
--border-subtle:    rgba(255,255,255,0.06)   — Card borders (hairline)
--border-default:   rgba(255,255,255,0.10)   — Input borders
--border-strong:    rgba(255,255,255,0.18)   — Focus borders
```

### Tailwind Extension
```typescript
// tailwind.config.ts
colors: {
  bg: {
    base: 'var(--bg-base)',
    surface: 'var(--bg-surface)',
    raised: 'var(--bg-raised)',
    overlay: 'var(--bg-overlay)',
    muted: 'var(--bg-muted)',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    disabled: 'var(--text-disabled)',
  },
  accent: {
    DEFAULT: 'var(--accent-primary)',
    hover: 'var(--accent-hover)',
    subtle: 'var(--accent-subtle)',
    border: 'var(--accent-border)',
  },
  // ... semantic colors
}
```

---

## TYPOGRAPHY SYSTEM

### Font Families

#### Primary: Inter
Used for all UI text — labels, body, headings, buttons.
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; /* Improved character forms */
```

#### Monospace: JetBrains Mono
Used exclusively for: addresses, amounts, transaction IDs, any string that is a cryptographic or financial value.
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
font-variant-numeric: tabular-nums;
font-feature-settings: 'zero' on; /* Slashed zero for readability */
```

### Type Scale

```
Display:    48px / 1.2 line-height / weight 600   — Balance hero
Heading 1:  32px / 1.35 / weight 600              — Page titles
Heading 2:  24px / 1.35 / weight 600              — Section headers
Heading 3:  20px / 1.35 / weight 500              — Card titles
Body:       16px / 1.5 / weight 400               — Primary content
Body SM:    14px / 1.5 / weight 400               — Secondary content
Label:      12px / 1.2 / weight 500               — UI labels
Micro:      11px / 1.2 / weight 500               — Badges, captions
```

### Numeric Display (Special Case)

Currency amounts in hero position (Dashboard balance):
```css
font-size: 48px;
font-weight: 600;
letter-spacing: -0.02em;  /* Tight tracking for large numerals */
font-variant-numeric: tabular-nums;
font-family: var(--font-mono);
```

Small inline amounts (Activity feed):
```css
font-size: 14px;
font-weight: 500;
font-variant-numeric: tabular-nums;
font-family: var(--font-mono);
```

---

## SPACING SYSTEM

### 8pt Grid

All spacing uses this token set (in px, mapped to Tailwind):

```
4   →  space-1
8   →  space-2
12  →  space-3
16  →  space-4
24  →  space-6
32  →  space-8
40  →  space-10
48  →  space-12
64  →  space-16
80  →  space-20
96  →  space-24
```

### Layout Spacing
```
Page horizontal padding (mobile):    16px
Page horizontal padding (desktop):   32px
Card internal padding:               24px
Card gap (list items):               0 (use border instead of gap)
Section vertical gap:                32px
Form field gap:                      16px
Button internal padding:             12px 16px
```

---

## COMPONENT SPECIFICATIONS

### Button

#### Primary Button
```
Background:    var(--accent-primary)
Text:          white
Border:        none
Border-radius: 8px
Height:        44px (minimum touch target)
Padding:       12px 16px
Font:          14px / 500
Hover:         var(--accent-hover) background
Active:        scale(0.98) transform
Focus:         2px outline var(--accent-primary) offset 2px
Disabled:      opacity-40, cursor-not-allowed
Transition:    colors 100ms, transform 80ms
```

#### Secondary / Outline Button
```
Background:    transparent
Border:        1px solid var(--border-default)
Text:          var(--text-primary)
Border-radius: 8px
Height:        44px
Hover:         var(--bg-raised) background
```

#### Ghost Button
```
Background:    transparent
Border:        none
Text:          var(--text-secondary)
Hover:         var(--bg-raised) background, var(--text-primary) text
```

#### Destructive Button (for confirms only)
```
Background:    var(--error)
Text:          white
Only used:     Inside confirmation modals
```

### Card

The fundamental surface unit. All content lives in cards.

```
Background:      var(--bg-surface)
Border:          1px solid var(--border-subtle)
Border-radius:   12px
Padding:         24px
Shadow:          0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)
```

Card variants:
```
Default:     Background bg-surface
Raised:      Background bg-raised (for secondary content)
Muted:       Background transparent, border border-subtle (for disabled states)
Accent:      Border-left 2px solid var(--accent-primary) (for highlighted items)
```

### Input
```
Background:      var(--bg-overlay)
Border:          1px solid var(--border-default)
Border-radius:   8px
Height:          44px
Padding:         12px 16px
Font:            14px / 400
Color:           var(--text-primary)
Placeholder:     var(--text-tertiary)
Focus border:    var(--border-strong), accent shadow ring
Error border:    var(--error)
Transition:      border-color 100ms
```

### Badge
```
Border-radius:   9999px (full pill)
Padding:         2px 8px
Font:            11px / weight 500 / uppercase / letter-spacing 0.05em
```

Badge variants:
```
Success:  bg var(--success-subtle), text var(--success)    → "VERIFIED"
Warning:  bg var(--warning-subtle), text var(--warning)    → "UNVERIFIED"
Error:    bg var(--error-subtle),   text var(--error)      → "FAILED"
Neutral:  bg var(--bg-overlay),     text var(--text-secondary) → "PENDING"
```

### Modal
```
Overlay:         rgba(0,0,0,0.6), backdrop-blur(4px)
Container:       bg-overlay, border border-subtle
Border-radius:   16px
Padding:         32px
Width:           480px max (full-width on mobile with 16px margin)
Shadow:          0 24px 48px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.3)
Animation:       fade-in + scale from 0.96 (enter 200ms easeOut)
                 fade-out + scale to 0.96 (exit 150ms easeIn)
```

### Navigation

#### Desktop Sidebar
```
Width:           240px
Background:      var(--bg-surface)
Border-right:    1px solid var(--border-subtle)
Padding:         24px 16px

Nav Item default:
  Padding:       8px 12px
  Border-radius: 8px
  Color:         var(--text-secondary)
  Gap:           12px (icon + text)

Nav Item active:
  Background:    var(--accent-subtle)
  Color:         var(--accent-primary)
  Border-left:   2px solid var(--accent-primary)
```

#### Mobile Bottom Nav
```
Height:          64px + safe-area-inset-bottom
Background:      var(--bg-surface)
Border-top:      1px solid var(--border-subtle)

Nav Item default:
  Icon:          20px, var(--text-tertiary)
  Label:         10px, hidden on inactive (optional)

Nav Item active:
  Icon:          20px, var(--accent-primary)
  Label:         10px, var(--accent-primary), visible
```

---

## ICONOGRAPHY

### Icon Library: Lucide React
- All icons must use Lucide React
- No mixing of icon libraries
- Custom SVG only for brand-specific elements (logo)

### Icon Sizing
```
Navigation:     20px
Card action:    18px
Inline body:    16px
Badge/chip:     12px
Status dot:     8px (CSS circle, not icon)
```

### Icon Usage Rules
- All icons that communicate state must have aria-label
- Decorative icons use aria-hidden="true"
- Never use icons alone for critical state without text backup
- Icons never animate independently (except loading spinner)

---

## SURFACES AND ELEVATION

### The Four Surfaces

Rather than shadows, we use background elevation to signal depth:

```
Level 0 (Base):     #09090B   — Page background, never interactive
Level 1 (Surface):  #111113   — Primary cards, sidebars
Level 2 (Raised):   #18181B   — Dropdown menus, secondary cards
Level 3 (Overlay):  #27272A   — Modals, popovers, toasts
```

### Shadow System

Used sparingly, to reinforce the elevation system:

```
Shadow-sm (Level 1):  0 1px 2px rgba(0,0,0,0.20)
Shadow-md (Level 2):  0 4px 6px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.20)
Shadow-lg (Level 3):  0 20px 40px rgba(0,0,0,0.40), 0 8px 16px rgba(0,0,0,0.30)
```

---

## IMAGERY AND ILLUSTRATION

### Policy
No illustrations, no photography, and no decorative imagery. Empty states and placeholder content use icon + typography only.

### Acceptable Visual Elements
- Lucide icons (functional only)
- QR code (functional)
- Brand logomark (header only)
- Status indicators (colored dots, badges)
- Progress indicators (rings, bars)

### Forbidden
- Hero images
- Illustration characters or scenes
- Stock photography
- Decorative patterns or textures (including noise texture)
- Lottie animations
- Background imagery

---

## FORBIDDEN PATTERNS (PERMANENT)

These are never permitted, regardless of context or request:

| Pattern | Rationale |
|---------|-----------|
| Neon or fluorescent colors | Incompatible with financial trust |
| Color gradients as decoration | Signals consumer-grade aesthetic |
| Glow or bloom effects | Crypto-kitsch |
| Glassmorphism | Currently overused, signals trendiness not longevity |
| Rounded-full on cards (card pills) | Too playful for institutional feel |
| Emoji in UI | Incompatible with precision aesthetic |
| Animation > 400ms without progress | Signals slowness |
| Multiple accent colors | Destroys visual hierarchy |
| Dark text on dark background | Obvious contrast failure |
| White backgrounds anywhere | Brand is dark-first, always |
| Background images or textures | Visual noise |
| text-white without token mapping | Use text-primary token instead |
