'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useStore } from '@/store'
import { useToast } from '@/hooks/useToast'
import { checkNicknameAvailability } from '@/lib/mock/resolution'
import { NICKNAME_SUFFIX } from '@/lib/constants'

export default function EditUsernamePage(): React.JSX.Element {
  const router = useRouter()
  const toast = useToast()
  const user = useStore((s) => s.user)
  const updateNickname = useStore((s) => s.updateNickname)
  const currentNickname = user?.nickname ?? ''

  const [nickname, setNickname] = useState(currentNickname)
  const [isChecking, setIsChecking] = useState(false)
  const [availability, setAvailability] = useState<{
    available: boolean
    suggestion?: string
  } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleNicknameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
      setNickname(value)
      setAvailability(null)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (value.length < 3 || value === currentNickname) {
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
    [currentNickname],
  )

  const isUnchanged = nickname === currentNickname
  const isValid =
    nickname.length >= 3 &&
    !isUnchanged &&
    !isChecking &&
    availability?.available === true

  const handleSave = useCallback((): void => {
    if (!isValid) return
    updateNickname(nickname)
    toast.success('Username updated')
    router.push('/settings')
  }, [isValid, nickname, updateNickname, toast, router])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && isValid) {
        e.preventDefault()
        handleSave()
      }
    },
    [isValid, handleSave],
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="w-full max-w-[400px]">
        <button
          type="button"
          onClick={(): void => router.push('/settings')}
          className="mb-8 flex items-center gap-1.5 self-start text-[15px] text-text-secondary transition-colors duration-150 hover:text-text-primary"
        >
          <ChevronLeft size={18} />
          Back to settings
        </button>

        <h1 className="mb-2 text-[24px] font-semibold text-text-primary">
          Edit username
        </h1>
        <p className="mb-8 text-[15px] leading-relaxed text-text-secondary">
          Choose a new public username for your account.
        </p>

        <Input
          label="Username"
          value={nickname}
          onChange={handleNicknameChange}
          onKeyDown={handleKeyDown}
          placeholder="your-name"
          aria-label="Username"
          data-testid="username-input"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          hint={nickname.length > 0 ? `${nickname}${NICKNAME_SUFFIX}` : undefined}
          error={
            availability && !availability.available
              ? `Taken${availability.suggestion ? ` — try ${availability.suggestion}` : ''}`
              : undefined
          }
        />

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
          {!isChecking && !isUnchanged && availability?.available && nickname.length >= 3 && (
            <span className="text-label text-success">Available</span>
          )}
        </div>

        <Button
          variant="primary"
          size="md"
          className="mt-6 w-full"
          disabled={!isValid}
          onClick={handleSave}
          data-testid="save-username-button"
        >
          Save changes
        </Button>

        <Button
          variant="ghost"
          size="md"
          className="mt-3 w-full"
          onClick={(): void => router.push('/settings')}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
