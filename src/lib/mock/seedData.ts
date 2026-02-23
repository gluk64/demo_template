import { mockEngine } from './engine'
import { formatAddress } from '@/lib/formatting/address'
import type { Contact, Transaction, TokenBalance, DepositAddress, EthAddress } from '@/types'

const now = Date.now()

export const SEED_CONTACTS: Contact[] = [
  {
    id: 'contact-alice',
    address: mockEngine.generateAddress('alice'),
    nickname: 'alice',
    displayName: 'alice',
    verificationStatus: 'verified',
    lastSentAt: now - 86_400_000,
    addedAt: now - 604_800_000,
    isFavorite: true,
  },
  {
    id: 'contact-marco',
    address: mockEngine.generateAddress('marco'),
    nickname: null,
    displayName: formatAddress(mockEngine.generateAddress('marco')),
    verificationStatus: 'unverified',
    lastSentAt: null,
    addedAt: now - 172_800_000,
    isFavorite: false,
  },
]

export const SEED_BALANCES: Record<string, TokenBalance> = {
  USDC: { symbol: 'USDC', amount: 10_430.0, usdValue: 10_430.0 },
  USDT: { symbol: 'USDT', amount: 2_000.0, usdValue: 2_000.0 },
}

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-seed-1',
    direction: 'inbound',
    amount: 1000,
    tokenSymbol: 'USDC',
    usdValue: 1000,
    senderAddress: mockEngine.generateAddress('external-sender-1'),
    status: 'confirmed',
    initiatedAt: now - 3 * 3_600_000,
    confirmedAt: now - 3 * 3_600_000 + 12_000,
    isRetryable: false,
  },
  {
    id: 'tx-seed-2',
    direction: 'outbound',
    amount: 250,
    tokenSymbol: 'USDC',
    usdValue: 250,
    recipientAddress: mockEngine.generateAddress('alice'),
    recipientNickname: 'alice',
    status: 'confirmed',
    initiatedAt: now - 26 * 3_600_000,
    confirmedAt: now - 26 * 3_600_000 + 9_000,
    isRetryable: false,
  },
  {
    id: 'tx-seed-3',
    direction: 'inbound',
    amount: 500,
    tokenSymbol: 'USDC',
    usdValue: 500,
    senderAddress: mockEngine.generateAddress('external-sender-2'),
    status: 'confirmed',
    initiatedAt: now - 2 * 86_400_000,
    confirmedAt: now - 2 * 86_400_000 + 8_000,
    isRetryable: false,
  },
  {
    id: 'tx-seed-4',
    direction: 'outbound',
    amount: 80,
    tokenSymbol: 'USDC',
    usdValue: 80,
    recipientAddress: mockEngine.generateAddress('marco'),
    status: 'confirmed',
    initiatedAt: now - 3 * 86_400_000,
    confirmedAt: now - 3 * 86_400_000 + 11_000,
    isRetryable: false,
  },
]

export const SEED_DEPOSIT_ADDRESSES: DepositAddress[] = [
  {
    id: 'addr-seed-1',
    address: mockEngine.generateAddress('user-receive-main') as EthAddress,
    label: 'Primary',
    generatedAt: now - 86_400_000,
    isActive: true,
  },
]
