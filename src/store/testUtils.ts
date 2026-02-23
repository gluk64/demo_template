import { createStore as zustandCreateStore } from 'zustand'
import { createAuthSlice } from './slices/auth'
import { createBalanceSlice } from './slices/balance'
import { createContactsSlice } from './slices/contacts'
import { createTransactionsSlice } from './slices/transactions'
import { createDepositSlice } from './slices/deposit'
import { createUISlice } from './slices/ui'
import type { RootState } from './index'

/**
 * Creates a fresh store instance for testing (no persist middleware).
 * Each test gets an isolated store to avoid shared state.
 */
export const createStore = () =>
  zustandCreateStore<RootState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createBalanceSlice(...a),
    ...createContactsSlice(...a),
    ...createTransactionsSlice(...a),
    ...createDepositSlice(...a),
    ...createUISlice(...a),
  }))
