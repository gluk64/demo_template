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

  generateId(namespace: string): string {
    let hash = 5381
    for (let i = 0; i < namespace.length; i++) {
      hash = ((hash << 5) + hash + namespace.charCodeAt(i)) & 0xffffffff
    }
    return Math.abs(hash).toString(16).padStart(8, '0')
  }
}

export const mockEngine = new MockEngine()

export const DELAYS = {
  login: 400,
  check: 350,
  generate: 700,
  action: { min: 900, max: 1500 },
} as const

export const mockDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const randomDelay = (min: number, max: number): Promise<void> =>
  mockDelay(min + Math.floor(mockEngine.next() * (max - min)))
