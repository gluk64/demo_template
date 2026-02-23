'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'

const GoogleIcon = (): React.JSX.Element => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      fill="var(--accent)"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      fill="var(--success)"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      fill="var(--warning)"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      fill="var(--error)"
    />
  </svg>
)

export default function LoginPage(): React.JSX.Element {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const login = useStore((s) => s.login)
  const isAuthenticated = useStore((s) => s.isAuthenticated)
  const user = useStore((s) => s.user)

  // Fix B: Only redirect away from login if genuinely authenticated WITH a nickname
  // Do NOT redirect if authenticated but no nickname — let them proceed through login
  useEffect(() => {
    if (isAuthenticated && user?.nickname) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, user, router])

  // Fix C: Reset isLoading on unmount so button is never stuck
  useEffect(() => {
    return () => setIsLoading(false)
  }, [])

  // Fix A: Always execute the auth handler — never short-circuit on stale auth state
  const handleLogin = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      await login()
      document.cookie = 'nab_session=1; path=/; max-age=86400'
      router.push('/setup/nickname')
    } catch {
      setIsLoading(false)
    }
  }, [login, router])

  return (
    <div className="flex w-full max-w-sm flex-col items-center px-5">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }}
        className="mb-8 text-center"
      >
        <h1 className="text-h3 font-semibold tracking-[0.1em] text-text-primary">
          NOT A BANK
        </h1>
        <p className="mt-2 text-base font-normal text-text-secondary">
          Store, spend, earn, borrow. Privately.
        </p>
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.08, ease: [0.0, 0.0, 0.2, 1] }}
        className="w-full max-w-[400px]"
      >
        <Card>
          {/* Primary CTA */}
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleLogin}
            isLoading={isLoading}
            leftIcon={!isLoading ? <GoogleIcon /> : undefined}
            aria-label="Continue with Google"
            data-testid="google-login-button"
          >
            Continue with Google
          </Button>

          {/* Secondary options */}
          <div className="mt-6 flex items-center justify-center gap-1 text-sm text-text-secondary">
            <span>or use a</span>
            <button
              type="button"
              className="min-h-[52px] px-1 font-medium text-accent transition-colors hover:text-accent-hover"
            >
              wallet
            </button>
            <span>or</span>
            <button
              type="button"
              className="min-h-[52px] px-1 font-medium text-accent transition-colors hover:text-accent-hover"
            >
              passkey
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Legal line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, delay: 0.2 }}
        className="mt-6 whitespace-nowrap text-center text-micro text-text-tertiary"
      >
        Reference implementation &middot; Powered by{' '}
        <a
          href="https://www.zksync.io/prividium"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors duration-150 hover:text-text-secondary"
        >
          ZKsync Prividium
        </a>
      </motion.p>
    </div>
  )
}
