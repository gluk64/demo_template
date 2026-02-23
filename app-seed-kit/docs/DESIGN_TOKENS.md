# DESIGN TOKENS
### [APP_NAME] — Version 1.0
### Single Source of Truth for All Visual Values

> This file is the canonical reference for every visual constant. No value in this file may be overridden inline. All token changes require a design review.

---

## THEME DIRECTION

The current theme follows these principles. These can be changed — update
this section and the corresponding token values when shifting direction.

**Current direction:** Dark-first, institutionally calm, Swiss precision
**Accent:** Single blue (#4F6EF7)
**Feel:** Restrained, technical, timeless
**Personality:** Confident, minimal, precise

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

### Color Primitives (zinc scale + brand)
```css
:root {
  /* Zinc scale */
  --primitive-zinc-950: #09090B;
  --primitive-zinc-900: #18181B;
  --primitive-zinc-800: #27272A;
  --primitive-zinc-700: #3F3F46;
  --primitive-zinc-600: #52525B;
  --primitive-zinc-500: #71717A;
  --primitive-zinc-400: #A1A1AA;
  --primitive-zinc-300: #D4D4D8;
  --primitive-zinc-200: #E4E4E7;
  --primitive-zinc-100: #F4F4F5;
  --primitive-zinc-050: #FAFAFA;

  /* Zinc between-steps */
  --primitive-zinc-925: #111113;
  --primitive-zinc-850: #1A1A1E;

  /* Brand blue */
  --primitive-brand-300: #93AAFB;
  --primitive-brand-400: #7B96FA;
  --primitive-brand-500: #4F6EF7;
  --primitive-brand-600: #3B5BF6;
  --primitive-brand-700: #2D4AD4;

  /* Semantic primitives */
  --primitive-green-500: #22C55E;
  --primitive-green-400: #4ADE80;
  --primitive-amber-500: #F59E0B;
  --primitive-amber-400: #FBBF24;
  --primitive-red-500:   #EF4444;
  --primitive-red-400:   #F87171;
  --primitive-slate-400: #94A3B8;
}
```

### Spacing Primitives
```css
:root {
  --primitive-space-1:  4px;
  --primitive-space-2:  8px;
  --primitive-space-3:  12px;
  --primitive-space-4:  16px;
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
  --primitive-font-sans:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --primitive-font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  --primitive-size-11: 11px;
  --primitive-size-12: 12px;
  --primitive-size-13: 13px;
  --primitive-size-14: 14px;
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
}
```

### Border Primitives
```css
:root {
  --primitive-radius-4:  4px;
  --primitive-radius-6:  6px;
  --primitive-radius-8:  8px;
  --primitive-radius-12: 12px;
  --primitive-radius-16: 16px;
  --primitive-radius-full: 9999px;

  --primitive-border-width-1: 1px;
  --primitive-border-width-2: 2px;
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
}
```

---

## TIER 2: SEMANTIC TOKENS

### Color Semantics
```css
:root {
  /* Backgrounds */
  --bg-base:     var(--primitive-zinc-950);
  --bg-surface:  var(--primitive-zinc-925);
  --bg-raised:   var(--primitive-zinc-900);
  --bg-overlay:  var(--primitive-zinc-800);

  /* Text */
  --text-primary:   var(--primitive-zinc-050);
  --text-secondary: var(--primitive-zinc-400);
  --text-tertiary:  var(--primitive-zinc-500);
  --text-disabled:  var(--primitive-zinc-600);

  /* Accent */
  --accent:         var(--primitive-brand-500);
  --accent-hover:   var(--primitive-brand-400);
  --accent-subtle:  rgba(79, 110, 247, 0.10);

  /* Borders */
  --border:         rgba(255, 255, 255, 0.08);
  --border-strong:  rgba(255, 255, 255, 0.14);

  /* Semantic states */
  --success:        var(--primitive-green-500);
  --warning:        var(--primitive-amber-500);
  --error:          var(--primitive-red-500);
}
```

### Typography Semantics
```css
:root {
  --font-sans: var(--primitive-font-sans);
  --font-mono: var(--primitive-font-mono);

  /* Type scale — named by role */
  --text-display-size:    56px;
  --text-display-leading: 1.0;
  --text-display-weight:  600;

  --text-h1-size:    36px;
  --text-h1-leading: 1.15;
  --text-h1-weight:  600;

  --text-h2-size:    24px;
  --text-h2-leading: 1.3;
  --text-h2-weight:  600;

  --text-h3-size:    22px;
  --text-h3-leading: 1.3;
  --text-h3-weight:  500;

  --text-body-size:    16px;
  --text-body-leading: 1.6;
  --text-body-weight:  400;

  --text-sm-size:    15px;
  --text-sm-leading: 1.55;
  --text-sm-weight:  400;

  --text-label-size:    13px;
  --text-label-leading: 1.4;
  --text-label-weight:  500;

  --text-micro-size:    12px;
  --text-micro-leading: 1.4;
  --text-micro-weight:  500;
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
  --btn-primary-height:      52px;
  --btn-primary-radius:      var(--primitive-radius-12);
  --btn-primary-font-size:   16px;
  --btn-primary-font-weight: 500;

  --btn-secondary-bg:        transparent;
  --btn-secondary-bg-hover:  var(--bg-raised);
  --btn-secondary-border:    var(--border-strong);
  --btn-secondary-text:      var(--text-primary);

  --btn-ghost-bg:            transparent;
  --btn-ghost-bg-hover:      var(--bg-raised);
  --btn-ghost-text:          var(--text-secondary);
  --btn-ghost-text-hover:    var(--text-primary);

  --btn-disabled-opacity:    0.4;
  --btn-transform-active:    scale(0.97);
}
```

### Card Component
```css
:root {
  --card-bg:            var(--bg-surface);
  --card-border:        var(--border);
  --card-radius:        var(--primitive-radius-12);
  --card-padding:       28px;
}
```

### Input Component
```css
:root {
  --input-bg:              var(--bg-overlay);
  --input-border:          var(--border);
  --input-border-focus:    var(--accent);
  --input-border-error:    var(--error);
  --input-radius:          var(--primitive-radius-12);
  --input-height:          52px;
  --input-font-size:       16px;
  --input-text:            var(--text-primary);
  --input-placeholder:     var(--text-disabled);
}
```

### Modal Component
```css
:root {
  --modal-overlay-bg:   rgba(0, 0, 0, 0.6);
  --modal-bg:           var(--bg-overlay);
  --modal-border:       var(--border);
  --modal-radius:       var(--primitive-radius-16);
  --modal-padding:      32px;
  --modal-max-width:    480px;
}
```

### Navigation Component
```css
:root {
  --sidebar-width:      240px;
  --sidebar-bg:         var(--bg-surface);
  --sidebar-border:     var(--border);
  --nav-item-radius:    var(--primitive-radius-8);
  --nav-active-bg:      var(--accent-subtle);
  --nav-active-text:    var(--accent);
  --nav-default-text:   var(--text-secondary);

  --bottom-nav-height:  64px;
  --bottom-nav-bg:      var(--bg-surface);
  --bottom-nav-border:  var(--border);
}
```

---

## CI ENFORCEMENT

### Hex Value Lint Rule
The following CI check must pass on every PR:

```bash
#!/bin/bash
# Fails build if raw hex values found outside token files
grep -rn '#[0-9a-fA-F]\{3,8\}' \
  --include="*.tsx" --include="*.ts" \
  src/app src/components src/hooks src/lib 2>/dev/null \
  && echo 'RAW HEX FOUND' && exit 1 \
  || echo 'No raw hex values found outside token files'
```

### Token Usage Lint Rule
All Tailwind color classes must map to token-backed values only. The custom Tailwind config enforces this by removing all default color palette values and replacing with token-mapped values.
