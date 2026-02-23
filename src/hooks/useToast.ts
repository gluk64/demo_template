'use client'
import { create } from 'zustand'

type Toast = {
  id: string
  message: string
  variant: 'success' | 'error' | 'info'
}

type ToastStore = {
  toasts: Toast[]
  addToast: (message: string, variant?: Toast['variant']) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, variant = 'info') => {
    const id = `toast-${Date.now()}`
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, variant === 'error' ? 6000 : 4000)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export const useToast = () => {
  const { addToast } = useToastStore()
  return {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  }
}
