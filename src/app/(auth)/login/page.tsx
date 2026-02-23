'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'

export default function LoginPage(): React.JSX.Element {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const login = useStore((s) => s.login)

  const handleLogin = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      await login()
      document.cookie = 'uismoke_session=1; path=/; max-age=86400'
      router.push('/dashboard')
    } catch {
      setIsLoading(false)
    }
  }, [login, router])

  return (
    <div className="flex w-full max-w-sm flex-col items-center px-5">
      <div className="mb-8 text-center">
        <h1 className="text-h3 font-semibold tracking-[0.1em] text-text-primary">
          UISmoke
        </h1>
        <p className="mt-2 text-base font-normal text-text-secondary">
          UI component smoke test application
        </p>
      </div>

      <div className="w-full max-w-[400px]">
        <Card>
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleLogin}
            isLoading={isLoading}
            aria-label="Sign in"
            data-testid="login-button"
          >
            Sign in
          </Button>
        </Card>
      </div>
    </div>
  )
}
