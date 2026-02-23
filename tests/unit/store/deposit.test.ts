import { createStore } from '@/store/testUtils'

beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.useRealTimers()
})

describe('deposit slice', () => {
  it('starts with seed deposit address', () => {
    const store = createStore()
    expect(store.getState().depositAddresses.length).toBe(1)
    expect(store.getState().depositAddresses[0]?.label).toBe('Primary')
    expect(store.getState().depositAddresses[0]?.id).toBe('addr-seed-1')
  })

  it('generateDepositAddress adds to array with correct label', async () => {
    const store = createStore()

    const promise = store.getState().generateDepositAddress('Savings')
    expect(store.getState().isGenerating).toBe(true)

    jest.advanceTimersByTime(1000)
    await promise

    expect(store.getState().isGenerating).toBe(false)
    const addresses = store.getState().depositAddresses
    expect(addresses.length).toBe(2)
    expect(addresses[1]?.label).toBe('Savings')
    expect(addresses[1]?.address).toMatch(/^0x/)
  })

  it('generateDepositAddress preserves existing addresses', async () => {
    const store = createStore()
    const originalAddress = store.getState().depositAddresses[0]

    const promise = store.getState().generateDepositAddress('Work')
    jest.advanceTimersByTime(1000)
    await promise

    expect(store.getState().depositAddresses[0]).toEqual(originalAddress)
    expect(store.getState().depositAddresses.length).toBe(2)
  })

  it('updateAddressLabel updates the correct address by ID', () => {
    const store = createStore()
    const id = store.getState().depositAddresses[0]?.id
    if (!id) throw new Error('No seed address')

    store.getState().updateAddressLabel(id, 'Updated Label')
    expect(store.getState().depositAddresses[0]?.label).toBe('Updated Label')
  })

  it('updateAddressLabel does not affect other addresses', async () => {
    const store = createStore()

    const promise = store.getState().generateDepositAddress('Second')
    jest.advanceTimersByTime(1000)
    await promise

    const firstId = store.getState().depositAddresses[0]?.id
    if (!firstId) throw new Error('No first address')

    store.getState().updateAddressLabel(firstId, 'Renamed')
    expect(store.getState().depositAddresses[0]?.label).toBe('Renamed')
    expect(store.getState().depositAddresses[1]?.label).toBe('Second')
  })

  it('toggleExpandAddress sets expandedAddressId', () => {
    const store = createStore()
    expect(store.getState().expandedAddressId).toBeNull()

    store.getState().toggleExpandAddress('addr-seed-1')
    expect(store.getState().expandedAddressId).toBe('addr-seed-1')
  })

  it('toggleExpandAddress toggles off when same id', () => {
    const store = createStore()
    store.getState().toggleExpandAddress('addr-seed-1')
    store.getState().toggleExpandAddress('addr-seed-1')
    expect(store.getState().expandedAddressId).toBeNull()
  })

  it('toggleExpandAddress switches to different id', () => {
    const store = createStore()
    store.getState().toggleExpandAddress('addr-seed-1')
    store.getState().toggleExpandAddress('addr-other')
    expect(store.getState().expandedAddressId).toBe('addr-other')
  })
})
