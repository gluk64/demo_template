'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { formatAmountDelta } from '@/lib/formatting/currency'
import { formatAddress } from '@/lib/formatting/address'
import type { Transaction } from '@/types'

type FilterType = 'all' | 'sent' | 'received'

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getDateLabel(timestamp: number): string {
  const now = new Date()
  const date = new Date(timestamp)

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()
  const yesterdayStart = todayStart - 86_400_000

  if (timestamp >= todayStart) return 'TODAY'
  if (timestamp >= yesterdayStart) return 'YESTERDAY'
  return date
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    .toUpperCase()
}

function groupTransactionsByDate(
  transactions: Transaction[],
): Map<string, Transaction[]> {
  const grouped = new Map<string, Transaction[]>()
  const sorted = [...transactions].sort(
    (a, b) => b.initiatedAt - a.initiatedAt,
  )

  for (const tx of sorted) {
    const label = getDateLabel(tx.initiatedAt)
    const existing = grouped.get(label) ?? []
    existing.push(tx)
    grouped.set(label, existing)
  }

  return grouped
}

function getTxDisplayName(tx: Transaction): string {
  if (tx.direction === 'outbound') {
    return tx.recipientNickname ?? formatAddress(tx.recipientAddress ?? '')
  }
  return formatAddress(tx.senderAddress ?? '')
}

function getTxStatusLabel(tx: Transaction): string {
  if (tx.status === 'optimistic') return 'Sending...'
  if (tx.direction === 'outbound') return 'Sent'
  return 'Received'
}

export default function ActivityPage(): React.JSX.Element {
  const [filter, setFilter] = useState<FilterType>('all')
  const transactions = useStore((s) => s.transactions)
  const isPrivate = useStore((s) => s.isPrivateMode)

  const filtered = transactions.filter((tx) => {
    if (filter === 'sent') return tx.direction === 'outbound'
    if (filter === 'received') return tx.direction === 'inbound'
    return true
  })

  const grouped = groupTransactionsByDate(filtered)
  const hasActivity = filtered.length > 0

  return (
    <div className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="mb-6 text-h2 font-semibold text-text-primary">
        Activity
      </h1>

      {/* Filter row */}
      <div className="mb-6 flex gap-4">
        {(['all', 'sent', 'received'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={(): void => setFilter(f)}
            className={cn(
              'min-h-[52px] text-label capitalize transition-colors',
              filter === f
                ? 'text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div data-testid="activity-feed">
      {hasActivity ? (
        Array.from(grouped.entries()).map(([dateLabel, txs]) => (
          <div key={dateLabel}>
            <p className="mb-2 mt-6 text-micro font-semibold tracking-[0.08em] text-text-tertiary">
              {dateLabel}
            </p>
            {txs.map((tx) => {
              const isOptimistic = tx.status === 'optimistic'
              const isConfirmed = tx.status === 'confirmed'
              const isFailed = tx.status === 'failed'
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-border py-5"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-base font-medium text-text-primary">
                        {getTxDisplayName(tx)}
                      </p>
                      <p className="mt-0.5 text-label text-text-tertiary">
                        {formatTime(tx.initiatedAt)}
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
            })}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-text-primary">
            No activity yet
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Send or receive to get started
          </p>
          <Link
            href="/send"
            className="mt-4 text-sm text-accent transition-colors hover:text-accent-hover"
          >
            Make your first send &rarr;
          </Link>
        </div>
      )}
      </div>
    </div>
  )
}
