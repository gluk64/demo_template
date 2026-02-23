import { cn } from '@/lib/utils'

/**
 * Regression tests for the cn() utility (tailwind-merge wrapper).
 *
 * BUG: tailwind-merge did not recognise our custom font-size tokens
 * (text-display, text-h1, text-h2, text-h3, text-micro, text-label)
 * and treated them as text-color classes. When a custom font-size and
 * a text-color class appeared together (e.g. text-display + text-text-primary),
 * tailwind-merge silently stripped the font-size class.
 *
 * This caused the balance number on the dashboard to lose its 56px
 * display size, headings to lose their sizes, and every page using the
 * design-token type scale to render at the wrong font size.
 *
 * FIX: Extended tailwind-merge with our custom font-size classGroup so it
 * recognises them as font-size — not text-color — classes.
 */

describe('cn() preserves custom font-size tokens alongside text-color classes', () => {
  it('keeps text-display with text-text-primary', () => {
    const result = cn(
      'font-mono text-display font-semibold text-text-primary',
    )
    expect(result).toContain('text-display')
    expect(result).toContain('text-text-primary')
  })

  it('keeps text-h1 with text-text-primary', () => {
    const result = cn('text-h1 text-text-primary')
    expect(result).toContain('text-h1')
    expect(result).toContain('text-text-primary')
  })

  it('keeps text-h2 with text-text-secondary', () => {
    const result = cn('text-h2 font-semibold text-text-secondary')
    expect(result).toContain('text-h2')
    expect(result).toContain('text-text-secondary')
  })

  it('keeps text-h3 with text-text-primary', () => {
    const result = cn('text-h3 text-text-primary')
    expect(result).toContain('text-h3')
    expect(result).toContain('text-text-primary')
  })

  it('keeps text-micro with text-text-tertiary', () => {
    const result = cn('text-micro text-text-tertiary')
    expect(result).toContain('text-micro')
    expect(result).toContain('text-text-tertiary')
  })

  it('keeps text-label with text-text-tertiary', () => {
    const result = cn('text-label text-text-tertiary')
    expect(result).toContain('text-label')
    expect(result).toContain('text-text-tertiary')
  })

  it('keeps text-lg with text-text-primary', () => {
    const result = cn('text-lg text-text-primary')
    expect(result).toContain('text-lg')
    expect(result).toContain('text-text-primary')
  })
})

describe('cn() still merges conflicting font-sizes correctly', () => {
  it('last font-size wins when two custom sizes conflict', () => {
    const result = cn('text-h1 text-display')
    expect(result).toBe('text-display')
  })

  it('last font-size wins for built-in sizes', () => {
    const result = cn('text-sm text-base')
    expect(result).toBe('text-base')
  })

  it('custom size overrides built-in size', () => {
    const result = cn('text-base text-display')
    expect(result).toBe('text-display')
  })
})

describe('cn() still merges conflicting text-colors correctly', () => {
  it('last color wins', () => {
    const result = cn('text-text-primary text-text-secondary')
    expect(result).toBe('text-text-secondary')
  })
})
