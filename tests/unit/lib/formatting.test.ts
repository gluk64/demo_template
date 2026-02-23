import { formatUSD, formatAmountDelta } from '@/lib/formatting/currency'
import { formatAddress, isValidEthAddress } from '@/lib/formatting/address'

describe('formatUSD', () => {
  it('formats thousands with commas', () => {
    expect(formatUSD(12430)).toBe('$12,430.00')
  })

  it('formats zero', () => {
    expect(formatUSD(0)).toBe('$0.00')
  })

  it('formats two decimal places', () => {
    expect(formatUSD(1.5)).toBe('$1.50')
  })

  it('formats large amounts', () => {
    expect(formatUSD(1000000)).toBe('$1,000,000.00')
  })

  it('rounds to two decimal places', () => {
    expect(formatUSD(1.999)).toBe('$2.00')
  })
})

describe('formatAmountDelta', () => {
  it('prepends minus for outbound', () => {
    expect(formatAmountDelta(100, 'outbound')).toBe('-$100.00')
  })

  it('prepends plus for inbound', () => {
    expect(formatAmountDelta(100, 'inbound')).toBe('+$100.00')
  })
})

describe('formatAddress', () => {
  it('formats with default 6+6 chars', () => {
    const addr = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    expect(formatAddress(addr)).toBe('0x742d35...38f44e')
  })

  it('formats with custom char count', () => {
    const addr = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    expect(formatAddress(addr, 4)).toBe('0x742d...f44e')
  })
})

describe('isValidEthAddress', () => {
  it('accepts valid address', () => {
    expect(isValidEthAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(true)
  })

  it('rejects short address', () => {
    expect(isValidEthAddress('0x742d35')).toBe(false)
  })

  it('rejects address without 0x prefix', () => {
    expect(isValidEthAddress('742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(false)
  })
})
