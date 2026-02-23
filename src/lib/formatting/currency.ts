import type { TransactionDirection } from '@/types'

export const formatUSD = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

export const formatAmountDelta = (
  amount: number,
  direction: TransactionDirection,
): string => `${direction === 'outbound' ? '-' : '+'}${formatUSD(Math.abs(amount))}`
