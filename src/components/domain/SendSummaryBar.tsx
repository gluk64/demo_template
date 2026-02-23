'use client'

import { cn } from '@/lib/utils'

type SummaryLine = {
  label: string
  value: string
  step: 'recipient' | 'from' | 'amount'
}

type SendSummaryBarProps = {
  lines: SummaryLine[]
  onEdit: (step: 'recipient' | 'from' | 'amount') => void
  onCancel: () => void
}

export type { SummaryLine }

export const SendSummaryBar = ({ lines, onEdit, onCancel }: SendSummaryBarProps): React.JSX.Element | null => {
  if (lines.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, index) => (
        <div key={line.label} className="flex items-baseline justify-between">
          <button
            onClick={(): void => onEdit(line.step)}
            className={cn(
              'flex items-baseline gap-2 text-left',
              'hover:opacity-80 transition-opacity duration-150',
              'cursor-pointer',
            )}
          >
            <span className="text-[12px] text-text-disabled w-[42px] flex-shrink-0">
              {line.label}
            </span>
            <span className="text-[13px] text-text-tertiary truncate">
              {line.value}
            </span>
          </button>

          {index === 0 && (
            <button
              onClick={onCancel}
              className="text-[12px] text-text-disabled hover:text-text-tertiary transition-colors duration-150 ml-4 flex-shrink-0"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
