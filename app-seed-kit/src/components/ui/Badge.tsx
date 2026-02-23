import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'accent'

type BadgeProps = {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  error: 'bg-error-subtle text-error',
  neutral: 'bg-bg-raised text-text-secondary',
  accent: 'bg-accent-subtle text-accent',
}

export const Badge = ({
  variant = 'neutral',
  children,
  className,
}: BadgeProps): React.JSX.Element => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2 py-0.5 text-micro font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
