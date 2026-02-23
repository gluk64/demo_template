import { createStore } from '@/store/testUtils'
import { selectNetWorth } from '@/store/selectors'

describe('token breakdown data', () => {
  it('seed data has two tokens: USDC and USDT', () => {
    const store = createStore()
    const balances = store.getState().balances
    const tokens = Object.keys(balances)
    expect(tokens).toContain('USDC')
    expect(tokens).toContain('USDT')
    expect(tokens.length).toBe(2)
  })

  it('USDC balance is 10430', () => {
    const store = createStore()
    expect(store.getState().balances.USDC?.amount).toBe(10430)
    expect(store.getState().balances.USDC?.usdValue).toBe(10430)
  })

  it('USDT balance is 2000', () => {
    const store = createStore()
    expect(store.getState().balances.USDT?.amount).toBe(2000)
    expect(store.getState().balances.USDT?.usdValue).toBe(2000)
  })

  it('total balance is 12430 (unchanged from before)', () => {
    const store = createStore()
    expect(selectNetWorth(store.getState())).toBe(12430)
  })

  it('deducting from USDT reduces only USDT', () => {
    const store = createStore()
    store.getState().deductBalance(500, 'USDT')
    expect(store.getState().balances.USDT?.amount).toBe(1500)
    expect(store.getState().balances.USDC?.amount).toBe(10430)
    expect(selectNetWorth(store.getState())).toBe(11930)
  })

  it('adding to USDT increases only USDT', () => {
    const store = createStore()
    store.getState().addBalance(1000, 'USDT')
    expect(store.getState().balances.USDT?.amount).toBe(3000)
    expect(store.getState().balances.USDC?.amount).toBe(10430)
  })
})
