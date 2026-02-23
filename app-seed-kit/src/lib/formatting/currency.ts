export type AmountDirection = 'inbound' | 'outbound'

export const formatUSD = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

export const formatAmountDelta = (
  amount: number,
  direction: AmountDirection,
): string => `${direction === 'outbound' ? '-' : '+'}${formatUSD(Math.abs(amount))}`
