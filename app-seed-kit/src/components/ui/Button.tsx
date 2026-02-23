'use client'

import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent-hover',
        secondary:
          'border border-border-strong bg-transparent text-text-primary hover:bg-bg-raised',
        ghost:
          'bg-transparent text-text-secondary hover:bg-bg-raised hover:text-text-primary',
        destructive: 'bg-error text-white hover:opacity-90',
      },
      size: {
        sm: 'min-h-[40px] px-4 text-sm',
        md: 'min-h-[52px] px-6 text-base',
        lg: 'min-h-[52px] px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    asChild?: boolean
    'data-testid'?: string
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ): React.JSX.Element => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as React.Ref<HTMLElement>}
        >
          {children}
        </Slot>
      )
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.08 }}
        type={props.type ?? 'button'}
        onClick={props.onClick}
        aria-label={props['aria-label']}
        data-testid={props['data-testid']}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonProps }
