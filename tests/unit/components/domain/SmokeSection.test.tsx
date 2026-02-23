/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SmokeSection } from '@/components/domain/SmokeSection'

describe('SmokeSection', () => {
  it('renders title and children', () => {
    render(
      <SmokeSection title="Test Section" data-testid="test-section">
        <p>Section content</p>
      </SmokeSection>,
    )

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('Section content')).toBeInTheDocument()
  })

  it('applies data-testid to the section element', () => {
    render(
      <SmokeSection title="Tagged" data-testid="my-section">
        <span>inner</span>
      </SmokeSection>,
    )

    expect(screen.getByTestId('my-section')).toBeInTheDocument()
  })

  it('renders as a section element', () => {
    const { container } = render(
      <SmokeSection title="Semantic">
        <span>content</span>
      </SmokeSection>,
    )

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })
})
