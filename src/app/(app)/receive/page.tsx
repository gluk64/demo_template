'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Copy, Check, ExternalLink, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { AddressCard } from '@/components/domain/AddressCard'

const emptySubscribe = (): (() => void) => () => {}
const getTrue = (): boolean => true
const getFalse = (): boolean => false

export default function ReceivePage(): React.JSX.Element {
  const router = useRouter()
  const mounted = useSyncExternalStore(emptySubscribe, getTrue, getFalse)
  const user = useStore((s) => s.user)
  const depositAddresses = useStore((s) => s.depositAddresses)
  const isGenerating = useStore((s) => s.isGenerating)
  const generateDepositAddress = useStore((s) => s.generateDepositAddress)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)

  const nickname = user?.nickname

  let origin = 'https://nb.zksync.io'
  if (mounted && typeof window !== 'undefined') {
    origin = window.location.origin
  }
  const actualHref = nickname ? `${origin}/user/${nickname}` : null
  const displayText = nickname ? `${nickname}.nb.zksync.io` : null

  const handleCopyLink = useCallback((): void => {
    if (!actualHref) return
    void navigator.clipboard.writeText(actualHref)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }, [actualHref])

  const handleGenerate = useCallback(async (): Promise<void> => {
    const label = newLabel.trim() || `Address ${depositAddresses.length + 1}`
    await generateDepositAddress(label)
    setNewLabel('')
    setShowAddForm(false)
  }, [newLabel, depositAddresses.length, generateDepositAddress])

  const handleCancel = useCallback((): void => {
    setShowAddForm(false)
    setNewLabel('')
  }, [])

  const handleAddFormKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && !isGenerating) {
        e.preventDefault()
        void handleGenerate()
      }
    },
    [isGenerating, handleGenerate],
  )

  return (
    <div className="mx-auto max-w-lg px-5 pt-8">
      <button
        type="button"
        onClick={(): void => router.push('/dashboard')}
        className="mb-6 flex items-center gap-1.5 text-[15px] text-text-secondary transition-colors duration-150 hover:text-text-primary"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <h1 className="mb-8 text-[24px] font-semibold text-text-primary">
        Receive
      </h1>

      {/* Payment link section */}
      <div className="border-t border-border">
        <div className="mt-6">
          <p className="mb-1 text-micro font-semibold tracking-widest uppercase text-text-secondary">
            YOUR STEALTH PAYMENT LINK
          </p>
          <p className="mb-4 text-label text-text-tertiary">
            Share your username link. Recipients get a fresh address each time.
          </p>

          {actualHref && displayText ? (
            <>
              <div className="flex items-center gap-3 py-2">
                <span className="flex-1 truncate font-mono text-[14px] text-accent">
                  {displayText}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center text-text-tertiary transition-colors duration-150 hover:text-text-primary"
                  aria-label="Copy payment link"
                >
                  {copiedLink ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
              <a
                href={actualHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-center gap-2 mt-3',
                  'w-full h-[44px] rounded-xl',
                  'border border-border bg-bg-raised',
                  'text-[14px] font-medium text-text-secondary',
                  'hover:border-border-strong hover:text-text-primary',
                  'transition-all duration-150'
                )}
              >
                <ExternalLink size={15} />
                Preview my payment page
              </a>
            </>
          ) : (
            <>
              <p className="text-sm italic text-text-tertiary">
                Claim a username to get your payment link
              </p>
              <Link
                href="/setup/nickname"
                className="mt-2 inline-block text-sm text-accent transition-colors hover:text-accent-hover"
              >
                Claim username &rarr;
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stealth addresses section */}
      <div className="mt-8 border-t border-border">
        <div className="mt-6">
          <p className="mb-1 text-micro font-semibold tracking-widest uppercase text-text-secondary">
            YOUR STEALTH ADDRESSES
          </p>
          <p className="mb-4 text-label text-text-tertiary">
            Generate purpose-specific addresses for different contexts —
            each works on Ethereum and ZKsync.
          </p>

          <div className="flex flex-col gap-3">
            {depositAddresses.map((addr) => (
              <AddressCard key={addr.id} address={addr} />
            ))}
          </div>

          {!showAddForm && (
            <button
              type="button"
              onClick={(): void => setShowAddForm(true)}
              className="mt-4 flex min-h-[44px] items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-hover"
              data-testid="generate-address-btn"
            >
              <Plus size={16} />
              Add address
            </button>
          )}

          {showAddForm && (
            <div className="mt-2 rounded-xl border border-border bg-bg-surface px-4 py-4">
              <label className="text-label text-text-tertiary">
                Label
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e): void => setNewLabel(e.target.value)}
                onKeyDown={handleAddFormKeyDown}
                placeholder="e.g. Savings, Work, Personal"
                autoFocus
                autoComplete="off"
                data-1p-ignore="true"
                data-lpignore="true"
                className="mt-1 min-h-[52px] w-full rounded-md border border-border bg-bg-overlay px-4 text-base text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-subtle"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="min-h-[44px] flex-1"
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                >
                  Generate address
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-h-[44px] flex-1"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
