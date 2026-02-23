'use client'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { mockEngine, randomDelay, mockDelay, DELAYS } from '@/lib/mock/engine'

export const useSend = () => {
  const router = useRouter()
  const {
    initiateSend,
    confirmSend,
    failSend,
    deductBalance,
    addBalance,
    resetSendWizard,
  } = useStore()
  const sendWizard = useStore((state) => state.sendWizard)

  const executeSend = useCallback(async () => {
    if (!sendWizard.amount || !sendWizard.resolvedAddress) return

    const optimisticId = `tx-${Date.now()}`
    const sendAmount = sendWizard.amount
    const sendAddress = sendWizard.resolvedAddress
    const sendDisplayName =
      sendWizard.resolvedDisplayName ?? sendWizard.resolvedAddress
    const tokenSymbol = sendWizard.selectedToken
    const fromAddressId = sendWizard.selectedFromAddress

    // Step 1: Optimistic update — immediate
    deductBalance(sendAmount, tokenSymbol)
    initiateSend({
      optimisticId,
      amount: sendAmount,
      recipientAddress: sendAddress,
      recipientDisplayName: sendDisplayName,
      tokenSymbol,
      fromAddressId: fromAddressId === 'private' ? undefined : fromAddressId,
    })

    // Step 2: Navigate away immediately
    router.push('/dashboard')
    resetSendWizard()

    // Step 3: Simulate network in background with minimum 4s pending display
    const sendStart = Date.now()
    await randomDelay(DELAYS.send.min, DELAYS.send.max)
    const result = mockEngine.simulateSendResult(sendAmount)
    const elapsed = Date.now() - sendStart
    const remaining = Math.max(0, 4000 - elapsed)
    await mockDelay(remaining)

    if (result === 'success') {
      confirmSend(optimisticId)
    } else {
      failSend(
        optimisticId,
        "Payment didn't go through. Your funds are safe.",
      )
      addBalance(sendAmount, tokenSymbol) // restore
    }
  }, [
    sendWizard,
    initiateSend,
    confirmSend,
    failSend,
    deductBalance,
    addBalance,
    resetSendWizard,
    router,
  ])

  return { executeSend, sendWizard }
}
