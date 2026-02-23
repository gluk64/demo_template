import type { StateCreator } from 'zustand'
import type { RootState } from '../index'

export type UISlice = {
  isPrivateMode: boolean
  togglePrivateMode: () => void
}

export const createUISlice: StateCreator<RootState, [], [], UISlice> = (
  set,
) => ({
  isPrivateMode: false,
  togglePrivateMode: () =>
    set((state) => ({ isPrivateMode: !state.isPrivateMode })),
})
