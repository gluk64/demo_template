'use client'

import { useStore } from '@/store'
import { formatUSD } from '@/lib/formatting/currency'
import { cn } from '@/lib/utils'

export function TokenBreakdown(): React.JSX.Element | null {
  const balances = useStore((s) => s.balances)
  const isPrivate = useStore((s) => s.isPrivateMode)

  const tokens = Object.values(balances)

  if (tokens.length <= 1) return null

  return (
    <div className="mt-3 flex items-center justify-center gap-4">
      {tokens.map((token, index) => (
        <div key={token.symbol} className="flex items-center gap-1.5">
          {index > 0 && (
            <span className="mr-2.5 text-[11px] text-text-disabled">&middot;</span>
          )}
          <div className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-bg-overlay">
            <span className="font-mono text-[9px] font-semibold text-text-tertiary">
              {token.symbol.charAt(0)}
            </span>
          </div>
          <span className="text-label font-medium text-text-tertiary">
            {token.symbol}
          </span>
          <span
            className={cn(
              'font-mono text-label text-text-secondary',
              isPrivate && 'blur-[10px] select-none',
            )}
          >
            {formatUSD(token.usdValue)}
          </span>
        </div>
      ))}
    </div>
  )
}
