# DOMAIN MODEL
### Not a Bank — Version 2.0
### Data Shapes, Store Schema, and Mock Contracts

---

## CORE ENTITIES

### User
```typescript
type User = {
  id: string                    // Deterministic from seed
  nickname: string | null       // Set during onboarding (e.g., "alex")
  displayName: string           // Derived: nickname ?? truncateAddress(address)
  createdAt: number             // Unix timestamp
}
```

### Balances
```typescript
type TokenBalance = {
  symbol: 'USDC' | 'USDT' | 'DAI'
  amount: number                // Raw token amount
  usdValue: number              // USD equivalent (1:1 for stablecoins)
}

type Balances = {
  tokens: Record<string, TokenBalance>
  lastUpdatedAt: number
}

// Derived selector
const selectNetWorth = (state: RootState): number =>
  Object.values(state.balances.tokens).reduce((sum, b) => sum + b.usdValue, 0)
```

### PublicAddress (Onchain identity)
```typescript
type PublicAddress = {
  address: EthAddress           // `0x${string}` brand type
  nickname: string | null       // ENS or app nickname
  displayName: string           // Derived: nickname ?? truncateAddress
}
```

### DepositAddress
```typescript
type DepositAddress = {
  address: EthAddress
  generatedAt: number
  qrCodeData: string            // The value encoded in the QR code
  isActive: boolean
}
```

### Contact
```typescript
type ContactVerificationStatus = 'verified' | 'unverified' | 'pending'

type Contact = {
  id: string
  address: EthAddress
  nickname: string | null
  displayName: string           // name ?? truncateAddress(address)
  verificationStatus: ContactVerificationStatus
  lastSentAt: number | null
  addedAt: number
  isFavorite: boolean
}
```

### Transaction
```typescript
type TransactionDirection = 'outbound' | 'inbound'
type TransactionStatus = 'optimistic' | 'pending' | 'confirmed' | 'failed'

type Transaction = {
  id: string                    // Deterministic, unique
  direction: TransactionDirection
  amount: number                // Always positive
  tokenSymbol: string
  usdValue: number
  
  // For outbound
  recipientAddress?: EthAddress
  recipientContact?: Contact    // Resolved if in contacts
  
  // For inbound
  senderAddress?: EthAddress
  
  status: TransactionStatus
  optimisticId?: string         // Set on optimistic creation
  
  initiatedAt: number
  confirmedAt?: number
  failedAt?: number
  failureReason?: string
  
  // Derived
  isRetryable: boolean
}
```

### ActivityEvent (Unified timeline)
```typescript
type ActivityEventType = 
  | 'send'
  | 'receive' 
  | 'address_generated'
  | 'nickname_claimed'
  | 'contact_added'

type ActivityEvent = {
  id: string
  type: ActivityEventType
  timestamp: number
  transaction?: Transaction     // For send/receive events
  metadata?: Record<string, string>  // For non-transaction events
}
```

### UIState
```typescript
type UIState = {
  isPrivateMode: boolean
  activeTab: 'dashboard' | 'send' | 'receive' | 'activity' | 'settings'
  
  send: {
    step: 'amount' | 'recipient' | 'review' | 'confirm' | 'processing'
    draftAmount: number | null
    draftRecipient: string | null
    draftContact: Contact | null
    isNewRecipient: boolean
    hasAcknowledgedNewRecipient: boolean
  }
  
  modals: {
    confirmSend: boolean
    newRecipientWarning: boolean
    addressGenerated: boolean
  }
  
  toast: {
    message: string | null
    type: 'success' | 'error' | 'info'
    id: string | null
  }
}
```

---

## ZUSTAND STORE ROOT

```typescript
type RootState = 
  AuthSlice &
  BalancesSlice &
  ContactsSlice &
  TransactionsSlice &
  UISlice &
  DepositSlice

// store/index.ts
export const useStore = create<RootState>()(
  persist(
    devtools(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createBalancesSlice(...a),
        ...createContactsSlice(...a),
        ...createTransactionsSlice(...a),
        ...createUISlice(...a),
        ...createDepositSlice(...a),
      }),
      { name: 'NotABank' }
    ),
    {
      name: 'nab_state_v1',
      version: 1,
      partialize: (state) => ({
        auth: state.auth,
        balances: state.balances,
        contacts: state.contacts,
        transactions: state.transactions,
        deposit: state.deposit,
        // UI state is NOT persisted
      }),
    }
  )
)
```

---

## DERIVED SELECTORS

```typescript
// store/selectors/finance.ts

export const selectNetWorth = (state: RootState): number =>
  Object.values(state.balances.tokens)
    .reduce((sum, b) => sum + b.usdValue, 0)

export const selectActiveDepositAddress = (state: RootState): DepositAddress | null =>
  state.deposit.addresses.find(a => a.isActive) ?? null

export const selectVerifiedContacts = (state: RootState): Contact[] =>
  state.contacts.items.filter(c => c.verificationStatus === 'verified')

export const selectRecentActivity = (state: RootState, limit = 10): ActivityEvent[] =>
  state.transactions.transactions
    .slice(0, limit)
    .map(tx => transactionToActivity(tx, state.contacts.items))
    .sort((a, b) => b.timestamp - a.timestamp)

export const selectContactByAddress = (address: string) => 
  (state: RootState): Contact | undefined =>
    state.contacts.items.find(c => 
      c.address.toLowerCase() === address.toLowerCase()
    )

export const selectIsNewRecipient = (address: string) =>
  (state: RootState): boolean =>
    !state.contacts.items.some(c => 
      c.address.toLowerCase() === address.toLowerCase()
    )
```

---

## MOCK HELPERS (CONTRACTS)

### Address Generation
```typescript
// lib/mock/addresses.ts

export const generateEthAddress = (seed: string): EthAddress => {
  const hash = deterministicHash(seed)
  return `0x${hash.slice(0, 40)}` as EthAddress
}

export const isValidEthAddress = (value: string): value is EthAddress =>
  /^0x[0-9a-fA-F]{40}$/.test(value)
```

### Nickname Resolution
```typescript
// lib/mock/resolution.ts

const AVAILABLE_NICKNAMES = new Set([
  'alex', 'maria', 'sam', 'jordan', 'riley'
  // ... pre-populated set
])

const TAKEN_NICKNAMES = new Set([
  'john', 'admin', 'bank', 'zk', 'crypto'
  // ... pre-populated set
])

export const checkNicknameAvailability = async (
  nickname: string
): Promise<{ available: boolean; suggestion?: string }> => {
  await mockDelay(DELAYS.nicknameCheck)
  
  const normalized = nickname.toLowerCase().trim()
  
  if (TAKEN_NICKNAMES.has(normalized)) {
    return { 
      available: false, 
      suggestion: `${normalized}${Math.floor(mockEngine.next() * 99)}`
    }
  }
  
  return { available: true }
}

export const resolveNickname = async (
  nickname: string
): Promise<EthAddress | null> => {
  await mockDelay(200)
  
  // Mock: resolve known nicknames to deterministic addresses
  const KNOWN: Record<string, EthAddress> = {
    'alice': generateEthAddress('alice-known'),
    'bob': generateEthAddress('bob-known'),
    // ...
  }
  
  return KNOWN[nickname.toLowerCase()] ?? null
}
```

### Send Simulation
```typescript
// lib/mock/transactions.ts

export const simulateSend = async (
  payload: SendPayload,
  onOptimistic: (txId: string) => void,
  onConfirm: (txId: string) => void,
  onFail: (txId: string, reason: string) => void
): Promise<void> => {
  const txId = generateTxId()
  onOptimistic(txId)
  
  await randomDelay(DELAYS.send.min, DELAYS.send.max)
  
  const result = mockEngine.simulateSendResult(payload.amount)
  
  if (result === 'success') {
    onConfirm(txId)
  } else {
    onFail(txId, 'Payment could not be processed. Your funds are safe.')
  }
}
```

### Deposit Simulation
```typescript
// lib/mock/deposits.ts

export const simulateIncomingDeposit = async (
  address: EthAddress,
  amount: number,
  onArrival: (tx: Transaction) => void
): Promise<void> => {
  const delay = DELAYS.depositArrival.min + 
    mockEngine.next() * (DELAYS.depositArrival.max - DELAYS.depositArrival.min)
  
  await mockDelay(delay)
  
  onArrival({
    id: generateTxId(),
    direction: 'inbound',
    amount,
    tokenSymbol: 'USDC',
    usdValue: amount,
    senderAddress: generateEthAddress('mock-sender'),
    status: 'confirmed',
    initiatedAt: Date.now() - delay,
    confirmedAt: Date.now(),
    isRetryable: false,
  })
}
```

---

## SEED DATA (INITIAL STATE)

```typescript
// lib/mock/seedData.ts

export const createInitialState = (): Partial<RootState> => ({
  balances: {
    tokens: {
      USDC: { symbol: 'USDC', amount: 1250.00, usdValue: 1250.00 }
    },
    lastUpdatedAt: Date.now(),
  },
  
  contacts: {
    items: [
      {
        id: 'contact-alice',
        address: generateEthAddress('alice-known'),
        nickname: 'alice',
        displayName: 'alice',
        verificationStatus: 'verified',
        lastSentAt: Date.now() - 86400000,  // 1 day ago
        addedAt: Date.now() - 604800000,    // 1 week ago
        isFavorite: true,
      },
      {
        id: 'contact-bob',
        address: generateEthAddress('bob-known'),
        nickname: null,
        displayName: truncateAddress(generateEthAddress('bob-known')),
        verificationStatus: 'unverified',
        lastSentAt: null,
        addedAt: Date.now() - 172800000,    // 2 days ago
        isFavorite: false,
      },
    ]
  },
  
  transactions: {
    transactions: [
      // 3-5 seed transactions showing various states
      createSeedTransaction('recv-1', 'inbound', 500, 'confirmed', Date.now() - 3600000),
      createSeedTransaction('send-1', 'outbound', 250, 'confirmed', Date.now() - 7200000),
      createSeedTransaction('recv-2', 'inbound', 1000, 'confirmed', Date.now() - 86400000),
    ],
  },
})
```
