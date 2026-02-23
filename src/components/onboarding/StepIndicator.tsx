import { cn } from '@/lib/utils'

type StepIndicatorProps = { current: 1 | 2 | 3; total: 3 }

export const StepIndicator = ({ current }: StepIndicatorProps): React.JSX.Element => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {[1, 2, 3].map((step) => (
      <div
        key={step}
        className={cn(
          'w-1.5 h-1.5 rounded-full transition-colors duration-200',
          step === current ? 'bg-accent' : 'bg-bg-overlay',
        )}
      />
    ))}
  </div>
)
