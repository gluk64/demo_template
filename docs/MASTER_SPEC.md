# 🧭 NOT A BANK — MASTER BUILD SPECIFICATION
### Version 2.0 | World-Class UX Edition

> *Conceived by a panel of senior design and engineering leads from Apple, Google, Airbnb, Linear, Stripe, Vercel, and Figma. This is not a demo. This is a benchmark.*

---

## PRODUCT VISION

**Not a Bank** is a privacy-first stablecoin neobank. It must be the most composed, precise, and emotionally intelligent financial interface ever built on a blockchain. Every decision — from micro-animation to error copy — reflects an institution-grade design philosophy.

The bar is not "good for crypto." The bar is **better than Chase Private Client, Wise, and Revolut Metal combined.**

---

## NORTH STAR PRINCIPLES (From the Panel)

### 1. Calm Technology *(Jony Ive × Mark Weiser)*
The interface should do more while demanding less attention. The app should feel like it's always been there. Not new. Not impressive. Just *right.*

### 2. Typographic Sovereignty *(Matthew Butterick × Tobias Frere-Jones)*
In financial software, type *is* the product. Numbers, labels, and confirmations are not decorations — they are instruments. Every glyph choice is a trust signal.

### 3. Motion as Information *(Emil Ruder × Disney's 12 Principles)*
No animation that doesn't carry meaning. Every transition must answer: "What just changed, and why should I care?" If you can't answer that, remove it.

### 4. Spatial Honesty *(Dieter Rams)*
Whitespace is not emptiness. It is the visual equivalent of a pause before signing a legal document. Density communicates urgency. Restraint communicates safety.

### 5. Micro-Copy as Design *(Airbnb Content Design × Apple HIG)*
Copy is UI. Every label, tooltip, error, confirmation, and placeholder is designed with the same rigor as a button color. Words either build trust or destroy it.

### 6. Operational Transparency Without Technical Exposure *(Stripe Design)*
Users need to know *what* is happening. They should never need to know *how.* The system should reveal its state without revealing its mechanics.

---

## PROJECT STRUCTURE

```
/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── login/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx            # Shell: sidebar + bottom nav
│   │   ├── dashboard/page.tsx
│   │   ├── receive/page.tsx
│   │   ├── send/page.tsx
│   │   ├── activity/page.tsx
│   │   ├── earn/page.tsx
│   │   └── borrow/page.tsx
│   └── settings/page.tsx
│
├── components/
│   ├── ui/                       # Purely presentational, zero domain knowledge
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Skeleton.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── CopyButton.tsx
│   │   └── AmountDisplay.tsx
│   │
│   ├── layout/                   # Shell, nav, chrome
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── TopBar.tsx
│   │   └── PageShell.tsx
│   │
│   └── domain/                   # Domain-aware, store-connected
│       ├── BalanceSummary.tsx
│       ├── ActivityFeed.tsx
│       ├── ActivityItem.tsx
│       ├── AddressCard.tsx
│       ├── ContactSelector.tsx
│       ├── SendForm.tsx
│       ├── NicknameForm.tsx
│       ├── TransactionStatus.tsx
│       ├── PrivateToggle.tsx
│       └── ContactWarning.tsx
│
├── store/
│   ├── index.ts                  # Root store
│   ├── slices/
│   │   ├── auth.ts
│   │   ├── balance.ts
│   │   ├── contacts.ts
│   │   ├── transactions.ts
│   │   └── ui.ts
│   └── selectors/
│       ├── finance.ts
│       └── activity.ts
│
├── lib/
│   ├── mock/
│   │   ├── engine.ts             # Seeded PRNG + generators
│   │   ├── addresses.ts
│   │   ├── contacts.ts
│   │   └── transactions.ts
│   ├── validation/
│   │   ├── schemas.ts            # All Zod schemas
│   │   └── rules.ts              # Business rules
│   ├── formatting/
│   │   ├── currency.ts
│   │   ├── address.ts
│   │   └── date.ts
│   └── constants.ts
│
├── styles/
│   ├── globals.css               # Tokens, resets, base
│   └── tokens.css                # SSOT for all design tokens
│
├── hooks/
│   ├── useBalance.ts
│   ├── useContacts.ts
│   ├── useSend.ts
│   └── usePrivateMode.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── e2e/
│   └── flows/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── UX_GUIDELINES.md
│   ├── UX_ENFORCEMENT_RULES.md
│   ├── STYLE_GUIDE.md
│   ├── DESIGN_TOKENS.md
│   ├── MOTION_SPEC.md
│   ├── DOMAIN_MODEL.md
│   ├── ENGINEERING_STANDARDS.md
│   ├── TESTING_STRATEGY.md
│   └── README.md
│
└── CLAUDE.md                     # Claude Code instructions — always kept current
```

---

## TECH STACK (STRICT, NON-NEGOTIABLE)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 14+ |
| Language | TypeScript strict mode | 5+ |
| Styling | Tailwind CSS + CSS Variables | 3+ |
| Components | shadcn/ui (Radix primitives) | latest |
| State | Zustand | 4+ |
| Forms | React Hook Form + Zod | latest |
| Animation | Framer Motion | 11+ |
| Unit Tests | Jest + React Testing Library | latest |
| E2E Tests | Playwright | latest |
| Persistence | localStorage (versioned, migratable) | — |
| Fonts | Inter + JetBrains Mono | via next/font |

**Zero external services. Zero API calls. Zero authentication providers.**

---
