'use client'

import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label: string
  error?: string
  hint?: string
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref): React.JSX.Element => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <label
          htmlFor={inputId}
          className="text-label font-medium text-text-secondary"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [errorId, hintId].filter(Boolean).join(' ') || undefined
          }
          className={cn(
            'min-h-[44px] rounded-md border bg-bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary',
            'transition-colors focus:outline-none focus:shadow-ring',
            error
              ? 'border-error focus:border-error'
              : 'border-border-strong focus:border-accent',
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-label text-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-label text-text-tertiary">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
