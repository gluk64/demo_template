import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '@/styles/tokens.css'
import './globals.css'

const inter = localFont({
  src: '../fonts/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

const jetbrainsMono = localFont({
  src: '../fonts/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains',
  display: 'swap',
  weight: '100 800',
})

export const metadata: Metadata = {
  title: 'Not a Bank',
  description: 'A privacy-first stablecoin neobank built on Prividium.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-bg-base text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
