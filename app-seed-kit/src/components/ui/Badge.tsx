import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'accent'

type BadgeProps = {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-text-tertiary',
  accent: 'text-accent',
}

export const Badge = ({
  variant = 'neutral',
  children,
  className,
}: BadgeProps): React.JSX.Element => {
  return (
    <span
      className={cn(
        'inline-flex items-center text-label font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
