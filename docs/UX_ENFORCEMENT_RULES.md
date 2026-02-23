# UX ENFORCEMENT RULES
### UISmoke — Version 1.0
### Machine-Enforceable Design Law

> These rules are not suggestions. They are constraints. PRs that violate them do not ship.

---

## RULE SET 1: SCREEN DISCIPLINE

### R1.1 — One Primary CTA Per Screen
**Rule:** Each page component may render at most one element with `variant="primary"`.
**Violation example:** A screen with both "Send" and "Confirm" as equal-weight buttons.
**Remedy:** Promote one, demote the other to secondary or ghost variant.

### R1.2 — Maximum Two Secondary Actions Visible
**Rule:** No more than 2 secondary CTAs may be visible simultaneously without being hidden behind a "more" affordance.
**Exception:** Navigation bars are excluded from this rule.

### R1.3 — No Nested Card-in-Card
**Rule:** Card elements may not be direct or indirect children of other card elements.
**Remedy:** Use list items within cards, not cards within cards.

### R1.4 — Maximum Three Font Sizes Per Screen
**Rule:** Each page-level component may use at most 3 distinct font size classes across its entire render tree.

### R1.5 — Maximum Three Font Weights Per Screen
**Allowed weights:** `font-normal` (400), `font-medium` (500), `font-semibold` (600).
**Banned in the same screen:** `font-bold` (700), `font-extrabold` (800), `font-light` (300).

### R1.6 — Maximum Six Rows Before Scroll
**Rule:** Any card or container that lists items must show at most 6 rows before requiring scroll.

---

## RULE SET 2: TYPOGRAPHY LAW

### R2.1 — Tabular Numerals Only for Financial Values
**Rule:** All elements displaying currency amounts must use `font-variant-numeric: tabular-nums` (via `font-mono` class).
**Why:** Variable-width numbers cause layout shift as values update.

### R2.2 — No ALL CAPS Except Micro Labels
**Rule:** `uppercase` class is only permitted on elements with `text-xs` or `text-[11px]`/`text-micro` and must not exceed 20 characters.

### R2.3 — Maximum 120 Characters Per Sentence
**Rule:** No UI string may exceed 120 characters.

### R2.4 — No Technical Vocabulary in Primary Copy
**Banned words in primary UI:** Domain-specific technical vocabulary that breaks the user's mental model. Each app defines its banned word list in DOMAIN_MODEL.md.
**Allowed in expert view only:** Full technical vocabulary permitted in an opt-in details panel.

### R2.5 — Error Messages Must Never Assign Blame
**Banned constructs:** "You entered an invalid...", "Your action failed...", "You must provide..."
**Required constructs:** "That doesn't look right...", "This didn't go through...", "This field needs..."

---

## RULE SET 3: COLOR AND VISUAL DISCIPLINE

### R3.1 — No Raw Hex Values Outside Token Files
**Rule:** The regex `#[0-9a-fA-F]{3,8}` must never appear in any component file outside of `styles/tokens.css`.
**CI check:** `npm run lint:tokens` must pass.

### R3.2 — Red Color Reserved for Actual Failures
**Rule:** Red coloring must only appear when something is genuinely wrong.
**Banned:** Red as decorative color, red for warnings (use amber), red for empty states.

### R3.3 — No Neon, Gradients, Glow, or Glassmorphism
**Banned CSS properties in component files:**
- `background: linear-gradient` (except tokens.css)
- `text-shadow` with spread > 0
- `backdrop-filter: blur()` on cards
- `filter: drop-shadow()` on interactive elements

### R3.4 — No Emoji in UI
**Rule:** No emoji characters in any component render output.
**Icons:** Use Lucide React only.

### R3.5 — Brand Accent Used Sparingly
**Rule:** The accent color may only appear on: primary CTA button, focus ring, active navigation item, verified badge.

---

## RULE SET 4: MOTION CONSTRAINTS

### R4.1 — Duration Boundaries
**Minimum:** 80ms (micro-interactions)
**Standard:** 120–220ms (state transitions)
**Maximum:** 400ms (page transitions)
**Banned:** Any animation > 400ms except loading states with explicit progress.

### R4.2 — No Bounce, Spring, or Elastic Easing
**Banned:** `spring()`, `bounce`, any easing that overshoots its final position.
**Permitted:** Ease Out, Ease In, Standard (see MOTION_SPEC.md).

### R4.3 — Motion Must Carry Information
**Rule:** Every animation must pass the "delete test" — if removed, would the user lose information?

### R4.4 — Prefers-Reduced-Motion Compliance
**Rule:** Every Framer Motion component must include a reduced motion variant.

---

## RULE SET 5: INTERACTION STANDARDS

### R5.1 — 150ms Visual Feedback Guarantee
**Rule:** Every interactive element must show a visual change within 150ms of interaction.

### R5.2 — Optimistic Updates Required
**Rule:** Any action that modifies UI state must show the result immediately, before async operations resolve.
**Exception:** Explicitly destructive actions may show a brief processing state.

### R5.3 — No Blocking Spinners Without Context
**Rule:** Any spinner visible for more than 200ms must have an accompanying text message.

### R5.4 — Destructive Actions Require Confirmation Modal
**Rule:** Any action that cannot be undone must trigger a confirmation modal with clear title, consequence description, and Cancel option.

### R5.5 — Forms Never Reset on Error
**Rule:** If a form submission fails, the form must retain all user-entered values.

### R5.6 — Back Navigation Preserves State
**Rule:** Navigating back in a multi-step flow must restore all previously entered values.

---

## RULE SET 6: DENSITY AND SPACING

### R6.1 — 8pt Grid Strict Enforcement
**Rule:** All spacing values must be multiples of 8px (or 4px for micro-spacing).

### R6.2 — Prefer Spacing Over Visual Separators
**Rule:** When two sections need separation, increase margin/padding before adding a border.

### R6.3 — Minimum Touch Target
**Rule:** All interactive elements must have a minimum tap area of 44×44px.

---

## RULE SET 7: FINANCIAL DISPLAY STANDARDS

> Note: If the app doesn't handle monetary values, this section can be adapted for other numeric display.

### R7.1 — Currency Symbol Always Precedes Amount
**Format:** `$1,234.56` — never `1,234.56 USD` in primary display.

### R7.2 — Amounts Always Show Two Decimal Places
**Implementation:** `Intl.NumberFormat` with `minimumFractionDigits: 2, maximumFractionDigits: 2`.

### R7.3 — Large Numbers Use Thousand Separators
**Rule:** All amounts ≥ 1,000 must display with comma separators.

### R7.4 — Negative Values Use Minus Sign, Not Parentheses
**Rule:** `-$250.00` not `($250.00)`.

### R7.5 — Pending Amounts Use Standard Formatting
**Rule:** Pending amounts display with `opacity-60`. Not strikethrough or different font size.

---

## RULE SET 8: EMPTY STATES

### R8.1 — Every List Has an Empty State
**Rule:** Any list component must handle the empty case with: icon + headline + subline + optional CTA.

### R8.2 — Empty States Are Invitations, Not Apologies
**Banned copy:** "No items yet", "Nothing here", "No data available"
**Required copy style:** Action-oriented, future-focused. Example: "Your activity will appear here"

### R8.3 — Empty States Must Not Shift Layout
**Rule:** Empty state elements must occupy the same height as the minimum populated state.

---

## ENFORCEMENT CHECKPOINTS

### Gate 1: Pre-commit (automated)
- No raw hex in component files
- No `Math.random()` in component files
- All files under line limits

### Gate 2: CI (automated)
- All unit tests pass
- All E2E tests pass
- No horizontal scroll at 375px viewport

### Gate 3: Code Review (human / code-reviewer agent)
- Engineering checklist verified

### Gate 4: Design Review (human / ux-reviewer agent)
- UX enforcement checklist verified
- Mobile layout verified at 375px
