# CLAUDE.md
## Claude Code Instructions for [APP_NAME]
### Version: 1.0

> **CRITICAL:** This file must be updated at the end of every major task. Before marking any task complete, add a brief entry to the Completion Log below. This file is the single source of truth for project state.

---

## PROJECT OVERVIEW

You are building **[APP_NAME]** — [one-line description]. This is a fully mocked MVP with no external services. The spec is in `/docs/`. Read it before writing code.

**Stack:** Next.js (App Router) + TypeScript strict + Tailwind CSS + shadcn/ui + Zustand + Framer Motion + Jest + Playwright

---

## HOW TO WORK ON THIS PROJECT

### The Discovery-First Principle

**Never start building without understanding what you're building and why.**

When you receive a feature request, product brief, or task — no matter how detailed it appears — your first job is NOT to write code. Your first job is to think like a senior engineer in a requirements meeting:

1. **Read the request carefully.** Read it again.
2. **Read the relevant docs** using the Doc Trigger Table below.
3. **Check what already exists** in the codebase that relates to this request.
4. **Identify every assumption you'd have to make** to proceed. There are always assumptions — if you think there are none, you haven't looked hard enough.
5. **Present your assumptions and questions to the user** before writing any code.
6. **Wait for confirmation.** Only proceed when the user explicitly confirms your understanding or corrects it.

This is not optional. This is not something you skip for "simple" tasks. The bugs and rework that created this rule always came from tasks that seemed simple.

### What Discovery Looks Like

When you receive a task, respond with a **Discovery Summary** before touching any code:

```
Discovery: [Feature/Task Name]

My Understanding
[Restate what you believe the user is asking for, in your own words. If your understanding matches the request exactly, say so — but still list your assumptions.]

Assumptions I'm Making
- [Assumption 1 — e.g., "This list should be sorted by date, newest first"]
- [Assumption 2 — e.g., "The empty state should follow our standard pattern"]
- [Assumption 3 — e.g., "This doesn't need to work with private mode"]
- [Assumption N]

Questions
- [Anything genuinely ambiguous that you can't resolve from the docs or existing code patterns]

Proposed Approach
[Brief description of how you'd build this — which files, which layers, rough scope. Not a full plan — just enough for the user to say "yes, that's right" or "no, I meant something different."]

Impact on Existing Code
[What existing files/flows this would touch or change, if any. "None" is a valid answer for isolated new features.]
```

**After the user confirms**, then proceed to implementation (using the Planner agent for complex features, or directly for small changes).

**If the user says "just build it" or "skip discovery"**, you may proceed — but still list your key assumptions inline as comments in the completion log so there's a record.

### When Discovery Can Be Light

Not every task needs a full discovery summary. Scale the effort:

- **Full discovery** — New features, new screens, new flows, anything touching multiple files
- **Light discovery** (2-3 assumptions, no questions section) — Bug fixes where you can see the bug, copy changes, style tweaks, adding tests for existing code
- **Skip discovery** — Only when the user explicitly says to, or when the task is purely mechanical (e.g., "run the linter and fix all errors")

Even for light discovery, always state your assumptions before proceeding.

### Doc Trigger Table

Before starting any task, read the relevant docs:

| When you are...                        | Read first                                |
|----------------------------------------|-------------------------------------------|
| Creating or modifying any UI           | UX_GUIDELINES.md, UX_ENFORCEMENT_RULES.md |
| Creating a new component or page       | ARCHITECTURE.md                           |
| Working with the store or lib/         | ENGINEERING_STANDARDS.md                  |
| Adding any animation or transition     | MOTION_SPEC.md                            |
| Styling anything                       | DESIGN_TOKENS.md, STYLE_GUIDE.md          |
| Writing or modifying tests             | TESTING_STRATEGY.md                       |
| Defining new data types or state       | DOMAIN_MODEL.md                           |
| Starting a new feature                 | All of the above via the Planner agent    |

### Agent Workflow

This project includes four Claude Code subagents in `.claude/agents/`. Use them as follows:

**For new features:**
1. Complete discovery (above) and get user confirmation
2. Use the **planner** agent to produce a detailed implementation plan
3. Present the plan to the user for approval (the plan may surface additional questions)
4. Implement the plan (you are the builder)
5. Write tests inline, or use the **test-writer** agent for complex flows
6. Use the **code-reviewer** agent to audit engineering quality
7. Use the **ux-reviewer** agent to audit UX and design compliance
8. Address all findings before marking complete

**For small changes (bug fixes, copy changes, minor tweaks):**
1. Complete light discovery and get user confirmation
2. Implement the change directly
3. Run the code-reviewer and ux-reviewer agents if the change touches UI
4. Address findings before marking complete

### Completing a Task — THE GATE

A task is **not complete** until every item below passes. No exceptions.

```
□ Discovery confirmed    → user approved your understanding before you started building
□ npm run type-check     → zero TypeScript errors
□ npm test               → all unit tests pass, including new ones you wrote
□ npm run e2e            → all E2E tests pass (if Playwright is available)
□ npm run lint:tokens    → no raw hex values in component files
□ npm run lint           → zero ESLint errors
□ Use the code-reviewer agent to review changes
□ Use the ux-reviewer agent to review changes (if UI was touched)
□ Address all review findings
□ CLAUDE.md updated      → Completion Log entry with test files listed
```

**If you skipped writing tests because the task "felt simple", you have not completed the task.**

---

## PERMANENT RULES (NEVER VIOLATE)

These rules apply regardless of context, time pressure, or convenience.

### Code Rules
- `any` type is **never** permitted. Not even temporarily.
- `Math.random()` is **never** permitted outside `lib/mock/engine.ts`
- Raw hex color values (`#XXXXXX`) are **never** permitted in component files
- Nested ternaries are **never** permitted. Use if/else or named functions.
- Inline `style={{}}` objects are **never** permitted. Use Tailwind classes.
- No file may exceed its line limit (pages: 100, domain components: 200, UI components: 150, store slices: 200, lib modules: 200, hooks: 100)

### Architecture Rules
- UI components (`/components/ui/`) may **never** import from the store
- Pages (`/app/`) may **never** contain business logic
- All validation schemas live in `lib/validation/schemas.ts` — never duplicated
- All formatting functions live in `lib/formatting/` — never duplicated
- All mock generation uses `lib/mock/engine.ts` — never use `Math.random()` directly
- Dependencies flow one direction only: pages → domain components → UI components, and pages → domain components → store → lib

### UX Rules (Enforced — Not Optional)
- One primary CTA per screen. All others are secondary or ghost.
- Maximum three font sizes per screen. Maximum three font weights per screen.
- All interactive elements must have minimum 44×44px touch target.
- All destructive actions require a confirmation modal.
- All errors must include: what happened + reassurance + what to do next.
- Error messages never assign blame ("You entered..." is banned. "That doesn't look right..." is correct).
- Empty states are invitations, not apologies. ("No data available" is banned. "Your activity will appear here" is correct.)
- Optimistic updates required — UI state must change within 50ms of user action.
- No technical vocabulary in primary UI copy.
- Private mode must blur all currency amounts.
- Currency amounts always use tabular numerals (font-mono), two decimal places, dollar sign before amount.
- No emoji in UI. Icons from Lucide React only.
- No animation exceeds 400ms without progress indication.
- All Framer Motion animations must have useReducedMotion fallback.

---

## DEVELOPMENT COMMANDS

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run type-check       # TypeScript check without emit

# Testing
npm test                 # Jest unit tests
npm run test:watch       # Jest in watch mode
npm run e2e              # Playwright E2E tests

# Linting
npm run lint             # ESLint
npm run lint:fix         # ESLint with autofix
npm run lint:tokens      # Check for raw hex values
npm run format           # Prettier

# Quality
npm run quality          # Run all checks (type-check + lint + lint:tokens + test)
```

---

## FILE CREATION GUIDE

When you need a new file, follow these patterns:

### New UI Component

```
Location: /components/ui/MyComponent.tsx
Pattern: Pure presentation, no store imports, explicit props type
Test: /tests/unit/components/ui/MyComponent.test.tsx
```

### New Domain Component

```
Location: /components/domain/MyDomainComponent.tsx
Pattern: Store-connected, domain-aware, passes data to UI components
Test: /tests/unit/components/domain/MyDomainComponent.test.tsx
```

### New Page

```
Location: /app/(app)/mypage/page.tsx
Pattern: Composition only, renders domain components, no logic
Max length: 100 lines
```

### New Store Slice

```
Location: /store/slices/mySlice.ts
Pattern: StateCreator type, explicit actions, no React imports
Selectors: /store/selectors/mySelectors.ts
```

### New Lib Module

```
Location: /lib/category/myModule.ts
Pattern: Pure functions, explicit return types, no side effects
Test: /tests/unit/lib/myModule.test.ts
```

---

## COMMON PATTERNS

### Fetching from Store

```typescript
import { useStore } from '@/store'
import { selectBalance } from '@/store/selectors/finance'

const balance = useStore(selectBalance)
```

### Currency Formatting

```typescript
import { formatUSD } from '@/lib/formatting/currency'
const display = formatUSD(1234.56)  // → "$1,234.56"
```

### Deterministic Mock

```typescript
import { mockEngine, DELAYS, randomDelay } from '@/lib/mock/engine'
await randomDelay(DELAYS.action.min, DELAYS.action.max)
```

### Animation Variants

```typescript
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}
const pageTransition = { duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }
```

### Error Messages

```typescript
// Always: [What happened] + [Reassurance] + [What to do]
'Payment didn\'t go through. Your funds are safe — try again.'
'That doesn\'t look right. Double-check and try again.'
```

---

## COMPONENT CHECKLIST

Before marking a component complete:

- [ ] Props type is explicit and complete
- [ ] All required `aria-label` attributes present
- [ ] Framer Motion animations have `useReducedMotion` fallback
- [ ] No raw hex colors — all Tailwind classes use token names
- [ ] No `any` types
- [ ] Minimum 44px touch target on all interactive elements
- [ ] Error states handled
- [ ] Empty states handled
- [ ] Unit test written and passing

---

## TESTING RULES

|What you built           |What you must write                           |
|-------------------------|----------------------------------------------|
|A `lib/` utility function|Unit test covering happy path + edge cases    |
|A store slice action     |Unit test verifying state before and after    |
|A UI component           |Unit test for render + interaction            |
|A full screen or flow    |E2E test covering the complete user journey   |
|A bug fix                |Regression test that would have caught the bug|

### data-testid convention

Every interactive element and key display element must have a `data-testid`. Format: descriptive-kebab-case (e.g., `data-testid="balance-amount"`, `data-testid="send-button"`).

---

## COMPLETION LOG

> Update this section at the end of every major task.

### Template

```
## [YYYY-MM-DD] Task: [Short description]

**Discovery:**
- Assumptions confirmed: [list key assumptions the user approved]
- Questions resolved: [any questions that were answered during discovery]

**Completed:**
- What was built or changed

**Files created/modified:**
- List key files

**Tests written:**
- tests/unit/... → what it covers
- tests/e2e/...  → what flow it covers
← If this section is empty, the task is not complete.

**Gate status:**
- [ ] discovery confirmed
- [ ] type-check passing
- [ ] unit tests passing
- [ ] e2e tests passing
- [ ] lint:tokens passing
- [ ] code-reviewer: no findings (or findings addressed)
- [ ] ux-reviewer: no findings (or findings addressed)

**Known issues or follow-up:**
- Any TODOs or decisions made
```

---

## DECISIONS LOG

|Date|Decision|Rationale|
|----|--------|---------|
|—   |        |         |

---

## PROJECT STATUS

### Seed Kit Foundation

- [x] Project scaffold + config
- [x] Design token system
- [x] Core UI components
- [ ] Domain model (app-specific — to be defined)
- [ ] Pages and flows (app-specific — to be defined)
- [ ] Store slices (app-specific — to be defined)

---

## IMPORTANT PATHS

```
Design tokens:     /src/styles/tokens.css
Tailwind config:   /tailwind.config.ts
Mock engine:       /src/lib/mock/engine.ts
Store root:        /src/store/index.ts
Type definitions:  /src/types/index.ts
Constants:         /src/lib/constants.ts
Formatting:        /src/lib/formatting/
Docs:              /docs/
Agents:            /.claude/agents/
```
