import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontSize: {
      'micro':   ['11px', { lineHeight: '1.35', letterSpacing: '0.02em' }],
      'caps':    ['12px', { lineHeight: '1.4',  letterSpacing: '0.05em' }],
      'label':   ['13px', { lineHeight: '1.4',  letterSpacing: '0.01em' }],
      'sm':      ['14px', { lineHeight: '1.5',  letterSpacing: '0'      }],
      'base':    ['15px', { lineHeight: '1.6',  letterSpacing: '0'      }],
      'lg':      ['18px', { lineHeight: '1.6',  letterSpacing: '0'      }],
      'h3':      ['20px', { lineHeight: '1.35', letterSpacing: '0'      }],
      'h2':      ['24px', { lineHeight: '1.3',  letterSpacing: '-0.01em'}],
      'h1':      ['32px', { lineHeight: '1.2',  letterSpacing: '-0.02em'}],
      'display': ['48px', { lineHeight: '1.1',  letterSpacing: '-0.02em'}],
    },
    extend: {
      colors: {
        bg: {
          base:    'var(--bg-base)',
          surface: 'var(--bg-surface)',
          raised:  'var(--bg-raised)',
          overlay: 'var(--bg-overlay)',
          wash:    'var(--bg-wash)',
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
          active:  'var(--accent-active)',
          subtle:  'var(--accent-subtle)',
          muted:   'var(--accent-muted)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
          focus:   'var(--border-focus)',
        },
        success: {
          DEFAULT: 'var(--success)',
          subtle:  'var(--success-subtle)',
        },
        error: {
          DEFAULT: 'var(--error)',
          subtle:  'var(--error-subtle)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          subtle:  'var(--warning-subtle)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        xs:   'var(--shadow-xs)',
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        xl:   'var(--shadow-xl)',
        ring: 'var(--shadow-ring)',
      },
      minHeight: {
        btn:   'var(--btn-height)',
        input: 'var(--input-height)',
      },
    },
  },
  plugins: [],
}

export default config
