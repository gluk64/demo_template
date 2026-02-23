'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type AccountPillProps = {
  nickname: string | null
  email: string
}

export const AccountPill = ({ nickname, email }: AccountPillProps): React.JSX.Element => {
  const displayName = nickname ?? email
  const initials = (nickname ?? email).slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col gap-1.5">
      <Link
        href="/settings"
        className={cn(
          'flex items-center gap-2.5',
          'px-3 py-2.5 rounded-lg w-full',
          'bg-bg-raised border border-border',
          'hover:bg-bg-overlay hover:border-border-strong',
          'transition-all duration-200 cursor-pointer',
        )}
      >
        <div className={cn(
          'w-7 h-7 rounded-full flex-shrink-0',
          'flex items-center justify-center',
          'bg-accent-subtle border border-border-strong',
        )}>
          <span className="text-[11px] font-semibold font-mono text-accent">
            {initials}
          </span>
        </div>
        <span className="text-sm font-medium text-text-primary truncate leading-tight min-w-0">
          {displayName}
        </span>
      </Link>

      {!nickname && (
        <Link
          href="/setup/nickname"
          className="text-[12px] text-accent hover:text-accent-hover text-center transition-colors duration-150 py-0.5"
        >
          Claim your username &rarr;
        </Link>
      )}
    </div>
  )
}
