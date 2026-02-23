# DESIGN TOKENS
### [APP_NAME] — Version 2.0
### Single Source of Truth for All Visual Values

> This file is the canonical reference for every visual constant. No value in this file may be overridden inline. All token changes require a design review.

---

## THEME DIRECTION

The current theme follows these principles. These can be changed — update
this section and the corresponding token values when shifting direction.

**Current direction:** Light-first, institutional fintech, ZKsync-rooted
**Accent:** ZKsync Navy-Indigo (#1A1F6C)
**Canvas:** Cool blue-gray wash (#F4F5FB) — not pure white
**Feel:** Clean, trustworthy, spatial, modern financial infrastructure
**Personality:** Confident, transparent, precise — a product you'd trust with money
**Heritage:** ZKsync's deep navy headings, cool-wash backgrounds, geometric line-art, and lavender highlight treatments — adapted for consumer fintech legibility

To change the theme direction, update:
1. This section (describe the new direction)
2. The primitive token values below (colors, radii, etc.)
3. STYLE_GUIDE.md (update the visual identity description)
4. The token CSS file (src/styles/tokens.css)

---

## TOKEN ARCHITECTURE

Tokens are organized in three tiers:

```
Tier 1: Primitive Tokens     (raw values — never used directly in components)
Tier 2: Semantic Tokens      (purpose-named — used everywhere in components)
Tier 3: Component Tokens     (component-specific — mapped to semantic)
```

**Rule:** Components reference Tier 2 (semantic) tokens only. Tier 1 (primitive) tokens exist only in the token definition file.

---

## TIER 1: PRIMITIVE TOKENS

### Color Primitives (cool neutral scale + ZKsync brand)
```css
:root {
  /* Cool neutral scale — blue-tinted grays matching ZKsync canvas feel */
  --primitive-gray-950: #0E0E2C;
  --primitive-gray-900: #1A1A3E;
  --primitive-gray-800: #2E2E52;
  --primitive-gray-700: #42426A;
  --primitive-gray-600: #52526B;
  --primitive-gray-500: #6B6B88;
  --primitive-gray-400: #9090A7;
  --primitive-gray-300: #B8B8CC;
  --primitive-gray-200: #CCCDE0;
  --primitive-gray-150: #E2E3EE;
  --primitive-gray-100: #ECEEF7;
  --primitive-gray-050: #F4F5FB;
  --primitive-white:    #FFFFFF;

  /* ZKsync Navy-Indigo — derived from zksync.io headings, buttons, links */
  --primitive-brand-900: #0A0D3A;
  --primitive-brand-800: #12164E;
  --primitive-brand-700: #1A1F6C;
  --primitive-brand-600: #252B8A;
  --primitive-brand-500: #3038A8;
  --primitive-brand-400: #4F57C2;
  --primitive-brand-300: #7B82D6;
  --primitive-brand-200: #A8ADE6;
  --primitive-brand-100: #D5D8F6;
  --primitive-brand-050: #E8EAFC;
  --primitive-brand-025: #F2F3FE;

  /* Semantic primitives */
  --primitive-green-600: #16A34A;
  --primitive-green-500: #22C55E;
  --primitive-green-100: #DCFCE7;
  --primitive-green-050: #F0FDF4;
  --primitive-amber-600: #D97706;
  --primitive-amber-500: #F59E0B;
  --primitive-amber-100: #FEF3C7;
  --primitive-amber-050: #FFFBEB;
  --primitive-red-600:   #DC2626;
  --primitive-red-500:   #EF4444;
  --primitive-red-100:   #FEE2E2;
  --primitive-red-050:   #FEF2F2;
}
```

### Spacing Primitives
```css
:root {
  --primitive-space-0:  0px;
  --primitive-space-px: 1px;
  --primitive-space-1:  4px;
  --primitive-space-2:  8px;
  --primitive-space-3:  12px;
  --primitive-space-4:  16px;
  --primitive-space-5:  20px;
  --primitive-space-6:  24px;
  --primitive-space-8:  32px;
  --primitive-space-10: 40px;
  --primitive-space-12: 48px;
  --primitive-space-16: 64px;
  --primitive-space-20: 80px;
  --primitive-space-24: 96px;
}
```

### Typography Primitives
```css
:root {
  --primitive-font-sans:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --primitive-font-mono:  'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  --primitive-size-11: 11px;
  --primitive-size-12: 12px;
  --primitive-size-13: 13px;
  --primitive-size-14: 14px;
  --primitive-size-15: 15px;
  --primitive-size-16: 16px;
  --primitive-size-18: 18px;
  --primitive-size-20: 20px;
  --primitive-size-24: 24px;
  --primitive-size-28: 28px;
  --primitive-size-32: 32px;
  --primitive-size-40: 40px;
  --primitive-size-48: 48px;

  --primitive-weight-400: 400;
  --primitive-weight-500: 500;
  --primitive-weight-600: 600;

  --primitive-leading-tight:   1.2;
  --primitive-leading-snug:    1.35;
  --primitive-leading-normal:  1.5;
  --primitive-leading-relaxed: 1.625;

  --primitive-tracking-tight:  -0.02em;
  --primitive-tracking-normal: 0em;
  --primitive-tracking-wide:   0.01em;
  --primitive-tracking-caps:   0.05em;
}
```

### Border Primitives
```css
:root {
  --primitive-radius-4:  4px;
  --primitive-radius-6:  6px;
  --primitive-radius-8:  8px;
  --primitive-radius-10: 10px;
  --primitive-radius-12: 12px;
  --primitive-radius-16: 16px;
  --primitive-radius-pill: 9999px;

  --primitive-border-width-1: 1px;
  --primitive-border-width-2: 2px;
}
```

### Shadow Primitives
```css
:root {
  /* Shadows use navy-tinted rgba to match the cool canvas */
  --primitive-shadow-xs:  0 1px 2px rgba(14, 14, 44, 0.04);
  --primitive-shadow-sm:  0 1px 3px rgba(14, 14, 44, 0.06), 0 1px 2px rgba(14, 14, 44, 0.04);
  --primitive-shadow-md:  0 4px 8px rgba(14, 14, 44, 0.06), 0 2px 4px rgba(14, 14, 44, 0.04);
  --primitive-shadow-lg:  0 10px 20px rgba(14, 14, 44, 0.08), 0 4px 8px rgba(14, 14, 44, 0.04);
  --primitive-shadow-xl:  0 20px 40px rgba(14, 14, 44, 0.10), 0 8px 16px rgba(14, 14, 44, 0.05);
  --primitive-shadow-ring: 0 0 0 3px rgba(26, 31, 108, 0.18);
}
```

### Motion Primitives
```css
:root {
  --primitive-duration-instant: 80ms;
  --primitive-duration-fast:    120ms;
  --primitive-duration-normal:  200ms;
  --primitive-duration-slow:    300ms;
  --primitive-duration-enter:   220ms;
  --primitive-duration-exit:    150ms;

  --primitive-ease-out:     cubic-bezier(0.0, 0.0, 0.2, 1);
  --primitive-ease-in:      cubic-bezier(0.4, 0.0, 1, 1);
  --primitive-ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --primitive-ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## TIER 2: SEMANTIC TOKENS

### Color Semantics
```css
:root {
  /* Backgrounds — cool blue-gray wash canvas */
  --bg-base:     var(--primitive-gray-050);   /* #F4F5FB — page canvas */
  --bg-surface:  var(--primitive-white);       /* #FFFFFF — cards sit on wash */
  --bg-raised:   var(--primitive-gray-100);    /* #ECEEF7 — hover, zebra rows */
  --bg-overlay:  var(--primitive-white);       /* #FFFFFF — modals (shadow-lifted) */
  --bg-wash:     var(--primitive-gray-050);    /* #F4F5FB — section backgrounds */

  /* Text — navy-tinted darks on light */
  --text-primary:   var(--primitive-gray-950); /* #0E0E2C */
  --text-secondary: var(--primitive-gray-600); /* #52526B */
  --text-tertiary:  var(--primitive-gray-400); /* #9090A7 */
  --text-disabled:  var(--primitive-gray-300); /* #B8B8CC */

  /* Accent — ZKsync Navy-Indigo */
  --accent:         var(--primitive-brand-700); /* #1A1F6C — CTAs, links, headings */
  --accent-hover:   var(--primitive-brand-600); /* #252B8A — hover (lighter) */
  --accent-active:  var(--primitive-brand-800); /* #12164E — pressed */
  --accent-subtle:  var(--primitive-brand-050); /* #E8EAFC — tint backgrounds */
  --accent-muted:   var(--primitive-brand-100); /* #D5D8F6 — highlight wash */

  /* Borders */
  --border:         var(--primitive-gray-150); /* #E2E3EE */
  --border-strong:  var(--primitive-gray-200); /* #CCCDE0 */
  --border-focus:   var(--primitive-brand-700); /* #1A1F6C */

  /* Semantic states */
  --success:        var(--primitive-green-600);
  --success-subtle: var(--primitive-green-050);
  --warning:        var(--primitive-amber-600);
  --warning-subtle: var(--primitive-amber-050);
  --error:          var(--primitive-red-600);
  --error-subtle:   var(--primitive-red-050);

  /* Shadows */
  --shadow-card:    var(--primitive-shadow-sm);
  --shadow-dropdown: var(--primitive-shadow-lg);
  --shadow-focus:   var(--primitive-shadow-ring);
}
```

### Typography Semantics
```css
:root {
  --font-sans: var(--primitive-font-sans);
  --font-mono: var(--primitive-font-mono);

  --text-display-size:     48px;
  --text-display-leading:  1.1;
  --text-display-weight:   600;
  --text-display-tracking: -0.02em;

  --text-h1-size:     32px;
  --text-h1-leading:  1.2;
  --text-h1-weight:   600;
  --text-h1-tracking: -0.02em;

  --text-h2-size:     24px;
  --text-h2-leading:  1.3;
  --text-h2-weight:   600;
  --text-h2-tracking: -0.01em;

  --text-h3-size:     20px;
  --text-h3-leading:  1.35;
  --text-h3-weight:   500;
  --text-h3-tracking: 0em;

  --text-body-size:    15px;
  --text-body-leading: 1.6;
  --text-body-weight:  400;

  --text-sm-size:    14px;
  --text-sm-leading: 1.5;
  --text-sm-weight:  400;

  --text-label-size:    13px;
  --text-label-leading: 1.4;
  --text-label-weight:  500;
  --text-label-tracking: 0.01em;

  --text-micro-size:    11px;
  --text-micro-leading: 1.35;
  --text-micro-weight:  500;
  --text-micro-tracking: 0.02em;

  --text-caps-size:     12px;
  --text-caps-leading:  1.4;
  --text-caps-weight:   600;
  --text-caps-tracking: 0.05em;
}
```

### Spacing Semantics
```css
:root {
  --spacing-page-x-mobile:  16px;
  --spacing-page-x-desktop: 32px;
  --spacing-page-y:         32px;
  --spacing-card:           24px;
  --spacing-section:        32px;
  --spacing-element:        16px;
  --spacing-tight:          8px;
  --spacing-micro:          4px;
}
```

### Motion Semantics
```css
:root {
  --motion-instant:  80ms;
  --motion-fast:     120ms;
  --motion-normal:   200ms;
  --motion-enter:    220ms;
  --motion-exit:     150ms;

  --ease-enter:    cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-exit:     cubic-bezier(0.4, 0.0, 1, 1);
  --ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

---

## TIER 3: COMPONENT TOKENS

### Button Component
```css
:root {
  --btn-primary-bg:          var(--accent);
  --btn-primary-bg-hover:    var(--accent-hover);
  --btn-primary-text:        white;
  --btn-primary-height:      44px;
  --btn-primary-radius:      var(--primitive-radius-pill);
  --btn-primary-font-size:   15px;
  --btn-primary-font-weight: 500;
  --btn-primary-shadow:      var(--primitive-shadow-xs);

  --btn-secondary-bg:        var(--primitive-white);
  --btn-secondary-bg-hover:  var(--primitive-gray-050);
  --btn-secondary-border:    var(--border);
  --btn-secondary-text:      var(--text-primary);
  --btn-secondary-radius:    var(--primitive-radius-pill);
  --btn-secondary-shadow:    var(--primitive-shadow-xs);

  --btn-ghost-bg:            transparent;
  --btn-ghost-bg-hover:      var(--bg-raised);
  --btn-ghost-text:          var(--text-secondary);
  --btn-ghost-text-hover:    var(--text-primary);

  --btn-danger-bg:           var(--error);
  --btn-danger-bg-hover:     var(--primitive-red-500);
  --btn-danger-text:         white;

  --btn-disabled-opacity:    0.45;
  --btn-transform-active:    scale(0.98);
}
```

### Card Component
```css
:root {
  --card-bg:            var(--primitive-white);
  --card-border:        var(--border);
  --card-radius:        var(--primitive-radius-12);
  --card-padding:       24px;
  --card-shadow:        var(--primitive-shadow-sm);
}
```

### Input Component
```css
:root {
  --input-bg:              var(--primitive-white);
  --input-border:          var(--border-strong);
  --input-border-focus:    var(--accent);
  --input-border-error:    var(--error);
  --input-radius:          var(--primitive-radius-10);
  --input-height:          44px;
  --input-font-size:       15px;
  --input-text:            var(--text-primary);
  --input-placeholder:     var(--text-tertiary);
  --input-shadow-focus:    var(--shadow-focus);
}
```

### Modal Component
```css
:root {
  --modal-overlay-bg:   rgba(14, 14, 44, 0.4);
  --modal-bg:           var(--primitive-white);
  --modal-border:       var(--border);
  --modal-radius:       var(--primitive-radius-16);
  --modal-padding:      28px;
  --modal-max-width:    480px;
  --modal-shadow:       var(--primitive-shadow-xl);
}
```

### Navigation Component
```css
:root {
  --sidebar-width:      240px;
  --sidebar-bg:         var(--primitive-white);
  --sidebar-border:     var(--border);
  --nav-item-radius:    var(--primitive-radius-8);
  --nav-active-bg:      var(--accent-subtle);
  --nav-active-text:    var(--accent);
  --nav-default-text:   var(--text-secondary);

  --bottom-nav-height:  64px;
  --bottom-nav-bg:      var(--primitive-white);
  --bottom-nav-border:  var(--border);
}
```

### Badge Component
```css
:root {
  --badge-radius:        var(--primitive-radius-pill);
  --badge-font-size:     var(--text-micro-size);
  --badge-font-weight:   500;
  --badge-padding-x:     8px;
  --badge-padding-y:     2px;

  --badge-neutral-bg:    var(--primitive-gray-100);
  --badge-neutral-text:  var(--primitive-gray-700);
  --badge-success-bg:    var(--primitive-green-100);
  --badge-success-text:  var(--primitive-green-600);
  --badge-warning-bg:    var(--primitive-amber-100);
  --badge-warning-text:  var(--primitive-amber-600);
  --badge-error-bg:      var(--primitive-red-100);
  --badge-error-text:    var(--primitive-red-600);
  --badge-accent-bg:     var(--primitive-brand-050);
  --badge-accent-text:   var(--primitive-brand-700);
}
```

### Highlight Component (ZKsync brand pattern)
```css
:root {
  --highlight-bg:        var(--accent-muted);
  --highlight-text:      var(--accent);
  --highlight-radius:    var(--primitive-radius-4);
  --highlight-padding-x: 6px;
  --highlight-padding-y: 2px;
}
```

---

## CI ENFORCEMENT

### Hex Value Lint Rule
The following CI check must pass on every PR:

```bash
#!/bin/bash
grep -rn '#[0-9a-fA-F]\{3,8\}' \
  --include="*.tsx" --include="*.ts" \
  src/app src/components src/hooks src/lib 2>/dev/null \
  && echo 'RAW HEX FOUND' && exit 1 \
  || echo 'No raw hex values found outside token files'
```

### Token Usage Lint Rule
All Tailwind color classes must map to token-backed values only. The custom Tailwind config enforces this by removing all default color palette values and replacing with token-mapped values.
