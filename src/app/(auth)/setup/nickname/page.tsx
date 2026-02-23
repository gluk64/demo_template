'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { useStore } from '@/store'
import { checkNicknameAvailability } from '@/lib/mock/resolution'
import { NICKNAME_SUFFIX } from '@/lib/constants'
export default function NicknamePage(): React.JSX.Element {
  const router = useRouter()
  const isAuthenticated = useStore((s) => s.isAuthenticated)
  const user = useStore((s) => s.user)
  const claimNickname = useStore((s) => s.claimNickname)

  const [nickname, setNickname] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [availability, setAvailability] = useState<{
    available: boolean
    suggestion?: string
  } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isClaimingRef = useRef(false)

  // Prefetch the entire remaining funnel — user dwells here longest
  useEffect(() => {
    router.prefetch('/setup/addresses')
    router.prefetch('/setup/send-from')
    router.prefetch('/dashboard')
  }, [router])

  // Guard: redirect unauthenticated users to login, users with nickname to dashboard.
  // Skip redirect when the claim flow itself is in progress to avoid
  // a race condition where both router.replace and router.push fire simultaneously.
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }
    if (user?.nickname && !isClaimingRef.current) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, user?.nickname, router])

  const handleNicknameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
      setNickname(value)
      setAvailability(null)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (value.length < 3) {
        setIsChecking(false)
        return
      }

      setIsChecking(true)
      debounceRef.current = setTimeout(async () => {
        const result = await checkNicknameAvailability(value)
        setAvailability(result)
        setIsChecking(false)
      }, 400)
    },
    [],
  )

  const handleClaim = useCallback(async (): Promise<void> => {
    if (!nickname || !availability?.available) return
    isClaimingRef.current = true
    setIsClaiming(true)
    await claimNickname(nickname)
    router.push('/setup/addresses')
  }, [nickname, availability, claimNickname, router])

  const handleSkip = useCallback((): void => {
    router.push('/setup/addresses')
  }, [router])

  const isValid = nickname.length >= 3 && availability?.available === true

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && isValid && !isClaiming) {
        e.preventDefault()
        void handleClaim()
      }
    },
    [isValid, isClaiming, handleClaim],
  )

  return (
    <div className="flex w-full max-w-sm flex-col items-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }}
        className="w-full max-w-[400px]"
      >
        <StepIndicator current={1} total={3} />

        <Card>
          <h1 className="text-h2 font-semibold text-text-primary mb-3">
            Public name.{' '}
            <span className="whitespace-nowrap">Private finances.</span>
          </h1>
          <p className="text-sm font-normal leading-relaxed text-text-secondary mb-6">
            Claim a username and share it with anyone to receive funds. Each payment arrives
            through a fresh address — senders can&apos;t link your transfers
            or see your balance, even on-chain.
          </p>

          <div>
            <Input
              label="Username"
              value={nickname}
              onChange={handleNicknameChange}
              onKeyDown={handleKeyDown}
              placeholder="your-name"
              aria-label="Username"
              data-testid="nickname-input"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-1p-ignore="true"
              data-lpignore="true"
              data-form-type="other"
              hint={
                nickname.length > 0
                  ? `${nickname}${NICKNAME_SUFFIX}`
                  : undefined
              }
              error={
                availability && !availability.available
                  ? `Taken${availability.suggestion ? ` — try ${availability.suggestion}` : ''}`
                  : undefined
              }
            />
          </div>

          {/* Status indicator */}
          <div className="mt-2 flex min-h-[24px] items-center gap-2">
            {isChecking && (
              <>
                <Loader2
                  className="h-3 w-3 animate-spin text-text-tertiary"
                  aria-hidden="true"
                />
                <span className="text-label text-text-tertiary">
                  Checking...
                </span>
              </>
            )}
            {!isChecking && availability?.available && nickname.length >= 3 && (
              <span className="text-label text-success">Available</span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              disabled={!isValid}
              isLoading={isClaiming}
              onClick={handleClaim}
              data-testid="claim-nickname-button"
            >
              Claim username
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
