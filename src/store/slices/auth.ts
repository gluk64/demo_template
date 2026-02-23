import { mockDelay, DELAYS } from '@/lib/mock/engine'
import type { StateCreator } from 'zustand'
import type { RootState } from '../index'
import type { User } from '@/types'

export type AuthSlice = {
  isAuthenticated: boolean
  user: User | null
  login: () => Promise<void>
  claimNickname: (nickname: string) => Promise<void>
  updateNickname: (nickname: string) => void
  completeOnboarding: () => void
  logout: () => void
}

export const createAuthSlice: StateCreator<RootState, [], [], AuthSlice> = (
  set,
) => ({
  isAuthenticated: false,
  user: null,

  login: async () => {
    await mockDelay(DELAYS.login)
    set({
      isAuthenticated: true,
      user: {
        id: 'user-demo-001',
        nickname: null,
        email: 'vitalik@gmail.com',
        depositAddress: null,
        hasCompletedOnboarding: false,
        createdAt: Date.now(),
      },
    })
  },

  claimNickname: async (nickname: string) => {
    await mockDelay(400)
    set((state) => ({
      user: state.user ? { ...state.user, nickname } : null,
    }))
  },

  updateNickname: (nickname: string) =>
    set((state) => ({
      user: state.user ? { ...state.user, nickname } : null,
    })),

  completeOnboarding: () => {
    set((state) => ({
      user: state.user ? { ...state.user, hasCompletedOnboarding: true } : null,
    }))
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      // Clear persistence first
      localStorage.removeItem('nab_v1')
      document.cookie = 'nab_session=; path=/; max-age=0'
      // Force full browser reload to /login — clears all React and Zustand state
      window.location.href = '/login'
    }
  },
})
