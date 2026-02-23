import { mockEngine, mockDelay, DELAYS } from '@/lib/mock/engine'
import { SEED_DEPOSIT_ADDRESSES } from '@/lib/mock/seedData'
import type { StateCreator } from 'zustand'
import type { RootState } from '../index'
import type { DepositAddress } from '@/types'

export type DepositSlice = {
  depositAddresses: DepositAddress[]
  isGenerating: boolean
  expandedAddressId: string | null
  generateDepositAddress: (label: string) => Promise<void>
  updateAddressLabel: (id: string, label: string) => void
  toggleExpandAddress: (id: string) => void
}

export const createDepositSlice: StateCreator<
  RootState,
  [],
  [],
  DepositSlice
> = (set) => ({
  depositAddresses: SEED_DEPOSIT_ADDRESSES,
  isGenerating: false,
  expandedAddressId: null,

  generateDepositAddress: async (label: string) => {
    set({ isGenerating: true })
    await mockDelay(DELAYS.addressGenerate)
    const address = mockEngine.generateAddress(`user-receive-${Date.now()}`)
    const id = `addr-${Date.now()}`
    set((state) => ({
      isGenerating: false,
      depositAddresses: [
        ...state.depositAddresses,
        { id, address, label, generatedAt: Date.now(), isActive: true },
      ],
    }))
  },

  updateAddressLabel: (id: string, label: string) =>
    set((state) => ({
      depositAddresses: state.depositAddresses.map((a) =>
        a.id === id ? { ...a, label } : a,
      ),
    })),

  toggleExpandAddress: (id: string) =>
    set((state) => ({
      expandedAddressId: state.expandedAddressId === id ? null : id,
    })),
})
