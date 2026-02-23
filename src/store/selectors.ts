import type { RootState } from './index'
import type { Contact, DepositAddress, Transaction } from '@/types'

export const selectNetWorth = (state: RootState): number =>
  Object.values(state.balances).reduce((sum, b) => sum + b.usdValue, 0)

export const selectVerifiedContacts = (state: RootState): Contact[] =>
  state.contacts.filter((c) => c.verificationStatus === 'verified')

export const selectIsNewRecipient =
  (address: string) =>
  (state: RootState): boolean =>
    !state.contacts.some(
      (c) => c.address.toLowerCase() === address.toLowerCase(),
    )

export const selectContactByAddress =
  (address: string) =>
  (state: RootState): Contact | undefined =>
    state.contacts.find(
      (c) => c.address.toLowerCase() === address.toLowerCase(),
    )

export const selectRecentTransactions =
  (limit: number) =>
  (state: RootState): Transaction[] =>
    [...state.transactions]
      .sort((a, b) => b.initiatedAt - a.initiatedAt)
      .slice(0, limit)

/**
 * Pre-built selectors for common limits.
 * Using these in components avoids creating a new closure on every render,
 * which would cause infinite re-render loops with useSyncExternalStore.
 */
export const selectRecentTransactions5 = selectRecentTransactions(5)
export const selectRecentTransactions10 = selectRecentTransactions(10)

export const selectActiveDepositAddress = (
  state: RootState,
): DepositAddress | null =>
  state.depositAddresses.find((a) => a.isActive) ?? null

/**
 * Check whether a (recipient, fromAddressId) pairing has been used before.
 * Returns true when the pairing is new (no matching send found in history).
 * Private sends (fromAddressId === 'private') are never flagged.
 */
export const isNewSenderRecipientPairing = (
  transactions: Transaction[],
  recipient: string,
  fromAddressId: string,
): boolean => {
  if (fromAddressId === 'private') return false

  return !transactions.some(
    (tx) =>
      tx.direction === 'outbound' &&
      tx.fromAddressId === fromAddressId &&
      (tx.recipientAddress === recipient ||
        tx.recipientNickname === recipient),
  )
}
