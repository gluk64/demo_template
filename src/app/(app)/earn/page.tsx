'use client'

import { ProtocolCard } from '@/components/domain/ProtocolCard'

const EARN_PROTOCOLS = [
  { id: 'aave', name: 'Aave', description: 'Lending & borrowing', apy: '4.2%' },
  { id: 'compound', name: 'Compound', description: 'Algorithmic interest', apy: '3.8%' },
  { id: 'morpho', name: 'Morpho', description: 'Optimized lending', apy: '5.1%' },
  { id: 'spark', name: 'Spark', description: 'DAI savings rate', apy: '6.0%' },
  { id: 'yearn', name: 'Yearn', description: 'Yield aggregator', apy: '4.7%' },
  { id: 'balancer', name: 'Balancer', description: 'Liquidity pools', apy: '3.5%' },
]

export default function EarnPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="text-h2 font-semibold text-text-primary">Earn</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Put your balance to work
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {EARN_PROTOCOLS.map((protocol) => (
          <ProtocolCard
            key={protocol.id}
            id={protocol.id}
            name={protocol.name}
            description={protocol.description}
            rate={protocol.apy}
            rateLabel="APY"
          />
        ))}
      </div>
    </div>
  )
}
