# UX GUIDELINES
### Not a Bank — Version 2.0
### Expert Panel: Apple HIG, Google Material Design, Airbnb Design, Linear, Stripe

---

## PART I: PHILOSOPHY

### 1.1 The Prime Directive

> **The user's mental model is: "This is my money."**
>
> Every design decision is evaluated against this standard. If a feature, label, or interaction requires the user to think about *how the technology works*, it has failed.

We are not building a crypto product. We are building a financial product that happens to be powered by cryptography. The distinction determines every choice.

---

### 1.2 The Five Psychological Commitments

#### COMMITMENT 1: Safety Before Speed

Financial interfaces carry a unique emotional weight. A user about to send $10,000 is in a state of heightened vigilance — their amygdala is active, their tolerance for ambiguity is zero.

**Design mandate:** Every irreversible action must feel *deliberately difficult* to complete accidentally, while feeling *naturally easy* for confident users who know what they're doing.

This is not friction for friction's sake. It is the difference between a bank vault door and a screen door.

**Applied rules:**
- Confirmation screens for all sends over $100
- Explicit typing of amount (no sliders) for irreversible actions
- Contact verification state is always visible before sending
- The "Send" button is never the first thing the eye lands on

---

#### COMMITMENT 2: Progressive Disclosure

Information should appear at the moment it becomes relevant — no sooner, no later.

**The three tiers of information:**

| Tier | Visible when | Example |
|------|-------------|---------|
| Essential | Always | Balance, recipient name, send amount |
| Contextual | When relevant | Fee amount (only during send flow) |
| Expert | On request | Full transaction hash, L1 details |

**Never show** network names, gas fees, L1/L2 distinctions, or blockchain addresses in primary UI flows. These exist in expert view only, behind a deliberate tap.

---

#### COMMITMENT 3: Temporal Honesty

The user must always know where they are in time relative to their money.

**Required temporal signals:**
- Every transaction has a human timestamp ("2 minutes ago", "Yesterday at 3:41 PM")
- Pending transactions have an estimated completion time ("Usually complete in under 1 minute")
- No transaction ever appears without a status indicator

**What we never do:**
- Show "Pending" without an estimate
- Show a loader without a message
- Show a success state before the action is meaningfully complete

---

#### COMMITMENT 4: Reversibility Signaling

Users need to know *before* they act what can and cannot be undone.

**Protocol:**
- Reversible actions: Standard button with no additional warning
- Semi-reversible actions (can be re-done but not undone): Warning badge inline
- Irreversible actions (sends, address generation): Full confirmation modal with explicit consequences stated in plain English

**Copy template for irreversible actions:**
> "Once sent, this cannot be recalled. If [recipient] doesn't recognize this transaction, contact them directly."

Never use legal language. Never use technical language. Write like a trusted friend who happens to be a banker.

---

#### COMMITMENT 5: Emotional Safety Baseline

Crypto has historically felt dangerous. Our job is to remove that feeling without removing the reality check.

**The emotional safety toolkit:**

1. **Verified contacts** — Green checkmark on known contacts. Not because it's technically more secure, but because it signals "we know this person."

2. **New recipient warning** — When a user sends to someone new, the interface pauses and says: *"You haven't sent to this address before. Double-check it's correct."* This is not a blocker. It is a caring pause.

3. **Private mode** — Numbers can be blurred for screen sharing. This signals: we understand that your financial data is personal. We protect you even from your own screen.

4. **Honest error messages** — Never say "Transaction failed." Say "We couldn't send your payment. Your funds are safe — try again or contact support." The funds are always, always safe in the error message.

---

### 1.3 Principles from the Expert Panel

#### From Apple HIG:
> "A great app feels inevitable. Like it could not have been designed any other way."

Applied: Every layout decision should feel like the only possible choice. No elements that feel arbitrary. Every margin, every label, every state — deliberate and necessary.

#### From Google Material Design:
> "Motion should describe spatial relationships and guide the user's attention."

Applied: Transitions between states tell a story. When you send money, the money visually "leaves." When it arrives, it "enters." The physics of the interface mirror the physics of the transaction.

#### From Airbnb Design:
> "We design for trust. Trust is built through consistency, clarity, and humanity."

Applied: Every piece of copy is written with warmth. Error messages don't feel like error messages. Warnings feel like advice from a friend, not legal disclaimers.

#### From Linear:
> "Speed is a feature. Every millisecond of perceived lag is a trust deficit."

Applied: Optimistic updates everywhere. The UI never waits for a mock "network call" to update. The user sees the result immediately; the system catches up in the background.

#### From Stripe:
> "The best documentation is no documentation. The best onboarding is no onboarding."

Applied: A user who has never used a crypto product should be able to complete their first transaction without any help text, tutorial, or explanation.

---

## PART II: SCREEN-LEVEL DESIGN STANDARDS

### 2.1 The One-Primary-Action Rule

Every screen has exactly one thing it wants the user to do. That action:
- Is the largest interactive element on screen
- Has the highest contrast
- Is reached by the most direct gesture (bottom of screen on mobile, or primary position in flow)

All other interactive elements are secondary and visually subordinate.

**Test:** Cover the primary CTA with your thumb. Everything else on screen should make sense without it.

---

### 2.2 Information Hierarchy (Per Screen)

Each screen uses a strict three-tier hierarchy:

```
TIER 1: Identity / Context         (What screen is this?)
  — Page title, key balance, recipient name
  — Font: 28–32px, weight 600, color: --text-primary

TIER 2: Primary Information        (What matters most right now?)
  — The number, the action, the status
  — Font: 16–20px, weight 500, color: --text-primary

TIER 3: Supporting Detail          (Why / when / how much?)
  — Labels, metadata, help text
  — Font: 13–14px, weight 400, color: --text-secondary
```

**Maximum rule:** No more than 3 font sizes per screen. No more than 3 font weights per screen.

---

### 2.3 Screen-by-Screen Intent Map

#### LOGIN SCREEN
- **Single intent:** Authenticate
- **Visual anchor:** Logo + passphrase input
- **Primary action:** Continue button (appears only when input is valid)
- **Forbidden:** Social login buttons, "Forgot password", any external links

---

#### DASHBOARD
- **Single intent:** Understand your current position
- **Visual anchor:** Total balance (large, centered, tabular numerals)
- **Primary action:** Send (highest frequency action)
- **Secondary actions:** Receive, Activity
- **Forbidden:** Charts, percentages, "portfolio" language, asset price tickers

**Dashboard layout anatomy:**
```
┌──────────────────────────────────┐
│  [Avatar] Alex               [⚙] │  ← TopBar
├──────────────────────────────────┤
│                                  │
│         $12,430.00               │  ← Balance (hero, 48px)
│         Total balance            │  ← Label (13px, muted)
│                                  │
│  [Send]        [Receive]         │  ← Primary actions
│                                  │
├──────────────────────────────────┤
│  Recent Activity                 │  ← Section header
│  ─────────────────────────────   │
│  → Alex M.    -$250.00  2m ago   │
│  ↓ Deposit   +$500.00  1h ago   │
│  → Sarah K.  -$80.00   Yesterday │
└──────────────────────────────────┘
```

---

#### SEND SCREEN
- **Single intent:** Complete a payment
- **Visual anchor:** Amount input (large, immediate focus)
- **Primary action:** Review (not Send — always a two-step process)
- **Forbidden:** "Max" button as primary, advanced options visible, network selector

**Send flow steps:**
1. Amount entry → amount input + currency label
2. Recipient selection → contact selector or address entry
3. Review → full summary, recipient confirmation
4. Confirmation → explicit acknowledgment if new recipient
5. Processing → optimistic success state

**Each step must:**
- Show progress indicator (1 of 5 — implied, not numbered)
- Have a clear back action
- Never lose state on back

---

#### RECEIVE SCREEN
- **Single intent:** Share your deposit address
- **Visual anchor:** QR code + address string
- **Primary action:** Copy address
- **Secondary action:** Share (native share sheet on mobile)
- **Forbidden:** Multiple address formats shown simultaneously, "L1" / "L2" labels visible

---

#### ACTIVITY SCREEN
- **Single intent:** Understand transaction history
- **Visual anchor:** Unified chronological feed
- **Primary action:** None (browsing screen)
- **Filtering:** Date-grouped sections, no tab filters
- **Forbidden:** Separate "sent" and "received" tabs, raw tx hashes in primary view

---

#### EARN (PLACEHOLDER)
- **Visual state:** Grayed overlay with "Coming soon" treatment
- **No fake APY numbers**
- **Copy:** "Earn on your balance — launching soon."
- **Element:** Soft lock icon in brand color

---

#### BORROW (PLACEHOLDER)
- Same treatment as Earn
- **Copy:** "Borrow against your balance — launching soon."

---

## PART III: MICRO-COPY STANDARDS

### 3.1 Writing Principles

Micro-copy is not afterthought. It is the voice of the product. Every string is reviewed against these standards:

**The Airbnb Copy Test:**
1. Is it clear? (Would a 12-year-old understand it?)
2. Is it concise? (Can you cut 30% without losing meaning?)
3. Is it warm? (Does it sound like a helpful human, not a legal disclaimer?)
4. Is it accurate? (Does it set correct expectations?)

---

### 3.2 Error Message Framework

**Structure:** [What happened] + [Your situation] + [What to do]

| ❌ Don't | ✅ Do |
|---------|------|
| "Transaction failed" | "Payment didn't go through. Your funds are safe." |
| "Invalid address format" | "That doesn't look like a valid address — double-check and try again." |
| "Insufficient balance" | "You'd need $43.20 more to complete this. You have $956.80 available." |
| "Network error" | "We lost connection for a moment. Your funds are safe — try again." |
| "Unknown error" | "Something went wrong on our end. Try again in a moment." |

---

### 3.3 Confirmation Copy Framework

**Structure:** [Specific action] + [Recipient] + [Consequence]

Example:
> **Send $250.00 to Alex M.?**
> Once sent, this payment can't be recalled. Alex will receive it within seconds.

**[Confirm]** **[Cancel]**

Rules:
- Always name the recipient (never "this address")
- Always state the exact amount with currency
- Always explain what happens after
- Never use "are you sure" — it's weak and vague
- Confirm button is always the right action (positive framing)

---

### 3.4 Placeholder Text Standards

Placeholders must:
- Show an example of valid input (not a label)
- Be format-specific: `0x742d35Cc6...` not "Enter address"
- Disappear immediately on focus (no persistent label-as-placeholder)

| Field | Placeholder |
|-------|-------------|
| Amount | `0.00` |
| Recipient address | `0x742d35Cc6634C...` |
| Recipient name | `alex.eth or 0x742d...` |
| Passphrase | `·  ·  ·  ·  ·  ·  ·  ·` |

---

### 3.5 Status Label Standards

| State | Label | Color |
|-------|-------|-------|
| Processing | "Sending..." | --text-secondary |
| Success | "Sent" | --success |
| Failed | "Not sent" | --error |
| Pending deposit | "Arriving soon" | --text-secondary |
| Confirmed deposit | "Received" | --success |

Never use: "Mined", "Finalized", "Confirmed on L1", "Pending mempool"

---

## PART IV: INTERACTION DESIGN PATTERNS

### 4.1 The Contact Verification Pattern

**Trigger:** User enters or selects a recipient

**Decision tree:**
```
Is recipient in contacts? 
  ├─ YES → Is verified? 
  │         ├─ YES → Show green checkmark. Proceed normally.
  │         └─ NO  → Show yellow badge "Unverified contact". Proceed with inline warning.
  └─ NO  → Show warning modal: "New recipient"
              - Name not recognized
              - Address shown in full
              - Checkbox: "I've confirmed this address is correct"
              - Only then enable Send
```

---

### 4.2 The Optimistic Transaction Pattern

```
User taps "Confirm Send"
  ↓
IMMEDIATE (0ms):
  - Send button → loading state
  - Amount field locks
  
IMMEDIATE (50ms):
  - Navigate to dashboard
  - Activity feed: new item inserted at top
  - Item shows: "Sending to Alex M. · $250.00 · Just now"
  - Balance decremented (optimistic)
  
BACKGROUND (mock 800–1400ms delay):
  - Mock "network" resolves
  - If success: item morphs to "Sent" state, balance confirmed
  - If failure: item morphs to "Not sent" state, balance restored, toast shown
  
ON FAILURE:
  - Toast: "Payment didn't go through. Your funds are safe."
  - Activity item persists (visible failure history)
  - Retry action available inline
```

---

### 4.3 The Private Mode Pattern

**Activation:** Toggle in top-right corner or Settings

**Effect:**
- All currency amounts blur with CSS `filter: blur(8px)`
- The blur has a 200ms fade transition
- The address is partially masked: `0x742d...f8A1`
- QR codes are not shown in private mode

**Visual indicator:** Subtle eye-slash icon in top bar, persistent while active

**Preserved:**
- Transaction labels (names, not amounts)
- Navigation
- All actions

---

### 4.4 The Copy Animation Pattern

**Trigger:** User taps copy on address or amount

**Sequence:**
```
t=0:    Icon morphs from copy-icon → checkmark (100ms ease-out)
t=100:  Color transitions: --text-secondary → --success (100ms)
t=1200: Color transitions back: --success → --text-secondary (200ms)
t=1400: Icon morphs back: checkmark → copy-icon (150ms)
```

**Never use a toast for copy confirmation.** The inline morph is sufficient and less disruptive.

---

### 4.5 The Address Generation Pattern

**Trigger:** User hasn't set up receive address yet, or navigates to Receive for first time

**Flow:**
1. Receive screen shows empty state: "Generate your deposit address"
2. User taps "Generate address"
3. 600ms deliberate pause (not a real delay — creates sense of meaningful computation)
4. Address fades in with character-by-character reveal (monospace, staggered)
5. QR code fades in beneath (400ms delay after address)
6. Copy button and share button appear (200ms stagger)

**Important:** The address, once generated, never changes in the same session. It is derived from the seeded mock engine.

---

## PART V: RESPONSIVE DESIGN STANDARDS

### 5.1 Breakpoint Philosophy

This is **mobile-first, desktop-capable** — not "responsive."

Primary experience is designed for 375px width (iPhone SE). Everything else is adaptation.

```
Mobile: 0–767px     → Bottom navigation, full-width cards, stacked layout
Tablet: 768–1023px  → Side-by-side where beneficial, no nav changes
Desktop: 1024px+    → Sidebar navigation, two-column where appropriate
```

---

### 5.2 Mobile Navigation

**Bottom navigation (mobile):**
- 5 items maximum: Dashboard, Send, Receive, Activity, Settings
- Active state: Brand color icon + label
- Inactive: Muted icon, no label
- Height: 64px safe area + device inset

**Gestures:**
- Swipe horizontally between main sections (optional, not required)
- Pull-to-refresh on Activity (mock-refreshes feed)

---

### 5.3 Desktop Sidebar

**Sidebar specs:**
- Width: 240px fixed
- Items: Same 5 as mobile nav + account info at top
- Active state: Solid background highlight, brand color text
- Collapsed state: Not required for MVP

**Desktop layout adaptation:**
- Dashboard: Activity feed moves to right panel at 1200px+
- Send: Form remains single-column (never split send flow across columns)
- Receive: QR code and address side-by-side at 768px+

---

### 5.4 No-Horizontal-Scroll Guarantee

Enforcement rules:
- All containers: `overflow-x: hidden` at root
- No fixed-width elements wider than 375px without responsive adaptation
- Address strings always truncated with ellipsis: `0x742d...f8A1`
- Tables never used for layout
- E2E test must verify: zero horizontal scroll at 375px viewport

---

## PART VI: ACCESSIBILITY STANDARDS

### 6.1 Baseline Requirements

- WCAG 2.1 AA minimum across all interactive elements
- AAA for critical financial information (balance, send confirmation)
- All interactive elements: minimum 44×44px tap target
- All form fields: explicit `<label>` association (not placeholder as label)
- Error messages: `aria-live="polite"` for async, `aria-live="assertive"` for blocking errors
- Color never the only differentiator of state

### 6.2 Focus Management

- Focus trapped within modals
- Focus returns to trigger element when modal closes
- Send flow: focus advances automatically to next input on completion
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

These patterns are **permanently banned** from this product. Any PR introducing them is rejected.

| Anti-pattern | Why banned | Acceptable alternative |
|---|---|---|
| "Are you sure?" confirmation | Weak, generic, adds no information | State the specific consequence |
| Toast for copy confirmation | Noisy, unnecessary | Inline icon morph |
| Network name visible in primary UI | Breaks mental model | Abstract entirely |
| Gas fee in primary send flow | Creates anxiety, irrelevant to UX | Show total cost only |
| Success modal after send | Interrupts flow | Optimistic inline state |
| Skeleton loaders > 400ms | Implies slowness | Optimistic update eliminates need |
| Percentage APY numbers in placeholders | Creates false precision | Remove until launch |
| "Wallet" language | Implies crypto complexity | "Account" or "balance" |
| Raw hex addresses as primary labels | Unreadable, anxiety-inducing | Show name first, address secondary |
| Multiple CTAs at same visual weight | Splits attention | One primary, all others subordinate |
