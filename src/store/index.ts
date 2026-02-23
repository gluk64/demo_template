import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createAuthSlice, type AuthSlice } from './slices/auth'
import { createBalanceSlice, type BalanceSlice } from './slices/balance'
import { createContactsSlice, type ContactsSlice } from './slices/contacts'
import {
  createTransactionsSlice,
  type TransactionsSlice,
} from './slices/transactions'
import { createDepositSlice, type DepositSlice } from './slices/deposit'
import { createUISlice, type UISlice } from './slices/ui'

export type RootState = AuthSlice &
  BalanceSlice &
  ContactsSlice &
  TransactionsSlice &
  DepositSlice &
  UISlice

export const useStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createBalanceSlice(...a),
      ...createContactsSlice(...a),
      ...createTransactionsSlice(...a),
      ...createDepositSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'nab_v1',
      storage: createJSONStorage(() => localStorage),
      // Only persist data — never UI state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        balances: state.balances,
        contacts: state.contacts,
        transactions: state.transactions,
        depositAddresses: state.depositAddresses,
      }),
    },
  ),
)
