'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useToastStore } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

export const ToastRenderer = (): React.JSX.Element => {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-md:bottom-20 max-md:right-4 max-md:left-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.0, 0.0, 0.2, 1] }}
            className={cn(
              'flex items-center gap-3 rounded-md border border-border bg-bg-surface px-4 py-3 shadow-lg',
              toast.variant === 'success' && 'border-l-4 border-l-success',
              toast.variant === 'error' && 'border-l-4 border-l-error',
              toast.variant === 'info' && 'border-l-4 border-l-accent',
            )}
          >
            <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
            <button
              type="button"
              onClick={(): void => removeToast(toast.id)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-tertiary transition-colors hover:text-text-secondary"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
