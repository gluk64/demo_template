'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/settings', label: 'Settings', icon: Settings },
]

type SidebarProps = {
  appName?: string
  items?: NavItem[]
}

export const Sidebar = ({ appName = '[APP_NAME]', items }: SidebarProps): React.JSX.Element => {
  const pathname = usePathname()
  const displayItems = items ?? navItems

  return (
    <aside className="hidden md:flex md:w-[240px] md:flex-col md:fixed md:inset-y-0 border-r border-border bg-bg-surface px-4 py-6">
      {/* Brand */}
      <div className="mb-8 px-3">
        <p className="text-micro font-semibold tracking-[0.1em] text-text-tertiary uppercase">
          {appName}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {displayItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-sm px-3 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-accent-subtle text-text-primary'
                  : 'text-text-secondary hover:bg-bg-raised hover:text-text-primary',
              )}
            >
              <item.icon
                size={20}
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
    </aside>
  )
}
