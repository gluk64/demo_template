'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, BookUser, Check, ChevronLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { isNewSenderRecipientPairing } from '@/store/selectors'
import { formatUSD } from '@/lib/formatting/currency'
import { formatAddress } from '@/lib/formatting/address'
import { resolveRecipient } from '@/lib/mock/resolution'
import { useSend } from '@/hooks/useSend'
import { SendSummaryBar, type SummaryLine } from '@/components/domain/SendSummaryBar'
import type { ChainOption, TokenOption } from '@/store/slices/ui'

const CHAIN_LABELS: Record<ChainOption, string> = {
  zksync: 'ZKsync',
  ethereum: 'Ethereum',
}

const CHAIN_PLACEHOLDERS: Record<ChainOption, string> = {
  zksync: 'username, 0x address, or ENS name',
  ethereum: '0x address or ENS name',
}

const CHAINS: ChainOption[] = ['zksync', 'ethereum']

const STEP_TITLES: Record<string, string> = {
  recipient: 'To',
  from: 'From',
  amount: 'Amount',
  review: 'Confirm',
}

function getArrivalHint(chain: ChainOption): string {
  return chain === 'zksync' ? 'Arrives in seconds' : 'Arrives in minutes'
}

export default function SendPage(): React.JSX.Element {
  const router = useRouter()
  const balances = useStore((s) => s.balances)
  const contacts = useStore((s) => s.contacts)
  const transactions = useStore((s) => s.transactions)
  const depositAddresses = useStore((s) => s.depositAddresses)
  const generateDepositAddress = useStore((s) => s.generateDepositAddress)
  const sendWizard = useStore((s) => s.sendWizard)
  const updateSendWizard = useStore((s) => s.updateSendWizard)
  const resetSendWizard = useStore((s) => s.resetSendWizard)
  const { executeSend } = useSend()

  const [amountInput, setAmountInput] = useState(
    sendWizard.amount ? String(sendWizard.amount) : '',
  )
  const [recipientInput, setRecipientInput] = useState(
    sendWizard.recipientInput,
  )
  const [isResolving, setIsResolving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [contactListOpen, setContactListOpen] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddressLabel, setNewAddressLabel] = useState('')
  const [isGeneratingAddress, setIsGeneratingAddress] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contactDropdownRef = useRef<HTMLDivElement>(null)

  // Close contact dropdown on click outside or Escape
  useEffect(() => {
    if (!contactListOpen) return

    const handleClickOutside = (e: MouseEvent): void => {
      if (
        contactDropdownRef.current &&
        !contactDropdownRef.current.contains(e.target as Node)
      ) {
        setContactListOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setContactListOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [contactListOpen])

  const step = sendWizard.step
  const parsedAmount = parseFloat(amountInput) || 0
  const selectedToken = sendWizard.selectedToken
  const selectedChain = sendWizard.selectedChain
  const selectedTokenBalance = balances[selectedToken]?.amount ?? 0

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value.replace(/[^0-9.]/g, '')
      if (value.split('.').length > 2) return
      const parts = value.split('.')
      if (parts[1] && parts[1].length > 2) return
      setAmountInput(value)
    },
    [],
  )

  const handleMaxClick = useCallback((): void => {
    const max = selectedTokenBalance
    setAmountInput(max > 0 ? max.toFixed(2) : '0.00')
  }, [selectedTokenBalance])

  const handleRecipientChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value
      setRecipientInput(value)
      updateSendWizard({
        recipientInput: value,
        resolvedAddress: null,
        resolvedDisplayName: null,
        isNewRecipient: false,
      })

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (value.trim().length < 3) {
        setIsResolving(false)
        return
      }

      setIsResolving(true)
      debounceRef.current = setTimeout(async () => {
        const result = await resolveRecipient(value)
        if (result) {
          const isNew = !contacts.some(
            (c) => c.address.toLowerCase() === result.address.toLowerCase(),
          )
          updateSendWizard({
            resolvedAddress: result.address,
            resolvedDisplayName: result.displayName,
            isNewRecipient: isNew,
          })
        }
        setIsResolving(false)
      }, 400)
    },
    [contacts, updateSendWizard],
  )

  const handleSelectContact = useCallback(
    (contact: (typeof contacts)[number]): void => {
      setRecipientInput(contact.displayName)
      setContactListOpen(false)
      updateSendWizard({
        recipientInput: contact.displayName,
        resolvedAddress: contact.address,
        resolvedDisplayName: contact.displayName,
        isNewRecipient: false,
        step: 'amount',
      })
    },
    [updateSendWizard],
  )

  const handleContinueToRecipient = useCallback((): void => {
    updateSendWizard({ step: 'recipient' })
  }, [updateSendWizard])

  const handleContinueToAmount = useCallback((): void => {
    updateSendWizard({ step: 'amount' })
  }, [updateSendWizard])

  const handleContinueToReview = useCallback((): void => {
    updateSendWizard({ amount: parsedAmount, step: 'review' })
  }, [parsedAmount, updateSendWizard])

  const handleSend = useCallback(async (): Promise<void> => {
    setIsSending(true)
    await executeSend()
  }, [executeSend])

  const handleCancel = useCallback((): void => {
    resetSendWizard()
    setRecipientInput('')
    setAmountInput('')
  }, [resetSendWizard])

  const handleStepBack = useCallback((): void => {
    if (step === 'recipient') {
      updateSendWizard({ step: 'from' })
    } else if (step === 'amount') {
      updateSendWizard({ step: 'recipient' })
    } else if (step === 'review') {
      updateSendWizard({ step: 'amount' })
    }
  }, [step, updateSendWizard])

  const handleSelectChain = useCallback(
    (chain: ChainOption): void => {
      updateSendWizard({ selectedChain: chain })
    },
    [updateSendWizard],
  )

  const handleSelectToken = useCallback(
    (token: TokenOption): void => {
      updateSendWizard({ selectedToken: token })
    },
    [updateSendWizard],
  )

  const handleRecipientKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && sendWizard.resolvedAddress) {
        e.preventDefault()
        handleContinueToAmount()
      }
    },
    [sendWizard.resolvedAddress, handleContinueToAmount],
  )

  const handleAmountKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && parsedAmount > 0 && parsedAmount <= selectedTokenBalance) {
        e.preventDefault()
        handleContinueToReview()
      }
    },
    [parsedAmount, selectedTokenBalance, handleContinueToReview],
  )

  const handleGenerateAddress = useCallback(async (): Promise<void> => {
    setIsGeneratingAddress(true)
    const label = newAddressLabel.trim() || `Address ${depositAddresses.length + 1}`
    await generateDepositAddress(label)
    // After generation, the new address is the last in the array
    const updatedAddresses = useStore.getState().depositAddresses
    const newAddr = updatedAddresses[updatedAddresses.length - 1]
    if (newAddr) {
      updateSendWizard({ selectedFromAddress: newAddr.id })
    }
    setIsGeneratingAddress(false)
    setIsAddingAddress(false)
    setNewAddressLabel('')
  }, [newAddressLabel, depositAddresses.length, generateDepositAddress, updateSendWizard])

  const handleCancelAddAddress = useCallback((): void => {
    setIsAddingAddress(false)
    setNewAddressLabel('')
  }, [])

  const handleAddAddressKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && !isGeneratingAddress) {
        e.preventDefault()
        void handleGenerateAddress()
      }
      if (e.key === 'Escape') {
        handleCancelAddAddress()
      }
    },
    [isGeneratingAddress, handleGenerateAddress, handleCancelAddAddress],
  )

  const fromLabel = sendWizard.selectedFromAddress === 'private'
    ? 'Hidden'
    : depositAddresses.find((a) => a.id === sendWizard.selectedFromAddress)?.label ?? 'Unknown'

  // Progressive summary bar lines
  const summaryLines: SummaryLine[] = []
  if (step === 'recipient' || step === 'amount') {
    summaryLines.push({
      label: 'From',
      value: fromLabel,
      step: 'from',
    })
  }
  if (step === 'amount') {
    if (sendWizard.resolvedDisplayName) {
      summaryLines.push({
        label: 'To',
        value: `${sendWizard.resolvedDisplayName} · ${CHAIN_LABELS[selectedChain]}`,
        step: 'recipient',
      })
    }
  }

  // New pairing warning detection
  const resolvedRecipient = sendWizard.resolvedAddress ?? sendWizard.resolvedDisplayName ?? ''
  const showPairingWarning = isNewSenderRecipientPairing(
    transactions,
    resolvedRecipient,
    sendWizard.selectedFromAddress,
  )

  // Track which pairing the user acknowledged — auto-resets when pairing changes
  const pairingKey = `${resolvedRecipient}:${sendWizard.selectedFromAddress}`
  const [acknowledgedPairingKey, setAcknowledgedPairingKey] = useState('')
  const pairingAcknowledged = acknowledgedPairingKey === pairingKey

  return (
    <div className="mx-auto max-w-lg px-5 pt-8">
      {/* Page-level back button */}
      <button
        type="button"
        onClick={(): void => router.push('/dashboard')}
        className="mb-6 flex items-center gap-1.5 text-[15px] text-text-secondary transition-colors duration-150 hover:text-text-primary"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      {/* Page heading */}
      <h1 className="mb-8 text-[24px] font-semibold text-text-primary">
        Send
      </h1>

      {/* Step card */}
      <div
        className={cn(
          'w-full',
          'bg-bg-surface border border-border rounded-xl',
          'p-6',
          'flex flex-col',
          'min-h-[420px]',
        )}
      >
        {/* Back arrow — top of card, no title */}
        <div className="mb-4 flex items-center">
          {step !== 'from' && (
            <button
              type="button"
              onClick={handleStepBack}
              className="flex min-h-[44px] min-w-[44px] items-center text-text-tertiary transition-colors hover:text-text-primary"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Summary + divider — steps 2 and 3 only */}
        {(step === 'recipient' || step === 'amount') && (
          <>
            <SendSummaryBar
              lines={summaryLines}
              onEdit={(targetStep): void => updateSendWizard({ step: targetStep })}
              onCancel={handleCancel}
            />
            <div className="border-t border-border mt-4 mb-5" />
          </>
        )}

        {/* Step title */}
        <h2 className="text-[18px] font-semibold text-text-primary mb-6">
          {STEP_TITLES[step]}
        </h2>

        {/* Card body */}
        <div className="flex-1">

          {/* Step 1: From */}
          {step === 'from' && (
            <div className="flex flex-col gap-3">
              {/* Hide my address card */}
              <button
                type="button"
                onClick={(): void => updateSendWizard({ selectedFromAddress: 'private' })}
                className={cn(
                  'rounded-xl px-4 py-3 text-left cursor-pointer transition-all duration-150',
                  sendWizard.selectedFromAddress === 'private'
                    ? 'bg-bg-surface border-2 border-accent'
                    : 'bg-bg-raised border border-border',
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col flex-1">
                    <span className="text-base font-semibold text-text-primary">
                      Hide my address
                    </span>
                    {sendWizard.selectedFromAddress === 'private' && (
                      <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                        Funds route through Not a Bank&apos;s shared pool.
                        The sending address is not linked to your account.
                      </p>
                    )}
                  </div>
                  <div className="mt-0.5 flex-shrink-0 ml-3">
                    {sendWizard.selectedFromAddress === 'private' ? (
                      <Check size={18} className="text-accent" />
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border-2 border-border" />
                    )}
                  </div>
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-label text-text-tertiary">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Address cards */}
              {depositAddresses.map((addr) => {
                const isSelected = sendWizard.selectedFromAddress === addr.id
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={(): void => updateSendWizard({ selectedFromAddress: addr.id })}
                    className={cn(
                      'rounded-xl px-4 py-3 text-left cursor-pointer transition-all duration-150',
                      isSelected
                        ? 'bg-bg-surface border-2 border-accent'
                        : 'bg-bg-raised border border-border',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'text-[15px] font-medium',
                        isSelected ? 'text-text-primary' : 'text-text-secondary',
                      )}>
                        {addr.label} — {formatAddress(addr.address, 4)}
                      </span>
                      <div className="flex-shrink-0 ml-3">
                        {isSelected ? (
                          <Check size={18} className="text-accent" />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-border" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}

              {/* Add sending address */}
              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={(): void => setIsAddingAddress(true)}
                  className={cn(
                    'flex items-center gap-1.5 mt-4',
                    'text-[13px] text-text-tertiary',
                    'hover:text-text-primary transition-colors duration-150',
                  )}
                >
                  <Plus size={13} />
                  Add sending address
                </button>
              )}

              {isAddingAddress && (
                <div className={cn(
                  'mt-4 p-4 rounded-xl',
                  'bg-bg-raised border border-border',
                )}>
                  <span className="text-[12px] text-text-tertiary mb-1 block">Label</span>
                  <input
                    autoFocus
                    value={newAddressLabel}
                    onChange={(e): void => setNewAddressLabel(e.target.value)}
                    onKeyDown={handleAddAddressKeyDown}
                    placeholder="e.g. Savings, Work, Personal"
                    autoComplete="off"
                    data-1p-ignore="true"
                    data-lpignore="true"
                    className={cn(
                      'w-full h-[44px] px-3 rounded-lg',
                      'bg-bg-surface border border-border',
                      'text-[14px] text-text-primary placeholder:text-text-disabled',
                      'focus:border-accent focus:outline-none transition-colors duration-150',
                    )}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={(): void => { void handleGenerateAddress() }}
                      disabled={isGeneratingAddress}
                      className="flex-1 h-[40px] rounded-lg bg-accent text-white text-[14px] font-medium disabled:opacity-50 hover:bg-accent-hover transition-colors duration-150"
                    >
                      {isGeneratingAddress ? 'Generating...' : 'Generate'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAddAddress}
                      className="flex-1 h-[40px] rounded-lg border border-border text-[14px] text-text-secondary hover:border-border-strong hover:text-text-primary transition-all duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Recipient */}
          {step === 'recipient' && (
            <>
              <div className="relative" ref={contactDropdownRef}>
                <input
                  type="text"
                  placeholder={CHAIN_PLACEHOLDERS[selectedChain]}
                  value={recipientInput}
                  onChange={handleRecipientChange}
                  onKeyDown={handleRecipientKeyDown}
                  data-testid="recipient-input"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-form-type="other"
                  className={cn(
                    'w-full h-[52px] bg-bg-raised border border-border rounded-lg',
                    'px-4 pr-11',
                    'text-[15px] text-text-primary placeholder:text-text-disabled',
                    'focus:border-accent focus:outline-none transition-colors duration-150',
                  )}
                  aria-label="Recipient address"
                />
                <button
                  type="button"
                  onClick={(): void => setContactListOpen((prev) => !prev)}
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2',
                    'text-text-tertiary hover:text-text-primary transition-colors duration-150',
                    contactListOpen && 'text-accent hover:text-accent',
                  )}
                  aria-label="Open address book"
                  data-testid="contact-picker-button"
                >
                  <BookUser size={18} />
                </button>

                {/* Contact dropdown */}
                {contactListOpen && (
                  <div
                    className={cn(
                      'absolute top-full left-0 right-0 mt-1 z-10',
                      'bg-bg-surface border border-border rounded-xl overflow-hidden',
                      'max-h-[220px] overflow-y-auto',
                    )}
                    data-testid="contact-dropdown"
                  >
                    {contacts.length === 0 ? (
                      <div className="px-4 py-4 text-center">
                        <span className="text-sm text-text-tertiary">
                          No saved contacts yet
                        </span>
                      </div>
                    ) : (
                      contacts.map((contact, index) => (
                        <button
                          key={contact.id}
                          type="button"
                          onClick={(): void => handleSelectContact(contact)}
                          className={cn(
                            'flex w-full items-center justify-between px-4 py-3',
                            'hover:bg-bg-raised cursor-pointer transition-colors duration-150',
                            index < contacts.length - 1 && 'border-b border-border',
                          )}
                        >
                          <span className="text-[15px] font-medium text-text-primary">
                            {contact.displayName}
                          </span>
                          {contact.verificationStatus === 'verified' && (
                            <span className="flex items-center gap-1 text-label text-success">
                              ✓ Verified
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {isResolving && (
                <p className="mt-2 text-label text-text-tertiary">Resolving...</p>
              )}
              {!isResolving && sendWizard.resolvedDisplayName && (
                <p className="mt-2 text-label text-success">
                  {sendWizard.resolvedDisplayName}
                </p>
              )}

              {/* Chain selector */}
              <div className="mt-6">
                <p className="mb-2 text-[11px] font-medium tracking-wide uppercase text-text-tertiary">
                  NETWORK
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {CHAINS.map((chain) => (
                      <button
                        key={chain}
                        type="button"
                        onClick={(): void => handleSelectChain(chain)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                          selectedChain === chain
                            ? 'border-accent bg-accent-subtle text-accent'
                            : 'border-border bg-bg-raised text-text-secondary hover:border-border-strong',
                        )}
                      >
                        {CHAIN_LABELS[chain]}
                      </button>
                    ))}
                  </div>
                  <span className="text-[12px] text-text-disabled italic">
                    {getArrivalHint(selectedChain)}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Amount */}
          {step === 'amount' && (
            <>
              <div className="py-4 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-[48px] font-semibold leading-none text-text-tertiary">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amountInput}
                    onChange={handleAmountChange}
                    onKeyDown={handleAmountKeyDown}
                    placeholder="0.00"
                    data-testid="amount-input"
                    className="w-full max-w-[280px] bg-transparent text-center font-mono text-[48px] font-semibold leading-none text-text-primary placeholder:text-text-disabled focus:outline-none"
                    aria-label="Amount to send"
                    autoFocus
                  />
                </div>
              </div>

              {/* Available / Max row */}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-label text-text-tertiary">Available</span>
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="text-label text-accent transition-colors hover:text-accent-hover"
                >
                  Max {formatUSD(selectedTokenBalance)}
                </button>
              </div>

              {parsedAmount > selectedTokenBalance && parsedAmount > 0 && (
                <p className="mt-2 text-label text-error">
                  {`You'd need ${formatUSD(parsedAmount - selectedTokenBalance)} more to send this amount. Your balance is ${formatUSD(selectedTokenBalance)}.`}
                </p>
              )}

              {/* Token selector */}
              <div className="mt-5 flex items-center gap-2">
                <span className="mr-auto text-[11px] font-medium tracking-wide text-text-tertiary">
                  SEND AS
                </span>
                {(['USDC', 'USDT'] as const).map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={(): void => handleSelectToken(token)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                      selectedToken === token
                        ? 'border-accent bg-accent-subtle text-accent'
                        : 'border-border bg-bg-raised text-text-secondary hover:border-border-strong',
                    )}
                  >
                    {token}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <>
              <div className="rounded-lg border border-border bg-bg-raised p-5">
                {/* SENDING row */}
                <button
                  type="button"
                  onClick={(): void => updateSendWizard({ step: 'amount' })}
                  className={cn(
                    'w-full text-left',
                    'hover:opacity-70 transition-opacity duration-150',
                    'cursor-pointer',
                  )}
                >
                  <span className="text-micro font-semibold tracking-[0.08em] text-text-tertiary block">
                    SENDING
                  </span>
                  <span className="mt-1 font-mono text-h1 font-semibold text-text-primary block">
                    {formatUSD(sendWizard.amount ?? 0)} {selectedToken}
                  </span>
                </button>

                {/* FROM row */}
                <button
                  type="button"
                  onClick={(): void => updateSendWizard({ step: 'from' })}
                  className={cn(
                    'w-full text-left mt-4',
                    'hover:opacity-70 transition-opacity duration-150',
                    'cursor-pointer',
                  )}
                >
                  <span className="text-micro font-semibold tracking-[0.08em] text-text-tertiary block">
                    FROM
                  </span>
                  <span className="mt-1 text-base font-medium text-text-primary block">
                    {fromLabel}
                  </span>
                </button>

                {/* VIA row */}
                <button
                  type="button"
                  onClick={(): void => updateSendWizard({ step: 'recipient' })}
                  className={cn(
                    'w-full text-left mt-4',
                    'hover:opacity-70 transition-opacity duration-150',
                    'cursor-pointer',
                  )}
                >
                  <span className="text-micro font-semibold tracking-[0.08em] text-text-tertiary block">
                    VIA
                  </span>
                  <span className="mt-1 text-base font-medium text-text-primary block">
                    {CHAIN_LABELS[selectedChain]}
                  </span>
                </button>

                {/* TO row */}
                <button
                  type="button"
                  onClick={(): void => updateSendWizard({ step: 'recipient' })}
                  className={cn(
                    'w-full text-left mt-4',
                    'hover:opacity-70 transition-opacity duration-150',
                    'cursor-pointer',
                  )}
                >
                  <span className="text-micro font-semibold tracking-[0.08em] text-text-tertiary block">
                    TO
                  </span>
                  <span className="mt-1 text-lg font-medium text-text-primary block">
                    {sendWizard.resolvedDisplayName &&
                    sendWizard.resolvedDisplayName.length > 24
                      ? formatAddress(sendWizard.resolvedDisplayName)
                      : sendWizard.resolvedDisplayName}
                  </span>
                  {sendWizard.resolvedAddress &&
                    sendWizard.resolvedAddress.startsWith('0x') && (
                      <span className="mt-1 font-mono text-label text-text-tertiary block">
                        {formatAddress(sendWizard.resolvedAddress)}
                      </span>
                    )}
                </button>
              </div>

              {/* Arrival time */}
              <p className="mt-4 mb-2 text-center text-label text-text-tertiary italic">
                {getArrivalHint(selectedChain)}
              </p>

              {/* New sender-recipient pairing warning */}
              {showPairingWarning && (
                <div className="mt-4 rounded-xl border border-amber-800/40 bg-bg-raised px-4 py-3.5 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-[13px] leading-relaxed text-text-secondary">
                        {"You haven't sent to this address from this sender before. The recipient may be able to link this address to you."}
                      </p>
                      <button
                        type="button"
                        onClick={(): void => setAcknowledgedPairingKey((prev) => prev === pairingKey ? '' : pairingKey)}
                        className="flex items-center gap-2 mt-1 cursor-pointer"
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors duration-150',
                            pairingAcknowledged
                              ? 'bg-accent border-accent'
                              : 'bg-bg-surface border-border',
                          )}
                        >
                          {pairingAcknowledged && (
                            <Check size={11} className="text-white" />
                          )}
                        </div>
                        <span className="text-[13px] text-text-secondary">
                          I understand, proceed anyway
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {sendWizard.isNewRecipient && (
                <div className="mt-4 rounded-lg border border-warning/25 bg-bg-surface p-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 text-warning"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        New recipient
                      </p>
                      <p className="mt-0.5 text-label text-text-secondary">
                        {"You haven't sent to this address before."}
                      </p>
                    </div>
                  </div>
                  <label className="mt-4 flex min-h-[52px] cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={sendWizard.hasAcknowledged}
                      onChange={(e): void =>
                        updateSendWizard({ hasAcknowledged: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-border-strong accent-accent"
                    />
                    <span className="text-sm text-text-primary">
                      {"I've verified this address"}
                    </span>
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        {/* Card footer — always pinned to bottom */}
        <div className="mt-auto pt-5">
          {step === 'from' && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleContinueToRecipient}
            >
              Continue
            </Button>
          )}
          {step === 'recipient' && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              disabled={!sendWizard.resolvedAddress}
              onClick={handleContinueToAmount}
            >
              Continue
            </Button>
          )}
          {step === 'amount' && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              disabled={parsedAmount <= 0 || parsedAmount > selectedTokenBalance}
              onClick={handleContinueToReview}
            >
              Continue
            </Button>
          )}
          {step === 'review' && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              disabled={
                (showPairingWarning && !pairingAcknowledged) ||
                (sendWizard.isNewRecipient && !sendWizard.hasAcknowledged) ||
                isSending
              }
              isLoading={isSending}
              onClick={handleSend}
              data-testid="confirm-send"
            >
              Confirm and send
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
