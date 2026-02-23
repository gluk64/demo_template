'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  TrendingUp,
  Landmark,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { AccountPill } from './AccountPill'

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/send', label: 'Send', icon: ArrowUpRight },
  { href: '/receive', label: 'Receive', icon: ArrowDownLeft },
  { href: '/activity', label: 'Activity', icon: Clock },
  { href: '/earn', label: 'Earn', icon: TrendingUp },
  { href: '/borrow', label: 'Borrow', icon: Landmark },
]

export const Sidebar = (): React.JSX.Element => {
  const pathname = usePathname()
  const user = useStore((s) => s.user)

  return (
    <aside className="hidden md:flex md:w-[240px] md:flex-col md:fixed md:inset-y-0 border-r border-border bg-bg-surface px-4 py-6">
      {/* Brand */}
      <div className="mb-8 px-3">
        <p className="text-micro font-semibold tracking-[0.1em] text-text-tertiary">
          NOT A BANK
        </p>
        <p className="mt-0.5 text-[11px] text-text-disabled">
          Powered by{' '}
          <a
            href="https://zksync.io"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-tertiary"
          >
            ZKsync
          </a>
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-accent-subtle text-text-primary'
                  : 'text-text-secondary hover:bg-bg-raised hover:text-text-primary',
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  isActive ? 'text-accent' : 'text-text-tertiary',
                )}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-4 border-t border-border">
        <AccountPill
          nickname={user?.nickname ?? null}
          email={user?.email ?? 'vitalik@gmail.com'}
        />
      </div>
    </aside>
  )
}
