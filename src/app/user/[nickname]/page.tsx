'use client'

import { useState, useCallback, useSyncExternalStore, useEffect } from 'react'
import { use } from 'react'
import { RefreshCw, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockEngine } from '@/lib/mock/engine'
import { formatAddress } from '@/lib/formatting/address'
import QRCode from 'qrcode'

const emptySubscribe = (): (() => void) => () => {}
const getTrue = (): boolean => true
const getFalse = (): boolean => false

type PageProps = {
  params: Promise<{ nickname: string }>
}

export default function PublicProfilePage({ params }: PageProps): React.JSX.Element {
  const { nickname } = use(params)
  const mounted = useSyncExternalStore(emptySubscribe, getTrue, getFalse)

  const [address, setAddress] = useState(() =>
    mockEngine.generateAddress(`public-${nickname}-initial`),
  )
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(address, {
      width: 180,
      margin: 1,
      // QR code colors — white on transparent, exempt from token lint
      color: { dark: '#F5F5F7', light: '#00000000' },
    }).then(setQrDataUrl).catch(() => {})
  }, [address])

  const handleRegenerate = useCallback((): void => {
    setIsRegenerating(true)
    setTimeout(() => {
      setAddress(mockEngine.generateAddress(`public-${nickname}-${Date.now()}`))
      setIsRegenerating(false)
    }, 300)
  }, [nickname])

  const handleCopy = useCallback((): void => {
    void navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [address])

  if (!mounted) {
    return <div className="min-h-screen bg-bg-base" />
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-[420px]">
        {/* Header — single line */}
        <h1 className="mb-8 text-center text-[24px] font-semibold text-text-primary">
          Send funds to {nickname}
        </h1>

        {/* Address card */}
        <div className="rounded-xl border border-border bg-bg-surface p-6">
          <div className={cn(
            'transition-opacity duration-200',
            isRegenerating ? 'opacity-0' : 'opacity-100',
          )}>
            <p className="text-[11px] text-text-tertiary tracking-[0.08em] uppercase mb-2 text-center">
              YOUR SENDING ADDRESS
            </p>
            <p className="font-mono text-sm text-text-primary text-center whitespace-nowrap">
              {formatAddress(address)}
            </p>

            <p className="text-[13px] text-text-tertiary leading-relaxed mt-3 text-center">
              This address was generated for you when you opened this page. Send funds
              here and they&apos;ll arrive privately in {nickname}&apos;s account via Not a Bank —
              you won&apos;t be able to trace the payment after it arrives.
            </p>
            <p className="text-[13px] text-text-tertiary leading-relaxed mt-2 text-center">
              Save it to reuse for future payments to {nickname}. Or regenerate below
              to get a fresh address — useful if you want your payments to be unlinked
              from each other.
            </p>

            {qrDataUrl && (
              <div className="mx-auto flex justify-center mt-5">
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${address}`}
                  width={180}
                  height={180}
                />
              </div>
            )}
          </div>

          {/* Networks + Assets — 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 mt-5 mx-auto w-fit">
            <div>
              <p className="text-[10px] text-text-tertiary tracking-[0.08em] uppercase mb-2">
                SUPPORTED NETWORKS
              </p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-full bg-bg-raised border border-border text-micro font-medium text-text-secondary">
                  Ethereum
                </span>
                <span className="px-2.5 py-1 rounded-full bg-bg-raised border border-border text-micro font-medium text-text-secondary">
                  ZKsync
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-text-tertiary tracking-[0.08em] uppercase mb-2">
                SUPPORTED ASSETS
              </p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-full bg-bg-raised border border-border text-micro font-medium text-text-secondary">
                  USDC
                </span>
                <span className="px-2.5 py-1 rounded-full bg-bg-raised border border-border text-micro font-medium text-text-secondary">
                  USDT
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 w-full">
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'flex items-center justify-center gap-2',
                'h-[44px] w-full rounded-xl',
                'bg-bg-raised border border-border',
                'text-[15px] font-medium text-text-primary',
                'hover:border-border-strong hover:bg-bg-overlay',
                'transition-all duration-150',
              )}
            >
              {copied ? <><Check size={16} aria-hidden="true" /> Copied</> : <><Copy size={16} aria-hidden="true" /> Copy address</>}
            </button>
            <button
              type="button"
              onClick={handleRegenerate}
              className={cn(
                'flex items-center justify-center gap-2',
                'h-[44px] w-full rounded-xl',
                'bg-bg-raised border border-border',
                'text-[15px] font-medium text-text-primary',
                'hover:border-border-strong hover:bg-bg-overlay',
                'transition-all duration-150',
              )}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Footer — single compressed line */}
        <p className="mt-8 text-center text-micro text-text-tertiary">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-secondary"
          >
            Not a Bank
          </a>
          <span className="text-text-disabled"> &middot; </span>
          Powered by{' '}
          <a
            href="https://zksync.io"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-secondary"
          >
            ZKsync
          </a>
        </p>
      </div>
    </div>
  )
}
