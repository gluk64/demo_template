import { checkNicknameAvailability, resolveRecipient } from '@/lib/mock/resolution'

beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.useRealTimers()
})

describe('checkNicknameAvailability', () => {
  it('returns available for a non-taken name', async () => {
    const promise = checkNicknameAvailability('testuser')
    jest.advanceTimersByTime(500)
    const result = await promise

    expect(result.available).toBe(true)
    expect(result.suggestion).toBeUndefined()
  })

  it('returns unavailable for a taken name', async () => {
    const promise = checkNicknameAvailability('admin')
    jest.advanceTimersByTime(500)
    const result = await promise

    expect(result.available).toBe(false)
  })

  it('returns a suggestion for taken names', async () => {
    const promise = checkNicknameAvailability('admin')
    jest.advanceTimersByTime(500)
    const result = await promise

    expect(result.suggestion).toBe('admin2024')
  })

  it('is case-insensitive', async () => {
    const promise = checkNicknameAvailability('ADMIN')
    jest.advanceTimersByTime(500)
    const result = await promise

    expect(result.available).toBe(false)
  })

  it('trims whitespace', async () => {
    const promise = checkNicknameAvailability('  admin  ')
    jest.advanceTimersByTime(500)
    const result = await promise

    expect(result.available).toBe(false)
  })

  it('returns available for names not in the taken set', async () => {
    const names = ['alice', 'marco', 'testuser', 'myname']
    for (const name of names) {
      const promise = checkNicknameAvailability(name)
      jest.advanceTimersByTime(500)
      const result = await promise
      expect(result.available).toBe(true)
    }
  })

  it('returns unavailable for all names in the taken set', async () => {
    const taken = ['admin', 'bank', 'zk', 'crypto', 'john', 'ethereum', 'wallet', 'defi', 'dao', 'nft']
    for (const name of taken) {
      const promise = checkNicknameAvailability(name)
      jest.advanceTimersByTime(500)
      const result = await promise
      expect(result.available).toBe(false)
    }
  })
})

describe('resolveRecipient', () => {
  it('resolves a raw 0x address', async () => {
    const addr = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    const promise = resolveRecipient(addr)
    jest.advanceTimersByTime(300)
    const result = await promise

    expect(result).not.toBeNull()
    expect(result?.address).toBe(addr)
    expect(result?.displayName).toBe(addr)
  })

  it('resolves an ENS name (.eth)', async () => {
    const promise = resolveRecipient('alice.eth')
    jest.advanceTimersByTime(300)
    const result = await promise

    expect(result).not.toBeNull()
    expect(result?.address).toMatch(/^0x/)
    expect(result?.displayName).toBe('alice.eth')
  })

  it('resolves a .nb.zksync.io username', async () => {
    const promise = resolveRecipient('alice.nb.zksync.io')
    jest.advanceTimersByTime(300)
    const result = await promise

    expect(result).not.toBeNull()
    expect(result?.address).toMatch(/^0x/)
    expect(result?.displayName).toBe('alice')
  })

  it('resolves a bare username to short display name', async () => {
    const promise = resolveRecipient('alice')
    jest.advanceTimersByTime(300)
    const result = await promise

    expect(result).not.toBeNull()
    expect(result?.address).toMatch(/^0x/)
    expect(result?.displayName).toBe('alice')
  })

  it('returns null for invalid input', async () => {
    const promise = resolveRecipient('ab')
    jest.advanceTimersByTime(300)
    const result = await promise

    expect(result).toBeNull()
  })

  it('returns null for input with special characters', async () => {
    const promise = resolveRecipient('hello@world')
    jest.advanceTimersByTime(300)
    const result = await promise

    expect(result).toBeNull()
  })
})
