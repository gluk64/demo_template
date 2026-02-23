import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontSize: {
      'micro':   ['11px', { lineHeight: '1.2',  letterSpacing: '0.04em' }],
      'label':   ['12px', { lineHeight: '1.2',  letterSpacing: '0.02em' }],
      'sm':      ['14px', { lineHeight: '1.5',  letterSpacing: '0'      }],
      'base':    ['16px', { lineHeight: '1.5',  letterSpacing: '0'      }],
      'lg':      ['18px', { lineHeight: '1.5',  letterSpacing: '0'      }],
      'h3':      ['20px', { lineHeight: '1.35', letterSpacing: '0'      }],
      'h2':      ['24px', { lineHeight: '1.35', letterSpacing: '-0.01em'}],
      'h1':      ['32px', { lineHeight: '1.35', letterSpacing: '-0.02em'}],
      'display': ['48px', { lineHeight: '1.2',  letterSpacing: '-0.03em'}],
    },
    extend: {
      colors: {
        bg: {
          base:    'var(--bg-base)',
          surface: 'var(--bg-surface)',
          raised:  'var(--bg-raised)',
          overlay: 'var(--bg-overlay)',
          muted:   'var(--bg-muted)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          disabled:  'var(--text-disabled)',
          inverse:   'var(--text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--accent-primary)',
          hover:   'var(--accent-hover)',
          active:  'var(--accent-active)',
          subtle:  'var(--accent-subtle)',
          border:  'var(--accent-border)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          subtle:  'var(--border-subtle)',
          strong:  'var(--border-strong)',
          accent:  'var(--border-accent)',
        },
        success: {
          DEFAULT: 'var(--success)',
          subtle:  'var(--success-subtle)',
          border:  'var(--success-border)',
        },
        error: {
          DEFAULT: 'var(--error)',
          subtle:  'var(--error-subtle)',
          border:  'var(--error-border)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          subtle:  'var(--warning-subtle)',
          border:  'var(--warning-border)',
        },
        pending: {
          DEFAULT: 'var(--pending)',
          subtle:  'var(--pending-subtle)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        full: '9999px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        modal: '0 24px 48px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
