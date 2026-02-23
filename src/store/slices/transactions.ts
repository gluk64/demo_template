import { SEED_TRANSACTIONS } from '@/lib/mock/seedData'
import type { StateCreator } from 'zustand'
import type { RootState } from '../index'
import type { Transaction } from '@/types'

export type SendPayload = {
  optimisticId: string
  amount: number
  recipientAddress: string
  recipientDisplayName: string
  tokenSymbol: string
  fromAddressId?: string
}

export type SendState =
  | { status: 'idle' }
  | { status: 'pending'; optimisticId: string }
  | { status: 'success'; txId: string }
  | { status: 'failed'; error: string }

export type TransactionsSlice = {
  transactions: Transaction[]
  sendState: SendState
  initiateSend: (payload: SendPayload) => void
  confirmSend: (optimisticId: string) => void
  failSend: (optimisticId: string, error: string) => void
  resetSendState: () => void
}

export const createTransactionsSlice: StateCreator<
  RootState,
  [],
  [],
  TransactionsSlice
> = (set) => ({
  transactions: SEED_TRANSACTIONS,
  sendState: { status: 'idle' },

  initiateSend: (payload) => {
    const optimisticTx: Transaction = {
      id: payload.optimisticId,
      direction: 'outbound',
      amount: payload.amount,
      tokenSymbol: payload.tokenSymbol,
      usdValue: payload.amount,
      recipientAddress: payload.recipientAddress as `0x${string}`,
      recipientNickname: payload.recipientDisplayName,
      fromAddressId: payload.fromAddressId,
      status: 'optimistic',
      initiatedAt: Date.now(),
      isRetryable: false,
    }
    set((state) => ({
      transactions: [optimisticTx, ...state.transactions],
      sendState: { status: 'pending', optimisticId: payload.optimisticId },
    }))
  },

  confirmSend: (optimisticId) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === optimisticId
          ? { ...tx, status: 'confirmed' as const, confirmedAt: Date.now() }
          : tx,
      ),
      sendState: { status: 'success', txId: optimisticId },
    })),

  failSend: (optimisticId, error) =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== optimisticId),
      sendState: { status: 'failed', error },
    })),

  resetSendState: () => set({ sendState: { status: 'idle' } }),
})
