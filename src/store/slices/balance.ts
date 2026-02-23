import { SEED_BALANCES } from '@/lib/mock/seedData'
import type { StateCreator } from 'zustand'
import type { RootState } from '../index'
import type { TokenBalance } from '@/types'

export type BalanceSlice = {
  balances: Record<string, TokenBalance>
  lastUpdatedAt: number
  deductBalance: (amount: number, token?: string) => void
  addBalance: (amount: number, token?: string) => void
}

export const createBalanceSlice: StateCreator<
  RootState,
  [],
  [],
  BalanceSlice
> = (set) => ({
  balances: SEED_BALANCES,
  lastUpdatedAt: Date.now(),

  deductBalance: (amount: number, token = 'USDC') =>
    set((state) => {
      const current = state.balances[token]
      if (!current) return state
      const updated: TokenBalance = {
        ...current,
        amount: current.amount - amount,
        usdValue: current.usdValue - amount,
      }
      return {
        balances: { ...state.balances, [token]: updated },
        lastUpdatedAt: Date.now(),
      }
    }),

  addBalance: (amount: number, token = 'USDC') =>
    set((state) => {
      const current = state.balances[token]
      if (!current) return state
      const updated: TokenBalance = {
        ...current,
        amount: current.amount + amount,
        usdValue: current.usdValue + amount,
      }
      return {
        balances: { ...state.balances, [token]: updated },
        lastUpdatedAt: Date.now(),
      }
    }),
})
