# ENGINEERING STANDARDS
### Not a Bank — Version 2.0
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

**When a file exceeds its limit:** Extract into sub-files. A `SendForm.tsx` at 220 lines becomes `SendForm/`, `SendForm/AmountStep.tsx`, `SendForm/RecipientStep.tsx`, `SendForm/ReviewStep.tsx`, `SendForm/index.tsx`.

### Function Size Limits

- No function exceeds 60 lines
- No function exceeds 5 parameters
- Complex operations are composed from smaller named functions

### Complexity Rules

**No nested ternaries:**
```typescript
// ❌ Banned
const label = isVerified ? 'Verified' : isPending ? 'Pending' : 'Unknown'

// ✅ Required
const getStatusLabel = (status: ContactStatus): string => {
  if (status === 'verified') return 'Verified'
  if (status === 'pending') return 'Pending'
  return 'Unknown'
}
const label = getStatusLabel(contact.status)
```

**No inline style objects:**
```typescript
// ❌ Banned
<div style={{ backgroundColor: '#111', padding: 24 }}>

// ✅ Required
<div className="bg-bg-surface p-6">
```

**No `any` type — ever:**
```typescript
// ❌ Banned
const process = (data: any) => { ... }

// ✅ Required
const process = (data: TransactionPayload) => { ... }
```

**No implicit any:**
```typescript
// ❌ Banned (tsconfig: noImplicitAny must be true)
function fn(x) { return x.toUpperCase() }

// ✅ Required
function fn(x: string): string { return x.toUpperCase() }
```

---

## TYPESCRIPT STANDARDS

### Strict Mode Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
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
  recipient: Contact
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
type TransactionState =
  | { status: 'idle' }
  | { status: 'pending'; optimisticId: string }
  | { status: 'success'; txId: string; confirmedAt: number }
  | { status: 'failed'; error: string; retryable: boolean }
```

**Explicit return types on all exported functions:**
```typescript
// ❌ Inferred return type
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

// ✅ Explicit return type
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
```

---

## DRY ENFORCEMENT

### The Three DRY Zones

#### Zone 1: Validation Logic
**Rule:** Validation schemas live exclusively in `lib/validation/schemas.ts`. They are never duplicated or recreated inline.

```typescript
// lib/validation/schemas.ts — SSOT for all schemas
export const amountSchema = z.number()
  .positive('Amount must be positive')
  .max(1_000_000, 'Amount exceeds maximum')
  .multipleOf(0.01, 'Maximum 2 decimal places')

export const sendFormSchema = z.object({
  amount: amountSchema,
  recipient: recipientSchema,
})

// Usage in components — import, don't recreate
import { sendFormSchema } from '@/lib/validation/schemas'
```

#### Zone 2: Formatting Logic
**Rule:** All formatting functions live in `lib/formatting/`. They are pure functions with no side effects.

```typescript
// lib/formatting/currency.ts
export const formatUSD = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

export const formatAmountDelta = (amount: number, direction: 'in' | 'out'): string =>
  `${direction === 'out' ? '-' : '+'}${formatUSD(Math.abs(amount))}`

// lib/formatting/address.ts
export const truncateAddress = (address: string, startChars = 6, endChars = 4): string =>
  `${address.slice(0, startChars)}...${address.slice(-endChars)}`
```

#### Zone 3: Mock Generators
**Rule:** All mock data generation uses the seeded engine. No `Math.random()` anywhere outside `lib/mock/engine.ts`.

```typescript
// lib/mock/engine.ts
import { mulberry32 } from './prng'

let seed = 42  // Default seed, overridable in tests

export const setMockSeed = (s: number): void => { seed = s }

export const mockRandom = (): number => mulberry32(seed++)

export const generateEthAddress = (salt: string): string => {
  // Deterministic address from salt + seed
  const hash = deterministicHash(salt + seed)
  return `0x${hash.slice(0, 40)}`
}
```

---

## DETERMINISTIC MOCKING

### Core Principle
**Zero non-determinism in tests or development.** Every generated value must produce the same output given the same inputs.

### Implementation

```typescript
// lib/mock/prng.ts — Seedable PRNG (Mulberry32)
export const mulberry32 = (seed: number) => {
  let t = seed += 0x6D2B79F5
  t = Math.imul(t ^ t >>> 15, t | 1)
  t ^= t + Math.imul(t ^ t >>> 7, t | 61)
  return ((t ^ t >>> 14) >>> 0) / 4294967296
}

// lib/mock/engine.ts
class MockEngine {
  private seed: number
  
  constructor(seed: number = 42) {
    this.seed = seed
  }
  
  next(): number {
    return mulberry32(this.seed++)
  }
  
  generateAddress(namespace: string): EthAddress {
    const hash = this.deterministicHash(namespace)
    return `0x${hash.slice(0, 40)}` as EthAddress
  }
  
  generateNickname(): string {
    const adjectives = ['swift', 'calm', 'bright', 'deep', 'clear']
    const nouns = ['river', 'peak', 'cloud', 'stone', 'wave']
    const adj = adjectives[Math.floor(this.next() * adjectives.length)]
    const noun = nouns[Math.floor(this.next() * nouns.length)]
    return `${adj}.${noun}`
  }
  
  simulateSendResult(amount: number): 'success' | 'failed' {
    // Deterministically fail ~10% of sends for demo purposes
    return this.next() > 0.1 ? 'success' : 'failed'
  }
  
  private deterministicHash(input: string): string {
    // djb2 hash → hex string
    let hash = 5381
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) + hash) + input.charCodeAt(i)
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(40, '0')
  }
}

export const mockEngine = new MockEngine()
```

### Mock Delay Simulation

```typescript
// lib/mock/delays.ts
export const mockDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

// Standard delays for different operations
export const DELAYS = {
  send:           { min: 800, max: 1400 },
  addressGenerate: 600,
  login:          400,
  nicknameCheck:  300,
  depositArrival: { min: 5000, max: 15000 },
} as const

export const randomDelay = (min: number, max: number): Promise<void> =>
  mockDelay(min + mockEngine.next() * (max - min))
```

---

## STORE ARCHITECTURE (ZUSTAND)

### Slice Pattern

```typescript
// Each slice is a pure state + action definition
// store/slices/transactions.ts

type TransactionsSlice = {
  transactions: Transaction[]
  sendState: SendState
  
  // Actions
  initiateSend: (payload: SendPayload) => void
  confirmSend: (txId: string) => void
  failSend: (txId: string, error: string) => void
  clearSendState: () => void
}

const createTransactionsSlice: StateCreator<RootState, [], [], TransactionsSlice> = (set, get) => ({
  transactions: [],
  sendState: { status: 'idle' },
  
  initiateSend: (payload) => {
    const optimisticTx = createOptimisticTransaction(payload)
    set(state => ({
      transactions: [optimisticTx, ...state.transactions],
      sendState: { status: 'pending', optimisticId: optimisticTx.id },
    }))
  },
  
  confirmSend: (txId) => {
    set(state => ({
      transactions: state.transactions.map(tx =>
        tx.id === txId ? { ...tx, status: 'confirmed' } : tx
      ),
      sendState: { status: 'success', txId },
    }))
  },
  
  failSend: (txId, error) => {
    set(state => ({
      transactions: state.transactions.filter(tx => tx.id !== txId),
      sendState: { status: 'failed', error, retryable: true },
    }))
  },
})
```

### Selectors Pattern

```typescript
// store/selectors/finance.ts — Pure selector functions

export const selectTotalBalance = (state: RootState): number =>
  Object.values(state.balances.tokens).reduce((sum, b) => sum + b.usdValue, 0)

export const selectVerifiedContacts = (state: RootState): Contact[] =>
  state.contacts.items.filter(c => c.verificationStatus === 'verified')

export const selectRecentActivity = (state: RootState, limit = 10): ActivityEvent[] =>
  state.transactions.transactions
    .slice(0, limit)
    .map(tx => transactionToActivity(tx, state.contacts.items))
```

---

## HOOKS STANDARDS

### Custom Hook Pattern

All hooks follow this structure:

```typescript
// hooks/useSend.ts
export const useSend = () => {
  const { initiateSend, confirmSend, failSend } = useStore(selectSendActions)
  const sendState = useStore(selectSendState)
  
  const send = useCallback(async (payload: SendPayload) => {
    initiateSend(payload)
    
    try {
      await randomDelay(DELAYS.send.min, DELAYS.send.max)
      const result = mockEngine.simulateSendResult(payload.amount)
      
      if (result === 'success') {
        confirmSend(payload.optimisticId)
      } else {
        failSend(payload.optimisticId, 'Payment could not be processed')
      }
    } catch {
      failSend(payload.optimisticId, 'Unexpected error occurred')
    }
  }, [initiateSend, confirmSend, failSend])
  
  return { send, sendState }
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
import type { Transaction } from '@/lib/types'

// 2. Type definitions (local to this file only)
type ActivityItemProps = {
  transaction: Transaction
  isPrivate?: boolean
  onSelect?: (id: string) => void
}

// 3. Constants (file-level, not inside component)
const ANIMATION_DURATION = 0.2

// 4. Component definition
export const ActivityItem = ({ transaction, isPrivate = false, onSelect }: ActivityItemProps) => {
  // 4a. Hooks (all hooks at top)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 4b. Derived values (computed from props/state)
  const formattedAmount = formatAmountDelta(transaction.amount, transaction.direction)
  
  // 4c. Handlers (named functions, not inline arrows)
  const handleSelect = useCallback(() => {
    onSelect?.(transaction.id)
  }, [transaction.id, onSelect])
  
  // 4d. Render
  return (
    <motion.div ...>
      {/* JSX */}
    </motion.div>
  )
}

// 5. Default export (named exports preferred, default only for pages)
```

### Props Standards

```typescript
// Required props first, optional last
// Callbacks prefixed with 'on'
// Boolean props prefixed with 'is' or 'has'
// Never use 'data' as a prop name

type ButtonProps = {
  label: string              // Required, descriptive name
  onClick: () => void        // Callback with 'on' prefix
  isLoading?: boolean        // Boolean with 'is' prefix
  isDisabled?: boolean       
  variant?: 'primary' | 'secondary' | 'ghost'  // Explicit union
  className?: string         // Style extension (last)
}
```

---

## ERROR HANDLING

### Error Boundary Pattern

Every major route section wrapped in an error boundary:

```typescript
// components/ui/ErrorBoundary.tsx
// Must catch and display graceful fallback for:
// - Store hydration failures
// - Mock engine failures
// - Component render errors
```

### Async Error Handling

```typescript
// Pattern: Always explicit error types, never swallow errors
try {
  await send(payload)
} catch (error) {
  // Never: console.log(error) and move on
  // Always: handle or propagate with context
  const message = error instanceof SendError 
    ? error.userMessage 
    : 'Something went wrong. Your funds are safe.'
  failSend(optimisticId, message)
}
```

---

## LINTING AND FORMATTING

### ESLint Configuration
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-nested-ternary": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

---

## PERSISTENCE STANDARDS

### localStorage Schema

```typescript
// lib/persistence.ts
const STORAGE_VERSION = 1
const STORAGE_KEY = 'nab_state_v1'

type PersistedState = {
  version: number
  auth: PersistedAuthState
  contacts: PersistedContactsState
  transactions: PersistedTransactionState
  settings: PersistedSettingsState
}

// Migration function — must handle all previous versions
const migrate = (stored: unknown): PersistedState => {
  if (!isObject(stored)) return defaultState()
  const { version } = stored as { version: number }
  
  if (version === undefined) return defaultState()  // Fresh install
  if (version === STORAGE_VERSION) return stored as PersistedState
  
  // Add migration cases as schema evolves
  throw new MigrationError(`Unknown version: ${version}`)
}
```

### Persistence Rules
- Only serializable state is persisted (no functions, no class instances)
- Version field on all persisted state (enables migration)
- State that's expensive to regenerate is persisted; UI state is not
- Persisted state is encrypted if it contains any sensitive data
