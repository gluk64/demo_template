// Default: 6+6. Use everywhere unless space is genuinely too tight.
export const formatAddress = (address: string, chars = 6): string =>
  `${address.slice(0, chars + 2)}...${address.slice(-chars)}`

export const isValidEthAddress = (value: string): boolean =>
  /^0x[0-9a-fA-F]{40}$/.test(value)
