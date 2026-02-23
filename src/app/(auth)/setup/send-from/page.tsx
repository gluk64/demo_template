'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { useStore } from '@/store'
import { formatAddress } from '@/lib/formatting/address'
import { mockEngine } from '@/lib/mock/engine'

const MOCK_ADDRESS = formatAddress(mockEngine.generateAddress('onboarding-primary'), 4)

export default function SendFromPage(): React.JSX.Element {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const [isLoading, setIsLoading] = useState(false)

  // Prefetch dashboard so navigation is instant
  useEffect(() => {
    router.prefetch('/dashboard')
  }, [router])

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.hasCompletedOnboarding) {
      router.replace('/dashboard')
    }
  }, [user, router])

  const handleGetStarted = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    completeOnboarding()
    await new Promise((resolve) => setTimeout(resolve, 300))
    router.push('/dashboard')
  }, [completeOnboarding, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="w-full max-w-[480px]">
        <StepIndicator current={3} total={3} />

        <h1 className="text-h2 font-semibold text-text-primary mb-0">
          Send privately.
        </h1>
        <h1 className="text-h2 font-semibold text-text-primary mb-3">
          Choose your alias.
        </h1>
        <p className="text-[15px] font-normal leading-relaxed text-text-secondary mb-8">
          When you send funds, choose which address to send from.
          Use Not a Bank&apos;s shared pool to stay anonymous, or send from
          a specific stealth address — the connection stays private.
        </p>

        {/* Mock card selection — non-interactive, demonstration only */}
        <div className="flex flex-col gap-3">
          {/* Option A: Hide my address (selected) */}
          <div
            className="rounded-xl border-2 border-accent bg-bg-surface px-4 py-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <span className="text-base font-semibold text-text-primary">
                  Hide my address
                </span>
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                  Funds route through Not a Bank&apos;s shared pool.
                  The sending address is not linked to your account.
                </p>
              </div>
              <div className="mt-0.5 flex-shrink-0 ml-3">
                <Check size={18} className="text-accent" />
              </div>
            </div>
          </div>

          {/* Divider with "or" */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-label text-text-tertiary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Option B: Specific address (unselected) */}
          <div
            className="rounded-xl border border-border bg-bg-raised px-4 py-3 opacity-60"
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-text-secondary">
                Primary — {MOCK_ADDRESS}
              </span>
              <div className="flex-shrink-0 ml-3">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-border" />
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full mt-8"
          onClick={handleGetStarted}
          disabled={isLoading}
          isLoading={isLoading}
          data-testid="get-started-button"
        >
          Get started &rarr;
        </Button>
      </div>
    </div>
  )
}
