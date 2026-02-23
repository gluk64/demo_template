'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { useStore } from '@/store'
import { formatAddress } from '@/lib/formatting/address'
import { mockEngine } from '@/lib/mock/engine'

const MOCK_ADDRESSES = [
  { label: 'Work', address: formatAddress(mockEngine.generateAddress('onboarding-work')) },
  { label: 'Personal', address: formatAddress(mockEngine.generateAddress('onboarding-personal')) },
  { label: 'Exchange', address: formatAddress(mockEngine.generateAddress('onboarding-exchange')) },
]

export default function AddressesPage(): React.JSX.Element {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const [isLoading, setIsLoading] = useState(false)

  // Prefetch remaining funnel steps
  useEffect(() => {
    router.prefetch('/setup/send-from')
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

  const handleContinue = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    router.push('/setup/send-from')
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="w-full max-w-[480px]">
        <StepIndicator current={2} total={3} />

        <h1 className="text-h2 font-semibold text-text-primary mb-3">
          Your addresses are unlinkable.
        </h1>
        <p className="text-sm font-normal leading-relaxed text-text-secondary mb-8">
          Generate one per context. Senders can&apos;t link addresses to each
          other or to your account.
        </p>

        {/* Mock address cards */}
        <div className="mb-8 flex flex-col gap-2">
          {MOCK_ADDRESSES.map((card, index) => (
            <div
              key={card.label}
              className={`flex items-center justify-between rounded-xl border border-border bg-bg-surface px-4 py-3${index === 2 ? ' opacity-60' : ''}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">
                  {card.label}
                </span>
                <span className="font-mono text-micro text-text-tertiary">
                  {card.address}
                </span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleContinue}
          disabled={isLoading}
          isLoading={isLoading}
          data-testid="continue-button"
        >
          Continue &rarr;
        </Button>
      </div>
    </div>
  )
}
