import { isNewSenderRecipientPairing } from '@/store/selectors'
import { createStore } from '@/store/testUtils'
import type { Transaction } from '@/types'

describe('isNewSenderRecipientPairing', () => {
  const baseTx: Transaction = {
    id: 'tx-1',
    direction: 'outbound',
    amount: 100,
    tokenSymbol: 'USDC',
    usdValue: 100,
    recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    recipientNickname: 'alice',
    fromAddressId: 'addr-1',
    status: 'confirmed',
    initiatedAt: Date.now(),
    isRetryable: false,
  }

  it('returns false for private (hidden) address', () => {
    expect(isNewSenderRecipientPairing([], 'alice', 'private')).toBe(false)
  })

  it('returns true when no transactions exist', () => {
    expect(isNewSenderRecipientPairing([], 'alice', 'addr-1')).toBe(true)
  })

  it('returns true when pairing is new (different fromAddressId)', () => {
    const txs = [baseTx]
    expect(isNewSenderRecipientPairing(txs, 'alice', 'addr-2')).toBe(true)
  })

  it('returns true when pairing is new (different recipient)', () => {
    const txs = [baseTx]
    expect(isNewSenderRecipientPairing(txs, 'bob', 'addr-1')).toBe(true)
  })

  it('returns false when exact pairing exists (by nickname)', () => {
    const txs = [baseTx]
    expect(isNewSenderRecipientPairing(txs, 'alice', 'addr-1')).toBe(false)
  })

  it('returns false when exact pairing exists (by address)', () => {
    const txs = [baseTx]
    expect(
      isNewSenderRecipientPairing(
        txs,
        '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        'addr-1',
      ),
    ).toBe(false)
  })

  it('ignores inbound transactions', () => {
    const inboundTx: Transaction = { ...baseTx, direction: 'inbound' }
    expect(isNewSenderRecipientPairing([inboundTx], 'alice', 'addr-1')).toBe(true)
  })

  it('ignores transactions without fromAddressId', () => {
    const noFromTx: Transaction = { ...baseTx, fromAddressId: undefined }
    expect(isNewSenderRecipientPairing([noFromTx], 'alice', 'addr-1')).toBe(true)
  })
})

describe('fromAddressId on transactions', () => {
  it('stores fromAddressId when initiating a send', () => {
    const store = createStore()
    store.getState().initiateSend({
      optimisticId: 'tx-pairing-1',
      amount: 50,
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      recipientDisplayName: 'alice',
      tokenSymbol: 'USDC',
      fromAddressId: 'addr-primary',
    })

    const tx = store.getState().transactions.find((t) => t.id === 'tx-pairing-1')
    expect(tx).toBeDefined()
    expect(tx?.fromAddressId).toBe('addr-primary')
  })

  it('stores undefined fromAddressId for private sends', () => {
    const store = createStore()
    store.getState().initiateSend({
      optimisticId: 'tx-pairing-2',
      amount: 50,
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      recipientDisplayName: 'alice',
      tokenSymbol: 'USDC',
      // no fromAddressId — private send
    })

    const tx = store.getState().transactions.find((t) => t.id === 'tx-pairing-2')
    expect(tx).toBeDefined()
    expect(tx?.fromAddressId).toBeUndefined()
  })
})
