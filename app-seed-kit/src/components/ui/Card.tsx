import { cn } from '@/lib/utils'

type CardProps = {
  className?: string
  children: React.ReactNode
}

export const Card = ({
  className,
  children,
}: CardProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-bg-surface p-6 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}
