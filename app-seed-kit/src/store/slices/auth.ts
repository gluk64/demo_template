import { mockDelay, DELAYS } from '@/lib/mock/engine'
import type { StateCreator } from 'zustand'
import type { RootState } from '../index'
import type { User } from '@/types'

export type AuthSlice = {
  isAuthenticated: boolean
  user: User | null
  login: () => Promise<void>
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
        email: 'user@example.com',
        createdAt: Date.now(),
      },
    })
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('[app]_v1')
      document.cookie = '[app]_session=; path=/; max-age=0'
      window.location.href = '/login'
    }
  },
})
