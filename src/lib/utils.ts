import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['micro', 'label', 'sm', 'base', 'lg', 'h3', 'h2', 'h1', 'display'] },
      ],
    },
  },
})

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
