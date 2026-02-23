# UX GUIDELINES
### [APP_NAME] — Version 1.0
### Expert Panel: Apple HIG, Google Material Design, Airbnb Design, Linear, Stripe

---

## PART I: PHILOSOPHY

### 1.1 The Prime Directive

> **The user's mental model is: "This is mine."**
>
> Every design decision is evaluated against this standard. If a feature, label, or interaction requires the user to think about *how the technology works*, it has failed.

---

### 1.2 The Five Psychological Commitments

#### COMMITMENT 1: Safety Before Speed

Interfaces that handle valuable resources carry unique emotional weight. A user about to perform an important action is in a state of heightened vigilance — their tolerance for ambiguity is zero.

**Design mandate:** Every irreversible action must feel *deliberately difficult* to complete accidentally, while feeling *naturally easy* for confident users who know what they're doing.

**Applied rules:**
- Confirmation screens for important irreversible actions
- Explicit typing of values (no sliders) for irreversible actions
- The primary action button is never the first thing the eye lands on

---

#### COMMITMENT 2: Progressive Disclosure

Information should appear at the moment it becomes relevant — no sooner, no later.

**The three tiers of information:**

| Tier | Visible when | Example |
|------|-------------|---------|
| Essential | Always | Key values, names, primary status |
| Contextual | When relevant | Details that matter during a flow |
| Expert | On request | Technical details, behind a deliberate tap |

---

#### COMMITMENT 3: Temporal Honesty

The user must always know where they are in time relative to their actions.

**Required temporal signals:**
- Every action has a human timestamp ("2 minutes ago", "Yesterday at 3:41 PM")
- Pending actions have an estimated completion time
- No action ever appears without a status indicator

**What we never do:**
- Show "Pending" without an estimate
- Show a loader without a message
- Show a success state before the action is meaningfully complete

---

#### COMMITMENT 4: Reversibility Signaling

Users need to know *before* they act what can and cannot be undone.

**Protocol:**
- Reversible actions: Standard button with no additional warning
- Semi-reversible actions: Warning badge inline
- Irreversible actions: Full confirmation modal with explicit consequences

---

#### COMMITMENT 5: Emotional Safety Baseline

**The emotional safety toolkit:**

1. **Verified entities** — Green checkmark on known items signals "we recognize this."
2. **New entity warning** — When interacting with something new, the interface pauses with a caring warning.
3. **Private mode** — Sensitive values can be blurred for screen sharing.
4. **Honest error messages** — Never say "Action failed." Say what happened, reassure, and suggest next steps.

---

### 1.3 Principles from the Expert Panel

**From Apple HIG:**
> Every layout decision should feel like the only possible choice.

**From Google Material Design:**
> Motion should describe spatial relationships and guide attention.

**From Airbnb Design:**
> Trust is built through consistency, clarity, and humanity.

**From Linear:**
> Speed is a feature. Every millisecond of perceived lag is a trust deficit.

**From Stripe:**
> The best onboarding is no onboarding.

---

## PART II: SCREEN-LEVEL DESIGN STANDARDS

### 2.1 The One-Primary-Action Rule

Every screen has exactly one thing it wants the user to do. That action:
- Is the largest interactive element on screen
- Has the highest contrast
- Is reached by the most direct gesture

All other interactive elements are secondary and visually subordinate.

### 2.2 Information Hierarchy (Per Screen)

Each screen uses a strict three-tier hierarchy:

```
TIER 1: Identity / Context         (What screen is this?)
  — Page title, key value, primary name
  — Font: heading scale, weight 600, color: --text-primary

TIER 2: Primary Information        (What matters most right now?)
  — The number, the action, the status
  — Font: body/lg scale, weight 500, color: --text-primary

TIER 3: Supporting Detail          (Why / when / how?)
  — Labels, metadata, help text
  — Font: sm/label scale, weight 400, color: --text-secondary
```

**Maximum rule:** No more than 3 font sizes per screen. No more than 3 font weights per screen.

### 2.3 Screen-Specific Intent Maps

> Screen-specific intent maps are defined per app in DOMAIN_MODEL.md and in the product briefs. Each screen should follow the One-Primary-Action Rule and the three-tier information hierarchy above.

---

## PART III: MICRO-COPY STANDARDS

### 3.1 Writing Principles

**The Copy Test:**
1. Is it clear? (Would a 12-year-old understand it?)
2. Is it concise? (Can you cut 30% without losing meaning?)
3. Is it warm? (Does it sound like a helpful human?)
4. Is it accurate? (Does it set correct expectations?)

### 3.2 Error Message Framework

**Structure:** [What happened] + [Reassurance] + [What to do]

| Don't | Do |
|-------|-----|
| "Action failed" | "That didn't go through. Your data is safe." |
| "Invalid input" | "That doesn't look right — double-check and try again." |
| "Insufficient balance" | "You'd need $X more to complete this." |
| "Network error" | "We lost connection for a moment. Try again." |
| "Unknown error" | "Something went wrong on our end. Try again in a moment." |

### 3.3 Confirmation Copy Framework

**Structure:** [Specific action] + [Consequence]

Rules:
- Always name the specific item or recipient
- Always state the exact values
- Always explain what happens after
- Never use "are you sure" — it's weak and vague
- Confirm button is always the right action (positive framing)

### 3.4 Placeholder Text Standards

Placeholders must:
- Show an example of valid input (not a label)
- Disappear immediately on focus

### 3.5 Status Label Standards

| State | Label | Color |
|-------|-------|-------|
| Processing | "Processing..." | --text-secondary |
| Success | "Complete" | --success |
| Failed | "Not completed" | --error |
| Pending | "In progress" | --text-secondary |

Never use technical vocabulary in status labels.

---

## PART IV: INTERACTION DESIGN PATTERNS

### 4.1 The Entity Verification Pattern

**Trigger:** User selects or enters a target for an action

**Decision tree:**
```
Is target in known list?
  ├─ YES → Is verified?
  │         ├─ YES → Show green checkmark. Proceed normally.
  │         └─ NO  → Show yellow badge. Proceed with inline warning.
  └─ NO  → Show warning: "New [entity]"
              - Details shown in full
              - Checkbox: "I've confirmed this is correct"
              - Only then enable action
```

### 4.2 The Optimistic Action Pattern

```
User triggers action
  ↓
IMMEDIATE (0ms):
  - Button → loading state
  - Input locks

IMMEDIATE (50ms):
  - Navigate to result view
  - Optimistic state shown immediately
  - Values updated optimistically

BACKGROUND (mock delay):
  - Mock operation resolves
  - If success: state confirmed
  - If failure: state rolled back, toast shown

ON FAILURE:
  - Toast with error message (what happened + reassurance + what to do)
  - Retry action available
```

### 4.3 The Private Mode Pattern

**Activation:** Toggle in settings or top bar

**Effect:**
- All sensitive values blur with CSS `filter: blur(8px)`
- 200ms fade transition
- Labels and navigation preserved

### 4.4 The Copy Animation Pattern

**Sequence:**
```
t=0:    Icon morphs from copy-icon → checkmark (100ms)
t=100:  Color: --text-secondary → --success (100ms)
t=1200: Color back: --success → --text-secondary (200ms)
t=1400: Icon morphs back: checkmark → copy-icon (150ms)
```

Never use a toast for copy confirmation.

---

## PART V: RESPONSIVE DESIGN STANDARDS

### 5.1 Breakpoint Philosophy

Mobile-first, desktop-capable.

```
Mobile: 0–767px     → Bottom navigation, full-width cards, stacked layout
Tablet: 768–1023px  → Side-by-side where beneficial
Desktop: 1024px+    → Sidebar navigation, multi-column where appropriate
```

### 5.2 Mobile Navigation

Bottom navigation:
- 5 items maximum
- Active state: Brand color icon + label
- Inactive: Muted icon
- Height: 64px + device safe area

### 5.3 Desktop Sidebar

- Width: 240px fixed
- Active state: Solid background highlight, brand color text

### 5.4 No-Horizontal-Scroll Guarantee

- All containers: `overflow-x: hidden` at root
- No fixed-width elements wider than 375px without responsive adaptation
- Long strings always truncated with ellipsis

---

## PART VI: ACCESSIBILITY STANDARDS

### 6.1 Baseline Requirements

- WCAG 2.1 AA minimum across all interactive elements
- All interactive elements: minimum 44×44px tap target
- All form fields: explicit `<label>` association
- Error messages: `aria-live="polite"` for async errors
- Color never the only differentiator of state

### 6.2 Focus Management

- Focus trapped within modals
- Focus returns to trigger element when modal closes
- Skip link: "Skip to main content" for keyboard users

### 6.3 Reduced Motion

All animations must respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  /* Transitions: opacity only, no translate/scale */
  /* Duration: max 100ms */
}
```

---

## APPENDIX: UX ANTI-PATTERN REGISTRY

These patterns are **permanently banned**.

| Anti-pattern | Why banned | Acceptable alternative |
|---|---|---|
| "Are you sure?" confirmation | Weak, generic, adds no information | State the specific consequence |
| Toast for copy confirmation | Noisy, unnecessary | Inline icon morph |
| Success modal after action | Interrupts flow | Optimistic inline state |
| Skeleton loaders > 400ms | Implies slowness | Optimistic update eliminates need |
| Multiple CTAs at same visual weight | Splits attention | One primary, all others subordinate |
