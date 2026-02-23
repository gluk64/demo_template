import type { StateCreator } from 'zustand'
import type { RootState } from '../index'
import type { Contact } from '@/types'

type SendWizardStep = 'from' | 'recipient' | 'amount' | 'review'

export type ChainOption = 'zksync' | 'ethereum'
export type TokenOption = 'USDC' | 'USDT'

type SendWizard = {
  step: SendWizardStep
  amount: number | null
  recipientInput: string
  resolvedAddress: string | null
  resolvedDisplayName: string | null
  resolvedContact: Contact | null
  isNewRecipient: boolean
  hasAcknowledged: boolean
  selectedChain: ChainOption
  selectedToken: TokenOption
  selectedFromAddress: 'private' | string
}

export type UISlice = {
  isPrivateMode: boolean
  togglePrivateMode: () => void
  sendWizard: SendWizard
  updateSendWizard: (updates: Partial<SendWizard>) => void
  resetSendWizard: () => void
}

const defaultSendWizard: SendWizard = {
  step: 'from',
  amount: null,
  recipientInput: '',
  resolvedAddress: null,
  resolvedDisplayName: null,
  resolvedContact: null,
  isNewRecipient: false,
  hasAcknowledged: false,
  selectedChain: 'zksync',
  selectedToken: 'USDC',
  selectedFromAddress: 'private',
}

export const createUISlice: StateCreator<RootState, [], [], UISlice> = (
  set,
) => ({
  isPrivateMode: false,
  togglePrivateMode: () =>
    set((state) => ({ isPrivateMode: !state.isPrivateMode })),
  sendWizard: defaultSendWizard,
  updateSendWizard: (updates) =>
    set((state) => ({
      sendWizard: { ...state.sendWizard, ...updates },
    })),
  resetSendWizard: () => set({ sendWizard: defaultSendWizard }),
})
