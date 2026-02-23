'use client'

import { useState, useCallback, useEffect } from 'react'
import { QrCode, Copy, Check, Pencil } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatAddress } from '@/lib/formatting/address'
import { useStore } from '@/store'
import type { DepositAddress } from '@/types'
import QRCode from 'qrcode'

type AddressCardProps = {
  address: DepositAddress
}

export function AddressCard({ address }: AddressCardProps): React.JSX.Element {
  const expandedAddressId = useStore((s) => s.expandedAddressId)
  const toggleExpandAddress = useStore((s) => s.toggleExpandAddress)
  const updateAddressLabel = useStore((s) => s.updateAddressLabel)

  const isExpanded = expandedAddressId === address.id
  const [copied, setCopied] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editLabel, setEditLabel] = useState(address.label)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isExpanded && !qrDataUrl) {
      QRCode.toDataURL(address.address, {
        width: 160,
        margin: 1,
        // QR code colors — white on transparent, exempt from token lint
        color: { dark: '#F5F5F7', light: '#00000000' },
      }).then(setQrDataUrl).catch(() => {})
    }
  }, [isExpanded, qrDataUrl, address.address])

  const handleCopy = useCallback((): void => {
    void navigator.clipboard.writeText(address.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [address.address])

  const handleToggleExpand = useCallback((): void => {
    toggleExpandAddress(address.id)
  }, [address.id, toggleExpandAddress])

  const handleStartEdit = useCallback((): void => {
    setEditLabel(address.label)
    setIsEditingLabel(true)
  }, [address.label])

  const handleSaveLabel = useCallback((): void => {
    const trimmed = editLabel.trim()
    if (trimmed.length > 0) {
      updateAddressLabel(address.id, trimmed)
    }
    setIsEditingLabel(false)
  }, [editLabel, address.id, updateAddressLabel])

  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        handleSaveLabel()
      } else if (e.key === 'Escape') {
        setIsEditingLabel(false)
        setEditLabel(address.label)
      }
    },
    [handleSaveLabel, address.label],
  )

  return (
    <div className="rounded-xl border border-border bg-bg-surface px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            {isEditingLabel ? (
              <input
                type="text"
                value={editLabel}
                onChange={(e): void => setEditLabel(e.target.value)}
                onBlur={handleSaveLabel}
                onKeyDown={handleLabelKeyDown}
                autoFocus
                autoComplete="off"
                data-1p-ignore="true"
                className="w-32 bg-transparent text-sm font-medium text-text-primary focus:outline-none"
              />
            ) : (
              <>
                <span className="text-sm font-medium text-text-primary">
                  {address.label}
                </span>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="flex items-center text-text-tertiary transition-colors hover:text-text-primary"
                  aria-label="Edit label"
                >
                  <Pencil size={13} />
                </button>
              </>
            )}
          </div>
          <span className="font-mono text-label text-text-tertiary">
            {formatAddress(address.address)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleExpand}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
            aria-label="Show QR code"
          >
            <QrCode size={18} />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
            aria-label="Copy address"
            data-testid="copy-address-btn"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-border pt-4">
              {qrDataUrl && (
                <div className="mx-auto flex justify-center">
                  <img
                    src={qrDataUrl}
                    alt={`QR code for ${address.address}`}
                    width={160}
                    height={160}
                  />
                </div>
              )}
              <p
                className="mt-3 break-all text-center font-mono text-label text-text-tertiary"
                data-testid="deposit-address"
              >
                {address.address}
              </p>
              <Button
                variant="secondary"
                size="md"
                className="mt-4 w-full min-h-[44px]"
                onClick={handleCopy}
                aria-label="Copy full address"
              >
                {copied ? 'Copied' : 'Copy full address'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
