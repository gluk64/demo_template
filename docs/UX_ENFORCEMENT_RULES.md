# UX ENFORCEMENT RULES
### Not a Bank — Version 2.0
### Machine-Enforceable Design Law

> These rules are not suggestions. They are constraints. PRs that violate them do not ship.
> Linters, code review checklists, and E2E tests enforce them automatically.

---

## RULE SET 1: SCREEN DISCIPLINE

### R1.1 — One Primary CTA Per Screen
**Rule:** Each page component may render at most one element with `data-primary-action="true"` or `variant="primary"`.
**Test:** `expect(screen.getAllByRole('button', { name: /primary/i })).toHaveLength(1)`
**Violation example:** A screen with both "Send" and "Confirm" as equal-weight buttons.
**Remedy:** Promote one, demote the other to secondary or ghost variant.

### R1.2 — Maximum Two Secondary Actions Visible
**Rule:** No more than 2 secondary CTAs may be visible simultaneously without being hidden behind a "more" affordance.
**Exception:** Navigation bars are excluded from this rule.

### R1.3 — No Nested Card-in-Card
**Rule:** Elements with `data-card` or class `.card` may not be direct or indirect children of other card elements.
**Linter rule:** Custom ESLint rule `no-nested-cards`.
**Violation example:** A transaction detail row that is itself a card inside the Activity card.
**Remedy:** Use list items within cards, not cards within cards.

### R1.4 — Maximum Three Font Sizes Per Screen
**Rule:** Each page-level component may use at most 3 distinct `text-*` Tailwind classes across its entire render tree.
**Allowed set per screen:** One from `[text-3xl, text-4xl]` (hero), one from `[text-base, text-lg]` (body), one from `[text-xs, text-sm]` (meta).
**Test:** Visual regression snapshot with annotated font-size extraction.

### R1.5 — Maximum Three Font Weights Per Screen
**Allowed weights:** `font-normal` (400), `font-medium` (500), `font-semibold` (600).
**Banned:** `font-bold` (700), `font-extrabold` (800), `font-light` (300) in the same screen.

### R1.6 — Maximum Six Rows Before Scroll
**Rule:** Any card or container that lists items must show at most 6 rows before requiring scroll. Remaining items must be accessible via natural scroll, not pagination.
**Exception:** The Activity feed is a scrollable viewport by design.

---

## RULE SET 2: TYPOGRAPHY LAW

### R2.1 — Tabular Numerals Only for Financial Values
**Rule:** All elements displaying currency amounts, balances, or transaction values must use `font-variant-numeric: tabular-nums`.
**Implementation:** Applied via `.font-mono` or custom class `.num-tabular`.
**Why:** Variable-width numbers cause layout shift as values update.

### R2.2 — No ALL CAPS Except Micro Labels
**Rule:** `uppercase` Tailwind class is only permitted on elements with `text-xs` or `text-[11px]` and must not exceed 20 characters.
**Banned contexts:** Headings, button labels, body copy.
**Permitted contexts:** Status badges ("PENDING", "VERIFIED"), category labels ("STABLECOIN").

### R2.3 — Maximum 120 Characters Per Sentence
**Rule:** No UI string (label, body copy, error message, confirmation text) may exceed 120 characters.
**Automated check:** String length linter on all translation/copy files.

### R2.4 — No Technical Vocabulary in Primary Copy
**Banned words in primary UI:** gas, L1, L2, mainnet, testnet, gwei, wei, nonce, mempool, finalized, mined, block, EVM, calldata.
**Allowed in expert view only:** Full technical vocabulary permitted in an opt-in "Developer details" panel.

### R2.5 — Error Messages Must Never Assign Blame
**Banned constructs:** "You entered an invalid...", "Your transaction failed...", "You must provide..."
**Required constructs:** "That doesn't look right...", "The payment didn't go through...", "This field needs..."

---

## RULE SET 3: COLOR AND VISUAL DISCIPLINE

### R3.1 — No Raw Hex Values Outside Token Files
**Rule:** The regex `#[0-9a-fA-F]{3,8}` must never appear in any `.tsx`, `.ts`, `.css` file outside of `styles/tokens.css`.
**CI check:** `grep -rn '#[0-9a-fA-F]\{3,6\}' --include="*.tsx" --include="*.ts" app/ components/` must return zero results.
**Remedy:** Replace all raw hex with CSS variable references: `var(--color-*)` or mapped Tailwind classes.

### R3.2 — Red Color Reserved for Actual Failures
**Rule:** Any element with red coloring (`text-red-*`, `bg-red-*`, `border-red-*`) must have an associated `aria-live` region or `role="alert"`.
**Why:** Red creates anxiety. It must only appear when something is genuinely wrong.
**Banned:** Red as decorative color, red for warnings (use amber), red for empty states.

### R3.3 — No Neon, Gradients, Glow, or Glassmorphism
**Banned CSS properties in component files:**
- `background: linear-gradient` (except `tokens.css`)
- `text-shadow` with spread > 0
- `box-shadow` with opacity > 0.3 and spread > 12px
- `backdrop-filter: blur()` on cards or overlays
- `filter: drop-shadow()` on interactive elements

**Permitted:** Single-direction subtle box shadows for elevation (defined in token set only).

### R3.4 — No Emoji in UI
**Rule:** No emoji characters (`\u{1F300}-\u{1FFFF}` range) in any component render output.
**Icons:** Use Lucide React or Phosphor icons only. Always with explicit `aria-label`.

### R3.5 — Brand Accent Used Sparingly
**Rule:** The primary brand color (`--color-accent`) may only appear on:
- Primary CTA button (fill)
- Focus ring (outline)
- Active navigation item (icon + text)
- Verified badge checkmark
**All other uses require explicit design review.**

---

## RULE SET 4: MOTION CONSTRAINTS

### R4.1 — Duration Boundaries
**Minimum:** 80ms (micro-interactions: button press, checkbox tick)
**Standard:** 120–220ms (state transitions, modal open/close)
**Maximum:** 400ms (page transitions, complex reveals)
**Banned:** Any animation > 400ms except loading states with explicit progress indication.

### R4.2 — No Bounce, Spring, or Elastic Easing
**Banned easing values:**
- `cubic-bezier` with control points outside [0,1] range on y-axis
- `spring()` or physics-based easings
- Any animation that overshoots its final position

**Permitted easings:**
- Enter: `cubic-bezier(0.0, 0.0, 0.2, 1)` (easeOutCubic)
- Exit: `cubic-bezier(0.4, 0.0, 1, 1)` (easeInCubic)
- Standard: `cubic-bezier(0.4, 0.0, 0.2, 1)` (standard)

### R4.3 — Motion Must Carry Information
**Rule:** Every animation must pass the "delete test" — if the animation were removed, would the user lose information about what changed, or why?
**Pass:** Route transition (shows navigation), balance update highlight (shows value changed), sending state (shows action in progress).
**Fail:** Decorative hover scale on cards, pulsing glow on logo, staggered list entrance.

### R4.4 — Prefers-Reduced-Motion Compliance
**Rule:** Every Framer Motion component must include a `reducedMotion` variant:
```typescript
const animation = useReducedMotion()
  ? { opacity: 1 } 
  : { opacity: 1, y: 0 };
```

---

## RULE SET 5: INTERACTION STANDARDS

### R5.1 — 150ms Visual Feedback Guarantee
**Rule:** Every interactive element must show a visual change within 150ms of user interaction.
**Implementation:** `transition-colors duration-100` on all buttons, inputs, and interactive elements.
**Test:** Performance observer measuring interaction-to-paint latency.

### R5.2 — Optimistic Updates Required
**Rule:** Any action that modifies the UI state must show the result immediately, before any mock async operation resolves.
**Exception:** Explicitly destructive actions (deletes, irreversible sends) may show a brief processing state before confirming.
**Test:** UI state must change within 50ms of action trigger.

### R5.3 — No Blocking Spinners Without Context
**Rule:** Any spinner visible for more than 200ms must have an accompanying text message.
**Spinner-only states (< 200ms):** Permitted.
**Extended loading:** Must show: spinner + message + estimated duration or progress.

### R5.4 — Destructive Actions Require Confirmation Modal
**Rule:** Any action that cannot be undone must trigger a `<Modal>` component with:
- Clear title stating the specific action
- Body text stating the consequence
- Two buttons: Confirm (primary) and Cancel (ghost)
- Cancel must be the keyboard-escape default

### R5.5 — Forms Never Reset on Error
**Rule:** If a form submission fails, the form must retain all user-entered values.
**Implementation:** React Hook Form's default behavior must not be overridden with `reset()` on error paths.

### R5.6 — Back Navigation Preserves State
**Rule:** Navigating back in a multi-step flow must restore all previously entered values.
**Implementation:** Store form state in Zustand `ui` slice during multi-step flows, clear on completion or explicit cancel.

---

## RULE SET 6: DENSITY AND SPACING

### R6.1 — 8pt Grid Strict Enforcement
**Rule:** All spacing values must be multiples of 8px (or 4px for micro-spacing).
**Tailwind mapping:** Use only `p-1, p-2, p-3, p-4, p-6, p-8, p-10, p-12, p-16` (4, 8, 12, 16, 24, 32, 40, 48, 64px).
**Banned:** Custom spacing values that break the grid (e.g., `p-5`, `p-7`, `p-9`).

### R6.2 — No Horizontal Rule Separators
**Rule:** No `<hr>`, `border-b`, or `border-t` as visual dividers between content sections.
**Why:** Dividers add visual noise. Whitespace communicates separation more elegantly.
**Permitted:** Single hairline border on cards (exterior only), table row borders.

### R6.3 — Prefer Spacing Over Visual Separators
**Rule:** When two content sections need visual separation, increase `margin-bottom` or `padding` before adding a border or background color.

### R6.4 — Minimum Touch Target
**Rule:** All interactive elements must have a minimum tap area of 44×44px.
**Implementation:** Use `min-h-[44px] min-w-[44px]` on all buttons. For icon buttons, use padding to extend tap area.

---

## RULE SET 7: FINANCIAL DISPLAY STANDARDS

### R7.1 — Currency Symbol Always Precedes Amount
**Format:** `$1,234.56` — never `1,234.56 USD` in primary display.
**Secondary display (when needed):** `$1,234.56 USDC` — currency code after, smaller, muted.

### R7.2 — Amounts Always Show Two Decimal Places
**Rule:** Financial amounts always display exactly two decimal places.
**Implementation:** `Intl.NumberFormat` with `minimumFractionDigits: 2, maximumFractionDigits: 2`.
**Banned:** `$1,234.5` or `$1,234` for fiat-denominated values.

### R7.3 — Large Numbers Use Thousand Separators
**Rule:** All amounts ≥ 1,000 must display with comma separators.
**Implementation:** `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.

### R7.4 — Negative Values Use Minus Sign, Not Parentheses
**Rule:** `-$250.00` not `($250.00)`.
**Color:** Negative values do not use red color. Red is reserved for errors. Negative transactions use `--text-secondary`.

### R7.5 — Pending Amounts Use Standard Formatting
**Rule:** Pending amounts display with `opacity-60` applied to the amount element.
**Not permitted:** Strike-through, different font size, "(pending)" suffix.

---

## RULE SET 8: EMPTY STATES

### R8.1 — Every List Has an Empty State
**Rule:** Any component that renders a list must handle the empty case with:
- An illustrative icon (Lucide, not emoji)
- A headline (max 40 chars)
- A subline explaining next action (max 80 chars)
- Optional: A single CTA leading to the first action

### R8.2 — Empty States Are Invitations, Not Apologies
**Banned copy:** "No transactions yet", "Nothing here", "No data available"
**Required copy style:** Action-oriented, future-focused.
**Example:** "Your activity will appear here" with subline "Send or receive to get started."

### R8.3 — Empty States Must Not Shift Layout
**Rule:** Empty state elements must occupy the same height as the minimum populated state would. This prevents layout shift when content loads.

---

## ENFORCEMENT CHECKPOINTS

These are checked at four gates:

### Gate 1: Pre-commit (automated)
- No raw hex in component files
- No banned vocabulary in copy files
- No `Math.random()` in component files
- All files under 300 lines

### Gate 2: CI (automated)
- All unit tests pass
- All E2E tests pass
- No horizontal scroll at 375px viewport
- Color contrast ratios meet WCAG AA

### Gate 3: Code Review (human)
- UX enforcement checklist attached to PR template
- Reviewer signs off on: copy quality, interaction fidelity, motion appropriateness

### Gate 4: Design Review (human)
- Visual regression screenshots reviewed
- Mobile layout verified at 375px
- Desktop layout verified at 1440px
- Dark mode checked
