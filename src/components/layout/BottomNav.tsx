'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  { href: '/settings', label: 'Settings', icon: Settings },
]

export const BottomNav = (): React.JSX.Element => {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-[52px] flex-col items-center justify-center gap-1 px-3',
                isActive ? 'text-accent' : 'text-text-tertiary',
              )}
            >
              <item.icon size={22} aria-hidden="true" />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
