// Protocol avatar colors — design-approved, exempt from token lint
const PROTOCOL_COLORS = [
  '#3B4FD4', // indigo
  '#0D7C66', // teal
  '#7C3AED', // violet
  '#B45309', // amber
  '#0369A1', // sky
  '#BE185D', // pink
]

const getProtocolColor = (id: string): string => {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % PROTOCOL_COLORS.length
  return PROTOCOL_COLORS[index] ?? '#3B4FD4'
}

type ProtocolCardProps = {
  id: string
  name: string
  description: string
  rate: string
  rateLabel: 'APY' | 'APR'
}

export function ProtocolCard({
  id,
  name,
  description,
  rate,
  rateLabel,
}: ProtocolCardProps): React.JSX.Element {
  const bgColor = getProtocolColor(id)
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div className="cursor-pointer rounded-xl border border-border bg-bg-surface p-5 transition-colors duration-200 hover:border-border-strong">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: bgColor }}
      >
        <span className="font-mono text-[14px] font-bold text-white">
          {initials}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-text-primary">{name}</p>
      <p className="mt-0.5 text-label text-text-tertiary">{description}</p>
      <p className="mt-3 font-mono text-label font-medium text-success">
        {rate} {rateLabel}
      </p>
    </div>
  )
}
