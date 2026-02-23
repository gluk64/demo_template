import type { EthAddress } from '@/types'

// Mulberry32 — seedable PRNG, deterministic
const mulberry32 = (seed: number): number => {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

class MockEngine {
  private seed: number = 42

  setSeed(s: number): void {
    this.seed = s
  }

  next(): number {
    const value = mulberry32(this.seed)
    this.seed++
    return value
  }

  generateAddress(namespace: string): EthAddress {
    // Deterministic: same namespace always produces same address
    let hash = 5381
    for (let i = 0; i < namespace.length; i++) {
      hash = ((hash << 5) + hash + namespace.charCodeAt(i)) & 0xffffffff
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0')
    return `0x${hex.repeat(5).slice(0, 40)}` as EthAddress
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  simulateSendResult(_amount: number): 'success' | 'failed' {
    // ~10% failure rate, deterministic
    return this.next() > 0.1 ? 'success' : 'failed'
  }
}

export const mockEngine = new MockEngine()

export const DELAYS = {
  login: 400,
  nicknameCheck: 350,
  addressGenerate: 700,
  send: { min: 900, max: 1500 },
} as const

export const mockDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const randomDelay = (min: number, max: number): Promise<void> =>
  mockDelay(min + Math.floor(mockEngine.next() * (max - min)))
