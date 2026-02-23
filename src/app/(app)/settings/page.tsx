'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'

export default function SettingsPage(): React.JSX.Element {
  const user = useStore((s) => s.user)
  const isPrivate = useStore((s) => s.isPrivateMode)
  const togglePrivateMode = useStore((s) => s.togglePrivateMode)
  const logout = useStore((s) => s.logout)

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  const nicknameDisplay = user?.nickname ?? 'Not set'

  const handleSignOut = useCallback((): void => {
    logout()
  }, [logout])

  return (
    <div className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="mb-8 text-h2 font-semibold text-text-primary">
        Settings
      </h1>

      {/* Account section */}
      <p className="mb-3 text-micro font-semibold tracking-[0.08em] text-text-tertiary">
        ACCOUNT
      </p>
      <Card className="p-0">
        <div className="flex items-center justify-between px-7 py-4">
          <div>
            <p className="text-base font-medium text-text-primary">Nickname</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {nicknameDisplay}
            </span>
            {user?.nickname && (
              <Link
                href="/settings/username"
                className="text-text-tertiary hover:text-text-primary transition-colors duration-150"
                aria-label="Edit username"
              >
                <Pencil size={14} />
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Privacy section */}
      <p className="mb-3 mt-8 text-micro font-semibold tracking-[0.08em] text-text-tertiary">
        PRIVACY
      </p>
      <Card className="p-0">
        <div className="flex items-center justify-between px-7 py-4">
          <div>
            <p className="text-base font-medium text-text-primary">
              Private mode
            </p>
            <p className="mt-0.5 text-label text-text-tertiary">
              Blur balances
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPrivate}
            onClick={togglePrivateMode}
            className={`relative inline-flex h-6 w-11 min-h-[44px] items-center rounded-full transition-colors ${isPrivate ? 'bg-accent' : 'bg-bg-overlay'}`}
            aria-label="Toggle private mode"
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </Card>

      {/* Account actions */}
      <p className="mb-3 mt-8 text-micro font-semibold tracking-[0.08em] text-text-tertiary">
        ACCOUNT ACTIONS
      </p>
      <Card className="p-0">
        {showSignOutConfirm ? (
          <div className="px-7 py-4">
            <p className="text-base font-medium text-text-primary">
              Sign out of Not a Bank?
            </p>
            <p className="mt-1 text-label text-text-secondary">
              Your data will be cleared from this device.
            </p>
            <div className="mt-4 flex gap-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOut}
              >
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(): void => setShowSignOutConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={(): void => setShowSignOutConfirm(true)}
            data-testid="sign-out-button"
            className="w-full min-h-[52px] px-7 py-4 text-left text-base font-medium text-error transition-colors hover:bg-bg-raised"
          >
            Sign out
          </button>
        )}
      </Card>
    </div>
  )
}
