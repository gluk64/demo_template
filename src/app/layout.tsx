import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/tokens.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'UISmoke',
  description: 'UI component smoke test application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
