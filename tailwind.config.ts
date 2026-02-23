import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontSize: {
      'micro':   ['12px', { lineHeight: '1.4',  letterSpacing: '0.04em' }],
      'label':   ['13px', { lineHeight: '1.4',  letterSpacing: '0.02em' }],
      'sm':      ['15px', { lineHeight: '1.55', letterSpacing: '0'      }],
      'base':    ['16px', { lineHeight: '1.6',  letterSpacing: '0'      }],
      'lg':      ['18px', { lineHeight: '1.6',  letterSpacing: '0'      }],
      'h3':      ['22px', { lineHeight: '1.3',  letterSpacing: '0'      }],
      'h2':      ['24px', { lineHeight: '1.3',  letterSpacing: '-0.01em'}],
      'h1':      ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em'}],
      'display': ['56px', { lineHeight: '1.0',  letterSpacing: '-0.03em'}],
    },
    extend: {
      colors: {
        bg: {
          base:    'var(--bg-base)',
          surface: 'var(--bg-surface)',
          raised:  'var(--bg-raised)',
          overlay: 'var(--bg-overlay)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          disabled:  'var(--text-disabled)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          subtle:  'var(--accent-subtle)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },
        success: 'var(--success)',
        error:   'var(--error)',
        warning: 'var(--warning)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      minHeight: {
        btn: 'var(--btn-height)',
        input: 'var(--input-height)',
      },
    },
  },
  plugins: [],
}

export default config
