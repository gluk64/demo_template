import { createStore } from '@/store/testUtils'
import {
  selectNetWorth,
  selectVerifiedContacts,
  selectIsNewRecipient,
  selectRecentTransactions,
  selectActiveDepositAddress,
} from '@/store/selectors'

describe('selectors', () => {
  describe('selectNetWorth', () => {
    it('returns sum of all balance USD values', () => {
      const store = createStore()
      const netWorth = selectNetWorth(store.getState())
      expect(netWorth).toBe(12430)
    })

    it('returns 0 after deducting full balances', () => {
      const store = createStore()
      store.getState().deductBalance(10430, 'USDC')
      store.getState().deductBalance(2000, 'USDT')
      expect(selectNetWorth(store.getState())).toBe(0)
    })
  })

  describe('selectVerifiedContacts', () => {
    it('returns only verified contacts', () => {
      const store = createStore()
      const verified = selectVerifiedContacts(store.getState())
      expect(verified.length).toBeGreaterThan(0)
      for (const c of verified) {
        expect(c.verificationStatus).toBe('verified')
      }
    })
  })

  describe('selectIsNewRecipient', () => {
    it('returns false for a known contact address', () => {
      const store = createStore()
      const contacts = store.getState().contacts
      const knownAddress = contacts[0]?.address
      if (knownAddress) {
        expect(selectIsNewRecipient(knownAddress)(store.getState())).toBe(false)
      }
    })

    it('returns true for an unknown address', () => {
      const store = createStore()
      expect(
        selectIsNewRecipient('0x0000000000000000000000000000000000000000')(store.getState()),
      ).toBe(true)
    })
  })

  describe('selectRecentTransactions', () => {
    it('returns transactions sorted by time descending', () => {
      const store = createStore()
      const txs = selectRecentTransactions(10)(store.getState())
      for (let i = 1; i < txs.length; i++) {
        expect(txs[i - 1]!.initiatedAt).toBeGreaterThanOrEqual(txs[i]!.initiatedAt)
      }
    })

    it('respects the limit parameter', () => {
      const store = createStore()
      const txs = selectRecentTransactions(2)(store.getState())
      expect(txs.length).toBeLessThanOrEqual(2)
    })
  })

  describe('selectActiveDepositAddress', () => {
    it('returns seed address when store is initialized', () => {
      const store = createStore()
      const active = selectActiveDepositAddress(store.getState())
      expect(active).not.toBeNull()
      expect(active?.isActive).toBe(true)
      expect(active?.label).toBe('Primary')
    })
  })
})
