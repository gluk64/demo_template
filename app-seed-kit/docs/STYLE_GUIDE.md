# STYLE GUIDE
### [APP_NAME] — Version 2.0
### Visual Identity System

> This identity can evolve. Update this doc and the token values when shifting direction.

---

## BRAND IDENTITY

### The Visual Character

The current visual direction occupies the intersection of three aesthetics:

1. **ZKsync institutional presence** — Deep navy-indigo as the dominant accent color. Cool blue-gray wash backgrounds. Geometric precision in line-art. The aesthetic of a company trusted by Deutsche Bank and UBS, translated for consumer fintech.

2. **Modern fintech clarity** — Inspired by Stripe, Bridge, and Modern Treasury. Light canvas, white cards, generous spacing. The interface reads as "bank" not "crypto" — because the goal is financial product adoption, not protocol signaling.

3. **Linear-grade craft** — Every pixel intentional. Crisp borders, functional shadows, fast transitions. The product feels engineered. No decoration that doesn't serve comprehension.

### Current Direction
- Light canvas with cool blue-gray wash (#F4F5FB) — not pure white
- White cards and surfaces sit on the wash for natural hierarchy
- Navy-indigo (#1A1F6C) as the single dominant accent — headings, CTAs, links
- Lavender highlight wash on brand labels (inherited from zksync.io)
- Pill-shaped primary CTAs (matching zksync.io button language)
- Typographically driven — text does the heavy lifting
- Spatially generous — breathing room signals confidence

### Reference Products
- **ZKsync.io** — Navy-indigo accent, cool wash backgrounds, lavender highlights, pill CTAs, geometric line-art
- **Stripe** — Card patterns, spacing, typographic hierarchy, data presentation
- **Bridge** — Clean fintech simplicity, trustworthy feel
- **Linear** — Interaction quality, icon treatment, component precision
- **Modern Treasury** — Financial data presentation, institutional tone

---

## COLOR SYSTEM

### Philosophy
Cool wash canvas. One accent color (ZKsync Navy-Indigo). Everything else is a cool-tinted neutral. The accent appears where user action is required, to signal active state, or in headings to carry brand identity. Color is never decorative.

The entire palette has a subtle cool/blue tint — warm grays are prohibited. This creates cohesion with the navy accent and matches the zksync.io feel.

### Background Scale
```
--bg-base:      #F4F5FB   — Page canvas (cool blue-gray wash)
--bg-surface:   #FFFFFF   — Cards, panels, sidebars
--bg-raised:    #ECEEF7   — Hover states, zebra rows, subtle sections
--bg-overlay:   #FFFFFF   — Modals, dropdowns (shadow-differentiated)
```

### Text Scale
```
--text-primary:    #0E0E2C   — Headings, primary content, amounts (navy-black)
--text-secondary:  #52526B   — Labels, metadata, descriptions
--text-tertiary:   #9090A7   — Placeholders, captions, disabled hints
--text-disabled:   #C4C4D4   — Disabled state text
```

### Accent (ZKsync Navy-Indigo)
Derived from zksync.io's heading color, button fills, and link text. This is NOT a mid-blue — it's a deep, near-navy indigo that reads as authoritative.
```
--accent:         #1A1F6C   — Primary CTA fills, links, headings, focus rings
--accent-hover:   #252B8A   — Hover state (slightly lighter/more saturated)
--accent-active:  #12164E   — Active/pressed state (darker)
--accent-subtle:  #E8EAFC   — Accent tint backgrounds (selected rows, tags)
--accent-muted:   #D5D8F6   — Lavender highlight wash (brand label backgrounds)
```

### Semantic Colors
```
--success:   #16A34A   — Confirmed, completed, positive amounts
--warning:   #D97706   — Caution, pending
--error:     #DC2626   — Failed actions, destructive states
```

Each semantic color has a *-subtle variant for tinted backgrounds:
```
--success-subtle:  #F0FDF4
--warning-subtle:  #FFFBEB
--error-subtle:    #FEF2F2
```

### Border Scale
```
--border:         #E2E3EE   — Card borders, dividers (cool-tinted)
--border-strong:  #CCCDE0   — Input borders, emphasis
--border-focus:   #1A1F6C   — Focus rings (accent)
```

---

## TYPOGRAPHY SYSTEM

### Font Families

#### Primary: Inter
Used for all UI text — labels, body, headings, buttons.
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
-webkit-font-smoothing: antialiased;
```

#### Monospace: JetBrains Mono
Used for: amounts, account numbers, addresses, transaction IDs, any string that is a financial or technical value.
```css
font-family: 'JetBrains Mono', 'SF Mono', monospace;
font-variant-numeric: tabular-nums;
font-feature-settings: 'zero' on;
```

### Type Scale

```
Display:    48px / 1.1 line-height / weight 600 / tracking -0.02em  — Hero amounts
Heading 1:  32px / 1.2 / weight 600 / tracking -0.02em              — Page titles
Heading 2:  24px / 1.3 / weight 600 / tracking -0.01em              — Section headers
Heading 3:  20px / 1.35 / weight 500                                — Card titles
Body:       15px / 1.6 / weight 400                                 — Primary content
Body SM:    14px / 1.5 / weight 400                                 — Secondary content
Label:      13px / 1.4 / weight 500 / tracking 0.01em              — UI labels, table headers
Micro:      11px / 1.35 / weight 500 / tracking 0.02em             — Badges, timestamps
Caps:       12px / 1.4 / weight 600 / tracking 0.05em / uppercase  — Section labels, overlines
```

### Heading Color Convention
Headings (H1, H2, Display) use --accent (#1A1F6C) as their text color, not --text-primary. This carries the ZKsync brand identity into every screen. Body text uses --text-primary (#0E0E2C).

### Numeric Display (Special Case)

Currency amounts in hero position:
```css
font-size: 48px;
font-weight: 600;
letter-spacing: -0.03em;
font-variant-numeric: tabular-nums;
font-family: var(--font-mono);
color: var(--text-primary);
```

---

## SPACING SYSTEM

### 4pt/8pt Grid

All spacing uses this token set:

```
4   →  space-1   (micro gaps)
8   →  space-2   (tight element spacing)
12  →  space-3   (compact groups)
16  →  space-4   (standard element spacing)
20  →  space-5   (comfortable padding)
24  →  space-6   (card padding, section gaps)
32  →  space-8   (section spacing)
40  →  space-10  (major section gaps)
48  →  space-12  (page-level spacing)
64  →  space-16  (hero spacing)
```

---

## COMPONENT SPECIFICATIONS

### Button

#### Primary Button (Pill — matching zksync.io CTA language)
```
Background:    var(--accent) — #1A1F6C
Text:          white
Border-radius: pill (9999px)
Height:        44px
Font-size:     15px
Font-weight:   500
Hover:         var(--accent-hover) — #252B8A
Active:        scale(0.98)
Shadow:        shadow-xs
Disabled:      opacity 0.45
Transition:    all 120ms ease-out
```

#### Secondary / Outline Button (Pill)
```
Background:    white
Border:        1px solid var(--border)
Border-radius: pill
Text:          var(--text-primary)
Shadow:        shadow-xs
Hover:         var(--bg-surface)
```

#### Ghost Button
```
Background:    transparent
Text:          var(--text-secondary)
Hover:         var(--bg-raised), var(--text-primary)
```

#### Danger Button
```
Background:    var(--error)
Text:          white
Border-radius: pill
Hover:         lighter red
```

### Card
```
Background:      white
Border:          1px solid var(--border) — #E2E3EE
Border-radius:   12px
Padding:         24px
Shadow:          shadow-sm
```

### Input
```
Background:      white
Border:          1px solid var(--border-strong) — #CCCDE0
Border-radius:   10px
Height:          44px
Font-size:       15px
Focus border:    var(--accent) — #1A1F6C
Focus shadow:    shadow-ring
Error border:    var(--error)
Placeholder:     var(--text-tertiary) — #9090A7
```

### Badge
```
Font:            11px / weight 500
Border-radius:   pill
Padding:         2px 8px
Variants:        neutral (gray), success (green), warning (amber), error (red), accent (blue)
Style:           subtle background + darker text (e.g. green-050 bg, green-600 text)
```

### Highlight (ZKsync Brand Pattern)
The lavender text-highlight wash seen on zksync.io for brand labels like "Prividium™", "Airbender", etc.
```
Background:      var(--accent-muted) — #D5D8F6
Text:            var(--accent) — #1A1F6C
Border-radius:   4px
Padding:         2px 6px
Display:         inline
```

### Table
```
Header:          13px / weight 600 / uppercase / tracking 0.05em / text-secondary
Header bg:       var(--bg-raised) or transparent
Row:             15px / weight 400 / text-primary
Row border:      1px solid var(--border)
Row hover:       var(--bg-raised)
Selected row:    var(--accent-subtle) background
Cell padding:    12px 16px
```

---

## ICONOGRAPHY

### Icon Library: Lucide React
- All icons must use Lucide React
- No mixing of icon libraries
- Custom SVG only for brand-specific elements (logo, ZKsync mark)

### Icon Sizing
```
Navigation:     20px
Card action:    16px
Inline body:    16px
Badge/chip:     14px
Micro:          12px
```

### Icon Color
Icons inherit text color by default. Interactive icons use --text-secondary default, --text-primary on hover. Active/selected icons use --accent.

### Illustration Style (Optional)
If illustrations are used, follow the zksync.io pattern: monochrome navy-indigo line-art, isometric/geometric, single-color strokes, no fills or only subtle accent-subtle fills. No multi-color illustrations.

---

## SURFACES AND ELEVATION

### Light-Mode Depth Model

Depth is communicated through three layered mechanisms:
1. **Canvas wash** — The page itself has a subtle blue-gray tint (#F4F5FB)
2. **White cards** — Surfaces sit on the wash, creating natural figure/ground
3. **Shadows** — Increasing shadow depth for interactive overlays

```
Level 0 (Canvas):   #F4F5FB — The page wash, always visible
Level 1 (Surface):  #FFFFFF + border + shadow-sm — Cards, sidebars, panels
Level 2 (Raised):   #FFFFFF + border + shadow-md — Dropdowns, popovers
Level 3 (Overlay):  #FFFFFF + shadow-xl — Modals, command palettes
```

### Shadow Scale
```
shadow-xs:   0 1px 2px rgba(14,14,44,0.04)              — buttons, subtle lift
shadow-sm:   0 1px 3px rgba(14,14,44,0.06) + inner       — cards
shadow-md:   0 4px 8px rgba(14,14,44,0.06) + inner       — dropdowns
shadow-lg:   0 10px 20px rgba(14,14,44,0.08) + inner     — popovers
shadow-xl:   0 20px 40px rgba(14,14,44,0.10) + inner     — modals
shadow-ring: 0 0 0 3px rgba(26,31,108,0.18)              — focus state
```

---

## IMAGERY AND ILLUSTRATION

### Current Policy
No photography and no decorative imagery. Empty states and placeholder content use icon + typography only.

If illustrations are introduced, they must follow the ZKsync monochrome line-art style (see Illustration Style above).

### Acceptable Visual Elements
- Lucide icons (functional only)
- QR codes (functional)
- Brand logomark (ZKsync mark)
- Status indicators (colored dots, badges)
- Progress indicators
- Simple data visualizations (sparklines, bar charts) using accent + neutral palette
- Monochrome line-art illustrations in ZKsync style (if applicable)

---

## FORBIDDEN PATTERNS

> These are forbidden under the current theme direction. If the theme shifts, review this list.

| Pattern | Rationale |
|---------|-----------|
| Warm-tinted grays | Breaks cool palette cohesion with navy accent |
| Neon or fluorescent colors | Incompatible with institutional trust |
| Color gradients as decoration | Signals consumer-grade aesthetic |
| Glow or bloom effects | Crypto-kitsch |
| Glassmorphism / frosted glass | Overused, signals trendiness not longevity |
| Rounded-full on cards | Too playful for fintech |
| Emoji in UI | Incompatible with precision aesthetic |
| Animation > 400ms without progress | Signals slowness |
| Multiple accent colors | Destroys visual hierarchy; navy-indigo only |
| Pure white page backgrounds | Canvas is wash (#F4F5FB), not white |
| Dark mode as default | Light-first for fintech trust |
| Background images or textures | Visual noise |
| Multi-color illustrations | Line-art must be monochrome navy only |
| Heavy drop shadows (> 40px blur) | Feels dated and heavy |
| Colored section backgrounds | Use cards on wash for grouping |
