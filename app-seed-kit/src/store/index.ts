import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createAuthSlice, type AuthSlice } from './slices/auth'
import { createUISlice, type UISlice } from './slices/ui'

export type RootState = AuthSlice & UISlice

// To add more slices:
// 1. Create the slice in store/slices/mySlice.ts
// 2. Import and add to RootState type above
// 3. Spread in the store creator below
// 4. Add persisted fields to partialize if needed

export const useStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: '[app]_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
)
