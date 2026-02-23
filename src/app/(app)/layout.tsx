'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar />
      <main className="md:ml-[240px] pb-24 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
