import { formatUSD, formatAmountDelta } from '@/lib/formatting/currency'

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
