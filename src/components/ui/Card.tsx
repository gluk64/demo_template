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
        'rounded-md border border-border-subtle bg-bg-surface p-6 shadow-card',
        className,
      )}
    >
      {children}
    </div>
  )
}
