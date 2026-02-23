'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { selectNetWorth } from '@/store/selectors'
import { formatUSD, formatAmountDelta } from '@/lib/formatting/currency'
import { formatAddress } from '@/lib/formatting/address'
import { TokenBreakdown } from '@/components/domain/TokenBreakdown'
import type { Transaction } from '@/types'

function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function getTxStatusLabel(tx: Transaction): string {
  if (tx.status === 'optimistic') return 'Sending...'
  if (tx.direction === 'outbound') return 'Sent'
  return 'Received'
}

const emptySubscribe = (): (() => void) => () => {}
const getTrue = (): boolean => true
const getFalse = (): boolean => false

export default function DashboardPage(): React.JSX.Element {
  // Detect client-side mount without setState-in-effect lint violation
  const mounted = useSyncExternalStore(emptySubscribe, getTrue, getFalse)
  const isPrivate = useStore((s) => s.isPrivateMode)
  const togglePrivateMode = useStore((s) => s.togglePrivateMode)
  const netWorth = useStore(selectNetWorth)
  const transactions = useStore((s) => s.transactions)
  const recentTxs = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.initiatedAt - a.initiatedAt)
        .slice(0, 5),
    [transactions],
  )

  return (
    <div className="mx-auto max-w-2xl px-5 pt-8 pb-24">
      {/* Top bar */}
      <div className="mb-12 flex items-center justify-between">
        <p className="text-label font-semibold tracking-[0.1em] text-text-tertiary md:hidden">
          NOT A BANK
        </p>
        <button
          type="button"
          onClick={togglePrivateMode}
          data-testid="private-mode-toggle"
          className="ml-auto min-h-[52px] min-w-[44px] flex items-center justify-center text-text-tertiary transition-colors hover:text-text-secondary"
          aria-label={isPrivate ? 'Show balances' : 'Hide balances'}
        >
          {isPrivate ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Balance section */}
      <div className="mb-10 text-center">
        <p
          data-testid="balance-amount"
          className={cn(
            'font-mono text-display font-semibold tracking-tight text-text-primary transition-all duration-200',
            isPrivate && 'blur-[10px] select-none',
          )}
        >
          {formatUSD(netWorth)}
        </p>
        <p className="mt-1 text-label text-text-tertiary">Total balance</p>
        <TokenBreakdown />
      </div>

      {/* Action buttons */}
      <div className="mb-12 grid grid-cols-2 gap-3">
        <Button variant="secondary" size="md" className="w-full" asChild>
          <Link href="/send" data-testid="send-button">
            Send
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Button>
        <Button variant="secondary" size="md" className="w-full" asChild>
          <Link href="/receive" data-testid="receive-button">
            Receive
            <ArrowDownLeft size={16} aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {/* Activity section */}
      <div>
        <p className="mb-4 text-micro font-semibold tracking-[0.08em] text-text-tertiary">
          ACTIVITY
        </p>
        <div data-testid="activity-feed" className="border-t border-border">
          {recentTxs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-text-secondary">No activity yet</p>
            </div>
          ) : (
            recentTxs.map((tx) => {
              const name =
                tx.direction === 'outbound'
                  ? tx.recipientNickname ??
                    formatAddress(tx.recipientAddress ?? '')
                  : formatAddress(tx.senderAddress ?? '')
              const isOptimistic = tx.status === 'optimistic'
              const isConfirmed = tx.status === 'confirmed'
              const isFailed = tx.status === 'failed'
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-border py-4"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-base font-medium text-text-primary">
                        {name}
                      </p>
                      <p className="mt-0.5 text-label text-text-tertiary" suppressHydrationWarning>
                        {mounted ? formatRelativeTime(tx.initiatedAt) : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'font-mono text-base font-medium text-text-primary',
                        isPrivate && 'blur-[10px] select-none',
                      )}
                    >
                      {formatAmountDelta(tx.amount, tx.direction)}
                      {' '}
                      <span className="text-label text-text-tertiary">{tx.tokenSymbol}</span>
                    </p>
                    <div className="mt-0.5 flex items-center justify-end gap-1">
                      {isOptimistic && (
                        <span className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="text-success text-[13px] flex-shrink-0">✓</span>
                      )}
                      {isFailed && (
                        <span className="text-error text-[13px] flex-shrink-0">✗</span>
                      )}
                      <span className="text-[13px] text-text-tertiary">
                        {getTxStatusLabel(tx)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        <Link
          href="/activity"
          className="mt-4 inline-block text-label text-accent transition-colors hover:text-accent-hover"
        >
          View all &rarr;
        </Link>
      </div>
    </div>
  )
}
