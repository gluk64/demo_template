# UX Rules
### [APP_NAME] — Enforceable Design Constraints

---

## Screen Discipline

- **One primary CTA per screen.** All other actions are secondary or ghost variant.
- Maximum 2 secondary actions visible without a "more" affordance (nav excluded).
- No nested card-in-card. Use list items within cards instead.
- Maximum 3 font sizes per screen. Maximum 3 font weights (400, 500, 600).
- Maximum 6 rows in any list before scroll.

## Typography

- Tabular numerals (`font-mono`) on all numeric values — prevents layout shift.
- `uppercase` only on micro labels (`text-micro` / `text-label`, max 20 chars).
- No UI string exceeds 120 characters.
- No technical vocabulary in primary copy. Plain language only.

## Color

- No raw hex values in component files — use token classes only.
- Red reserved for actual failures. Use amber for warnings, not red.
- No neon, gradients, glow, glassmorphism, or decorative color.
- No emoji in UI. Icons from Lucide React only.
- Brand accent only on: primary CTA, focus ring, active nav item.

## Spacing & Touch

- All spacing on 8pt grid (4px for micro-spacing, 8px multiples for standard).
- All interactive elements: minimum 44×44px touch target.
- Prefer spacing over visual separators (margin/padding before borders).

## Motion

- Duration range: 80ms (micro) to 400ms (page transitions). Nothing longer without progress indication.
- **Banned easings:** spring, bounce, elastic, linear, CSS default `ease`.
- **Permitted:** Ease Out `cubic-bezier(0, 0, 0.2, 1)`, Ease In `cubic-bezier(0.4, 0, 1, 1)`, Standard `cubic-bezier(0.4, 0, 0.2, 1)`.
- Exit animations faster than enter animations.
- Every Framer Motion component must include `useReducedMotion` fallback.
- Every animation must pass the delete test: if removed, would the user lose information?

## Interaction

- 150ms visual feedback guarantee on all interactive elements.
- Optimistic updates required — UI changes within 50ms of user action.
- No blocking spinners without accompanying text message.
- Destructive actions require confirmation modal with specific consequence description.
- Forms retain all values on submission error.
- Back navigation preserves state in multi-step flows.

## Copy

- **Error messages:** [What happened] + [Reassurance] + [What to do].
  - Banned: "You entered...", "Your action failed...", "Invalid..."
  - Required: "That doesn't look right...", "This didn't go through. Your data is safe."
- **Empty states** are invitations, not apologies.
  - Banned: "No items yet", "Nothing here", "No data available"
  - Required: Action-oriented, future-focused. "Your activity will appear here"
- **Confirmations** name the specific action and consequence. Never "Are you sure?"
- Placeholders show examples of valid input, not labels.

## Accessibility

- All interactive elements: minimum 44×44px tap target.
- All form fields: explicit `<label>` association via `htmlFor`.
- Error messages: `aria-live="polite"` for async errors.
- Color is never the sole differentiator of state.
- Focus trapped within modals. Focus returns to trigger on close.
