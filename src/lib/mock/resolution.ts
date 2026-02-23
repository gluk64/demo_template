import { mockEngine, mockDelay, DELAYS } from './engine'
import type { EthAddress } from '@/types'

const TAKEN = new Set([
  'admin',
  'bank',
  'zk',
  'crypto',
  'john',
  'ethereum',
  'wallet',
  'defi',
  'dao',
  'nft',
])

const KNOWN_NICKNAMES: Record<string, EthAddress> = {
  alice: mockEngine.generateAddress('alice'),
  marco: mockEngine.generateAddress('marco'),
  bob: mockEngine.generateAddress('bob'),
}

export const checkNicknameAvailability = async (
  nickname: string,
): Promise<{ available: boolean; suggestion?: string }> => {
  await mockDelay(DELAYS.nicknameCheck)
  const normalized = nickname.toLowerCase().trim()
  if (TAKEN.has(normalized)) {
    return { available: false, suggestion: `${normalized}2024` }
  }
  return { available: true }
}

export const resolveRecipient = async (
  input: string,
): Promise<{ address: EthAddress; displayName: string } | null> => {
  await mockDelay(200)
  const trimmed = input.trim()

  // Raw 0x address
  if (/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
    return { address: trimmed as EthAddress, displayName: trimmed }
  }

  // ENS name (.eth)
  if (trimmed.endsWith('.eth')) {
    const name = trimmed.replace('.eth', '')
    const addr = KNOWN_NICKNAMES[name] ?? mockEngine.generateAddress(name)
    return { address: addr, displayName: trimmed }
  }

  // Full nb.zksync.io username
  if (trimmed.endsWith('.nb.zksync.io')) {
    const name = trimmed.replace('.nb.zksync.io', '')
    const addr = KNOWN_NICKNAMES[name] ?? mockEngine.generateAddress(name)
    return { address: addr, displayName: name }
  }

  // Bare username
  if (/^[a-z0-9-]{3,20}$/.test(trimmed)) {
    const addr =
      KNOWN_NICKNAMES[trimmed] ?? mockEngine.generateAddress(trimmed)
    return {
      address: addr,
      displayName: trimmed,
    }
  }

  return null
}
