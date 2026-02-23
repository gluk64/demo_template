import { createStore } from '@/store/testUtils'

describe('transactions slice', () => {
  it('starts with seed transactions', () => {
    const store = createStore()
    expect(store.getState().transactions.length).toBeGreaterThan(0)
  })

  it('initiateSend creates optimistic transaction immediately', () => {
    const store = createStore()
    store.getState().initiateSend({
      optimisticId: 'tx-test-1',
      amount: 100,
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      recipientDisplayName: 'alice',
      tokenSymbol: 'USDC',
    })
    const tx = store.getState().transactions[0]
    expect(tx?.id).toBe('tx-test-1')
    expect(tx?.status).toBe('optimistic')
    expect(tx?.amount).toBe(100)
    expect(tx?.direction).toBe('outbound')
  })

  it('confirmSend updates transaction status to confirmed', () => {
    const store = createStore()
    store.getState().initiateSend({
      optimisticId: 'tx-1',
      amount: 100,
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      recipientDisplayName: 'alice',
      tokenSymbol: 'USDC',
    })
    store.getState().confirmSend('tx-1')

    const tx = store.getState().transactions.find(t => t.id === 'tx-1')
    expect(tx?.status).toBe('confirmed')
    expect(tx?.confirmedAt).toBeDefined()
  })

  it('failSend removes the optimistic transaction', () => {
    const store = createStore()
    store.getState().initiateSend({
      optimisticId: 'tx-1',
      amount: 100,
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      recipientDisplayName: 'alice',
      tokenSymbol: 'USDC',
    })
    store.getState().failSend('tx-1', 'Network error')
    expect(store.getState().transactions.find(t => t.id === 'tx-1')).toBeUndefined()
  })

  it('sendState tracks lifecycle', () => {
    const store = createStore()
    expect(store.getState().sendState.status).toBe('idle')

    store.getState().initiateSend({
      optimisticId: 'tx-1',
      amount: 100,
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      recipientDisplayName: 'alice',
      tokenSymbol: 'USDC',
    })
    expect(store.getState().sendState.status).toBe('pending')

    store.getState().confirmSend('tx-1')
    expect(store.getState().sendState.status).toBe('success')

    store.getState().resetSendState()
    expect(store.getState().sendState.status).toBe('idle')
  })
})

describe('balance slice', () => {
  it('starts with seed USDC balance of 10430', () => {
    const store = createStore()
    expect(store.getState().balances.USDC?.amount).toBe(10430)
  })

  it('starts with seed USDT balance of 2000', () => {
    const store = createStore()
    expect(store.getState().balances.USDT?.amount).toBe(2000)
  })

  it('deductBalance reduces USDC balance by default', () => {
    const store = createStore()
    store.getState().deductBalance(100)
    expect(store.getState().balances.USDC?.amount).toBe(10330)
  })

  it('deductBalance reduces specific token balance', () => {
    const store = createStore()
    store.getState().deductBalance(500, 'USDT')
    expect(store.getState().balances.USDT?.amount).toBe(1500)
  })

  it('addBalance increases USDC balance', () => {
    const store = createStore()
    store.getState().addBalance(500)
    expect(store.getState().balances.USDC?.amount).toBe(10930)
  })

  it('deduct then add restores original balance', () => {
    const store = createStore()
    store.getState().deductBalance(100)
    store.getState().addBalance(100)
    expect(store.getState().balances.USDC?.amount).toBe(10430)
  })
})
