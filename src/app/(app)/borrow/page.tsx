'use client'

import { ProtocolCard } from '@/components/domain/ProtocolCard'

const BORROW_PROTOCOLS = [
  { id: 'aave-borrow', name: 'Aave', description: 'Variable rate loans', rate: '5.2%' },
  { id: 'compound-borrow', name: 'Compound', description: 'USDC borrowing', rate: '5.8%' },
  { id: 'morpho-borrow', name: 'Morpho', description: 'Peer-to-peer loans', rate: '4.9%' },
  { id: 'maker', name: 'Maker', description: 'DAI credit facility', rate: '6.5%' },
  { id: 'euler', name: 'Euler', description: 'Permissionless lending', rate: '5.4%' },
  { id: 'radiant', name: 'Radiant', description: 'Cross-chain loans', rate: '6.1%' },
]

export default function BorrowPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="text-h2 font-semibold text-text-primary">Borrow</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Use your balance as collateral
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BORROW_PROTOCOLS.map((protocol) => (
          <ProtocolCard
            key={protocol.id}
            id={protocol.id}
            name={protocol.name}
            description={protocol.description}
            rate={protocol.rate}
            rateLabel="APR"
          />
        ))}
      </div>
    </div>
  )
}
