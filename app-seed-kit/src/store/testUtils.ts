import { createStore as zustandCreateStore } from 'zustand'
import { createAuthSlice } from './slices/auth'
import { createUISlice } from './slices/ui'
import type { RootState } from './index'

/**
 * Creates a fresh store instance for testing (no persist middleware).
 * Each test gets an isolated store to avoid shared state.
 */
export const createStore = () =>
  zustandCreateStore<RootState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createUISlice(...a),
  }))
