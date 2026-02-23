import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/tokens.css'
import './globals.css'

export const metadata: Metadata = {
  title: '[APP_NAME]',
  description: '[one-line description]',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className="font-sans bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
