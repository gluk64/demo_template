import type { StateCreator } from 'zustand'
import type { RootState } from '../index'

// App-specific UI state goes here. Add transient state
// that should NOT be persisted (resets on reload).

export type UISlice = {
  _placeholder?: never // Remove when adding real UI state
}

export const createUISlice: StateCreator<RootState, [], [], UISlice> = () => ({})
