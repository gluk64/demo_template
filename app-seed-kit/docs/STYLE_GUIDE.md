# STYLE GUIDE
### [APP_NAME] — Version 1.0
### Visual Identity System

> This identity can evolve. Update this doc and the token values when shifting direction.

---

## BRAND IDENTITY

### The Visual Character

The current visual direction occupies the intersection of three aesthetics:

1. **Swiss financial precision** — Negative space is wealth. Restraint is confidence. Nothing decorative that doesn't serve a function.

2. **Technical authority** — Dark-first, monospace numerals, cryptographic precision. The aesthetic signals that something serious and advanced is happening beneath the surface.

3. **Calm technology** — Inspired by Muji, Linear, and Calm. The interface should not demand attention. It should provide clarity and step aside.

### Current Direction
- Dark-first, always
- Typographically driven
- Spatially generous
- Precisely minimal
- Institutionally calm

---

## COLOR SYSTEM

### Philosophy
One accent color. Everything else is neutral. The accent is not decorative — it is functional. It appears only where user action is required or confirmed.

### Background Scale
A four-level grayscale from deepest background to highest surface:

```
--bg-base:      #09090B   — Page background
--bg-surface:   #111113   — Cards, panels
--bg-raised:    #18181B   — Elevated elements
--bg-overlay:   #27272A   — Modals, dropdowns
```

### Text Scale
```
--text-primary:    #F5F5F7   — Headings, primary content
--text-secondary:  #C0C0CC   — Labels, metadata
--text-tertiary:   #6B6B76   — Placeholders, captions
--text-disabled:   #44444A   — Disabled state
```

### Accent (Brand)
```
--accent:         #4F6EF7   — Primary CTA, focus rings, active states
--accent-hover:   #6B82F8   — Hover state
--accent-subtle:  rgba(79, 110, 247, 0.10) — Accent tint backgrounds
```

### Semantic Colors
```
--success:   #22C55E   — Confirmed, verified
--warning:   #F59E0B   — Caution
--error:     #EF4444   — Failed actions only
```

### Border Scale
```
--border:         rgba(255,255,255,0.08) — Card borders (hairline)
--border-strong:  rgba(255,255,255,0.14) — Focus borders
```

---

## TYPOGRAPHY SYSTEM

### Font Families

#### Primary: Inter
Used for all UI text — labels, body, headings, buttons.
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
```

#### Monospace: JetBrains Mono
Used for: amounts, IDs, addresses, any string that is a technical or financial value.
```css
font-family: 'JetBrains Mono', monospace;
font-variant-numeric: tabular-nums;
font-feature-settings: 'zero' on;
```

### Type Scale

```
Display:    56px / 1.0 line-height / weight 600   — Hero numbers
Heading 1:  36px / 1.15 / weight 600              — Page titles
Heading 2:  24px / 1.3 / weight 600               — Section headers
Heading 3:  22px / 1.3 / weight 500               — Card titles
Body:       16px / 1.6 / weight 400               — Primary content
Body SM:    15px / 1.55 / weight 400              — Secondary content
Label:      13px / 1.4 / weight 500               — UI labels
Micro:      12px / 1.4 / weight 500               — Badges, captions
```

### Numeric Display (Special Case)

Currency amounts in hero position:
```css
font-size: 56px;
font-weight: 600;
letter-spacing: -0.03em;
font-variant-numeric: tabular-nums;
font-family: var(--font-mono);
```

---

## SPACING SYSTEM

### 8pt Grid

All spacing uses this token set:

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
```

---

## COMPONENT SPECIFICATIONS

### Button

#### Primary Button
```
Background:    var(--accent)
Text:          white
Border-radius: 12px
Height:        52px (minimum touch target)
Hover:         var(--accent-hover)
Active:        scale(0.97)
Disabled:      opacity-40
```

#### Secondary / Outline Button
```
Background:    transparent
Border:        1px solid var(--border-strong)
Text:          var(--text-primary)
Hover:         var(--bg-raised)
```

#### Ghost Button
```
Background:    transparent
Text:          var(--text-secondary)
Hover:         var(--bg-raised), var(--text-primary)
```

### Card
```
Background:      var(--bg-surface)
Border:          1px solid var(--border)
Border-radius:   12px
Padding:         28px
```

### Input
```
Background:      var(--bg-overlay)
Border:          1px solid var(--border)
Border-radius:   12px
Height:          52px
Focus border:    var(--accent)
Error border:    var(--error)
```

### Badge
```
Font:            12px / weight 500
Variants:        success, warning, error, neutral, accent
```

---

## ICONOGRAPHY

### Icon Library: Lucide React
- All icons must use Lucide React
- No mixing of icon libraries
- Custom SVG only for brand-specific elements (logo)

### Icon Sizing
```
Navigation:     18-20px
Card action:    18px
Inline body:    16px
Badge/chip:     12px
```

---

## SURFACES AND ELEVATION

### The Four Surfaces

Rather than shadows, use background elevation to signal depth:

```
Level 0 (Base):     #09090B   — Page background, never interactive
Level 1 (Surface):  #111113   — Primary cards, sidebars
Level 2 (Raised):   #18181B   — Dropdown menus, secondary cards
Level 3 (Overlay):  #27272A   — Modals, popovers, toasts
```

---

## IMAGERY AND ILLUSTRATION

### Current Policy
No illustrations, no photography, and no decorative imagery. Empty states and placeholder content use icon + typography only.

This policy can evolve — update this section if the direction shifts.

### Acceptable Visual Elements
- Lucide icons (functional only)
- QR codes (functional)
- Brand logomark
- Status indicators (colored dots, badges)
- Progress indicators

---

## FORBIDDEN PATTERNS

> These are forbidden under the current theme direction. If the theme shifts, review this list.

| Pattern | Rationale |
|---------|-----------|
| Neon or fluorescent colors | Incompatible with institutional trust |
| Color gradients as decoration | Signals consumer-grade aesthetic |
| Glow or bloom effects | Kitsch |
| Glassmorphism | Overused, signals trendiness not longevity |
| Rounded-full on cards | Too playful for institutional feel |
| Emoji in UI | Incompatible with precision aesthetic |
| Animation > 400ms without progress | Signals slowness |
| Multiple accent colors | Destroys visual hierarchy |
| White backgrounds | Brand is dark-first |
| Background images or textures | Visual noise |
