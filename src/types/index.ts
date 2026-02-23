// Branded types
export type EthAddress = `0x${string}`
export type UserId = string
export type ContactId = string
export type TransactionId = string

// Enums
export type TransactionDirection = 'inbound' | 'outbound'
export type TransactionStatus = 'optimistic' | 'pending' | 'confirmed' | 'failed'
export type ContactVerificationStatus = 'verified' | 'unverified'

// Entities
export type User = {
  id: UserId
  nickname: string | null
  email: string
  depositAddress: EthAddress | null
  hasCompletedOnboarding: boolean
  createdAt: number
}

export type TokenBalance = {
  symbol: 'USDC' | 'USDT' | 'DAI'
  amount: number
  usdValue: number
}

export type Contact = {
  id: ContactId
  address: EthAddress
  nickname: string | null
  displayName: string
  verificationStatus: ContactVerificationStatus
  lastSentAt: number | null
  addedAt: number
  isFavorite: boolean
}

export type Transaction = {
  id: TransactionId
  direction: TransactionDirection
  amount: number
  tokenSymbol: string
  usdValue: number
  recipientAddress?: EthAddress
  recipientNickname?: string
  senderAddress?: EthAddress
  status: TransactionStatus
  initiatedAt: number
  confirmedAt?: number
  failedAt?: number
  failureReason?: string
  fromAddressId?: string
  isRetryable: boolean
}

export type DepositAddress = {
  id: string
  address: EthAddress
  label: string
  generatedAt: number
  isActive: boolean
}
