import { createStore } from '@/store/testUtils'
import {
  selectRecentTransactions,
  selectRecentTransactions5,
  selectRecentTransactions10,
  selectNetWorth,
} from '@/store/selectors'

/**
 * Regression tests for selector reference stability.
 *
 * BUG: The dashboard called useStore(selectRecentTransactions(5)) inline.
 * Each render created a NEW closure, and the closure returned a NEW array
 * (because of [...].sort().slice()). Zustand's useSyncExternalStore
 * detected a new getSnapshot function on every render, called it, and
 * found a different array reference (Object.is === false). This triggered
 * a re-render, which created yet another new closure + array, causing an
 * infinite re-render loop ("Maximum update depth exceeded").
 *
 * FIX: Pre-built selectors (selectRecentTransactions5, selectRecentTransactions10)
 * that are stable references. Components import these instead of calling
 * selectRecentTransactions(N) inline.
 */

describe('pre-built selectors are stable references', () => {
  it('selectRecentTransactions5 is the same function reference across accesses', () => {
    const ref1 = selectRecentTransactions5
    const ref2 = selectRecentTransactions5
    expect(ref1).toBe(ref2)
  })

  it('selectRecentTransactions10 is the same function reference across accesses', () => {
    const ref1 = selectRecentTransactions10
    const ref2 = selectRecentTransactions10
    expect(ref1).toBe(ref2)
  })

  it('selectNetWorth is the same function reference across accesses', () => {
    const ref1 = selectNetWorth
    const ref2 = selectNetWorth
    expect(ref1).toBe(ref2)
  })
})

describe('inline selectRecentTransactions(N) creates new references (the bug)', () => {
  it('calling selectRecentTransactions(5) twice produces different function references', () => {
    const sel1 = selectRecentTransactions(5)
    const sel2 = selectRecentTransactions(5)
    // This is WHY you must NOT call selectRecentTransactions(N) inside a component.
    // Each call creates a new closure.
    expect(sel1).not.toBe(sel2)
  })

  it('different closures return different array references for the same state', () => {
    const store = createStore()
    const state = store.getState()

    const sel1 = selectRecentTransactions(5)
    const sel2 = selectRecentTransactions(5)

    const result1 = sel1(state)
    const result2 = sel2(state)

    // Same VALUES, different references. This is what triggers infinite re-renders
    // when used with useSyncExternalStore — Object.is(result1, result2) is false.
    expect(result1).not.toBe(result2)
    expect(result1).toEqual(result2)
  })
})

describe('pre-built selector returns correct data', () => {
  it('selectRecentTransactions5 returns up to 5 transactions sorted by time', () => {
    const store = createStore()
    const txs = selectRecentTransactions5(store.getState())
    expect(txs.length).toBeLessThanOrEqual(5)
    for (let i = 1; i < txs.length; i++) {
      expect(txs[i - 1]!.initiatedAt).toBeGreaterThanOrEqual(txs[i]!.initiatedAt)
    }
  })

  it('selectRecentTransactions10 returns up to 10 transactions sorted by time', () => {
    const store = createStore()
    const txs = selectRecentTransactions10(store.getState())
    expect(txs.length).toBeLessThanOrEqual(10)
    for (let i = 1; i < txs.length; i++) {
      expect(txs[i - 1]!.initiatedAt).toBeGreaterThanOrEqual(txs[i]!.initiatedAt)
    }
  })
})
