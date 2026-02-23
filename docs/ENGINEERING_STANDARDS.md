# ENGINEERING STANDARDS
### UISmoke — Version 1.0
### Code Quality, Architecture, and Discipline

> Code is written once and read many times. Every standard here exists to reduce cognitive load for the next engineer — who may be you, six months from now, under pressure.

---

## ARCHITECTURE PRINCIPLES

### Separation of Concerns (Strict)

The codebase has four distinct layers. These layers are not suggestions — they are walls.

```
┌─────────────────────────────────────────────────────┐
│  PAGES  (app/)                                      │
│  Composition only. No business logic. No data fetch │
│  Allowed: import from components/domain             │
│  Forbidden: import from store directly              │
│  Forbidden: any computation or transformation       │
└─────────────────┬───────────────────────────────────┘
                  │ renders
┌─────────────────▼───────────────────────────────────┐
│  DOMAIN COMPONENTS  (components/domain/)            │
│  Store-connected. Domain-aware. Never pure.         │
│  Allowed: useStore, useSelectors, dispatch actions  │
│  Allowed: pass data to UI components                │
│  Forbidden: direct DOM manipulation                 │
│  Forbidden: business logic inline                   │
└─────────────────┬───────────────────────────────────┘
                  │ renders
┌─────────────────▼───────────────────────────────────┐
│  UI COMPONENTS  (components/ui/)                    │
│  Pure presentation. Zero domain knowledge.          │
│  Allowed: props, children, callbacks                │
│  Forbidden: useStore, domain types, business logic  │
│  Forbidden: any imports from store/                 │
└─────────────────────────────────────────────────────┘
                         ▲
                  connected via
┌─────────────────────────────────────────────────────┐
│  STORE  (store/)                                    │
│  All domain state. All business logic.              │
│  Allowed: Zustand, selectors, actions               │
│  Allowed: import from lib/                          │
│  Forbidden: React imports                           │
│  Forbidden: component imports                       │
└─────────────────────────────────────────────────────┘
                         ▲
                  pure functions from
┌─────────────────────────────────────────────────────┐
│  LIB  (lib/)                                        │
│  Pure functions only. No side effects.              │
│  Allowed: formatting, validation, mock generation   │
│  Forbidden: React, Zustand, component imports       │
│  Forbidden: DOM access                              │
└─────────────────────────────────────────────────────┘
```

### Dependency Flow (One Direction Only)

```
pages → domain-components → ui-components
pages → domain-components → store → lib
```

**Reversed dependencies are architectural violations.** A UI component that imports from the store, or a lib function that imports from a component, will be rejected in code review.

---

## CODE QUALITY STANDARDS

### File Size Limits

| File type | Hard maximum |
|-----------|-------------|
| Page component | 100 lines |
| Domain component | 200 lines |
| UI component | 150 lines |
| Store slice | 200 lines |
| Lib module | 200 lines |
| Hooks | 100 lines |

**When a file exceeds its limit:** Extract into sub-files.

### Function Size Limits

- No function exceeds 60 lines
- No function exceeds 5 parameters
- Complex operations are composed from smaller named functions

### Complexity Rules

**No nested ternaries:**
```typescript
// Banned
const label = isVerified ? 'Verified' : isPending ? 'Pending' : 'Unknown'

// Required
const getStatusLabel = (status: string): string => {
  if (status === 'verified') return 'Verified'
  if (status === 'pending') return 'Pending'
  return 'Unknown'
}
```

**No inline style objects:**
```typescript
// Banned
<div style={{ backgroundColor: '#111', padding: 24 }}>

// Required
<div className="bg-bg-surface p-6">
```

**No `any` type — ever:**
```typescript
// Banned
const process = (data: any) => { ... }

// Required
const process = (data: MyPayload) => { ... }
```

---

## TYPESCRIPT STANDARDS

### Strict Mode Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Definition Standards

**Prefer `type` over `interface` for data shapes:**
```typescript
// Data types → type
type Transaction = {
  id: string
  amount: number
  status: TransactionStatus
  timestamp: number
}

// Contracts with extension → interface
interface StorageAdapter {
  get(key: string): string | null
  set(key: string, value: string): void
}
```

**Use discriminated unions for state:**
```typescript
type ActionState =
  | { status: 'idle' }
  | { status: 'pending'; optimisticId: string }
  | { status: 'success'; id: string; confirmedAt: number }
  | { status: 'failed'; error: string; retryable: boolean }
```

**Explicit return types on all exported functions:**
```typescript
// Banned: inferred return type
export const formatCurrency = (amount: number) => { ... }

// Required: explicit return type
export const formatCurrency = (amount: number): string => { ... }
```

---

## DRY ENFORCEMENT

### The Three DRY Zones

#### Zone 1: Validation Logic
**Rule:** Validation schemas live exclusively in `lib/validation/schemas.ts`. They are never duplicated or recreated inline.

#### Zone 2: Formatting Logic
**Rule:** All formatting functions live in `lib/formatting/`. They are pure functions with no side effects.

#### Zone 3: Mock Generators
**Rule:** All mock data generation uses the seeded engine. No `Math.random()` anywhere outside `lib/mock/engine.ts`.

---

## DETERMINISTIC MOCKING

### Core Principle
**Zero non-determinism in tests or development.** Every generated value must produce the same output given the same inputs.

### Implementation

```typescript
// lib/mock/engine.ts — seedable PRNG (Mulberry32)
class MockEngine {
  private seed: number

  next(): number {
    return mulberry32(this.seed++)
  }

  generateId(namespace: string): string {
    const hash = this.deterministicHash(namespace)
    return hash.slice(0, 8)
  }
}

export const mockEngine = new MockEngine()
```

### Mock Delay Simulation

```typescript
export const mockDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

export const DELAYS = {
  login: 400,
  check: 350,
  generate: 700,
  action: { min: 900, max: 1500 },
} as const
```

---

## STORE ARCHITECTURE (ZUSTAND)

### Slice Pattern

```typescript
type MySlice = {
  items: Item[]
  addItem: (item: Item) => void
  removeItem: (id: string) => void
}

const createMySlice: StateCreator<RootState, [], [], MySlice> = (set) => ({
  items: [],

  addItem: (item) => {
    set(state => ({ items: [...state.items, item] }))
  },

  removeItem: (id) => {
    set(state => ({ items: state.items.filter(i => i.id !== id) }))
  },
})
```

### Selectors Pattern

```typescript
// store/selectors/mySelectors.ts — Pure selector functions
export const selectItemCount = (state: RootState): number =>
  state.items.length

export const selectActiveItems = (state: RootState): Item[] =>
  state.items.filter(i => i.isActive)
```

---

## HOOKS STANDARDS

### Custom Hook Pattern

```typescript
export const useMyAction = () => {
  const { doAction } = useStore(selectActions)
  const actionState = useStore(selectActionState)

  const perform = useCallback(async (payload: Payload) => {
    doAction(payload)
    try {
      await randomDelay(DELAYS.action.min, DELAYS.action.max)
      // handle result
    } catch {
      // handle error
    }
  }, [doAction])

  return { perform, actionState }
}
```

**Rules:**
- Hooks are in `/hooks` directory only
- No business logic in component bodies — extract to hooks
- All async operations inside hooks, not components
- Return typed objects, not arrays (for named destructuring)

---

## COMPONENT STANDARDS

### Component File Structure

Every component file follows this exact order:

```typescript
// 1. Imports (ordered: React, external libs, internal)
'use client'  // Only if needed
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { MyType } from '@/types'

// 2. Type definitions (local to this file only)
type MyComponentProps = {
  item: MyType
  isPrivate?: boolean
  onSelect?: (id: string) => void
}

// 3. Constants (file-level, not inside component)
const ANIMATION_DURATION = 0.2

// 4. Component definition
export const MyComponent = ({ item, isPrivate = false, onSelect }: MyComponentProps) => {
  // 4a. Hooks (all hooks at top)
  // 4b. Derived values
  // 4c. Handlers
  // 4d. Render
  return ( /* JSX */ )
}
```

### Props Standards

```typescript
// Required props first, optional last
// Callbacks prefixed with 'on'
// Boolean props prefixed with 'is' or 'has'
type ButtonProps = {
  label: string              // Required
  onClick: () => void        // Callback with 'on' prefix
  isLoading?: boolean        // Boolean with 'is' prefix
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string         // Style extension (last)
}
```

---

## ERROR HANDLING

### Async Error Handling

```typescript
// Always explicit error types, never swallow errors
try {
  await performAction(payload)
} catch (error) {
  const message = error instanceof AppError
    ? error.userMessage
    : 'Something went wrong. Your data is safe.'
  handleError(id, message)
}
```

---

## LINTING AND FORMATTING

### ESLint Rules
- `@typescript-eslint/no-explicit-any`: error
- `no-nested-ternary`: error
- `no-console`: warn (allow warn/error)
- `prefer-const`: error
- `no-var`: error

### Prettier Configuration
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

---

## PERSISTENCE STANDARDS

### localStorage Schema

- Version field on all persisted state (enables migration)
- Only serializable state is persisted (no functions, no class instances)
- State that's expensive to regenerate is persisted; UI state is not
- Logout clears localStorage + cookie and forces full page reload (avoids stale state)
