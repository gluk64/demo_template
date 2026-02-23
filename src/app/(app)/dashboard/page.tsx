'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { SmokeSection } from '@/components/domain/SmokeSection'
import { Send, Plus, Trash2, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function DashboardPage(): React.JSX.Element {
  const [inputValue, setInputValue] = useState('')
  const [showError, setShowError] = useState(false)

  return (
    <div className="mx-auto max-w-3xl px-5 pt-8 pb-24">
      <h1 className="text-h2 font-semibold text-text-primary">
        UI Smoke Test
      </h1>
      <p className="mt-2 text-base text-text-secondary">
        Visual check of all components, variants, and design tokens.
      </p>

      {/* Typography */}
      <SmokeSection title="Typography" data-testid="section-typography">
        <div className="space-y-3">
          <p className="text-display font-semibold text-text-primary">Display</p>
          <p className="text-h1 font-semibold text-text-primary">Heading 1</p>
          <p className="text-h2 font-semibold text-text-primary">Heading 2</p>
          <p className="text-h3 font-medium text-text-primary">Heading 3</p>
          <p className="text-base text-text-primary">Body text — primary</p>
          <p className="text-sm text-text-secondary">Small text — secondary</p>
          <p className="text-label text-text-tertiary">Label text — tertiary</p>
          <p className="text-micro text-text-disabled">Micro text — disabled</p>
          <p className="font-mono text-sm text-text-primary">
            Monospace / tabular: $1,234.56
          </p>
        </div>
      </SmokeSection>

      {/* Buttons */}
      <SmokeSection title="Buttons" data-testid="section-buttons">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="md" aria-label="Primary" data-testid="btn-primary">
              Primary
            </Button>
            <Button variant="secondary" size="md" aria-label="Secondary" data-testid="btn-secondary">
              Secondary
            </Button>
            <Button variant="ghost" size="md" aria-label="Ghost" data-testid="btn-ghost">
              Ghost
            </Button>
            <Button variant="destructive" size="md" aria-label="Destructive" data-testid="btn-destructive">
              Destructive
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm" aria-label="Small" data-testid="btn-sm">
              Small
            </Button>
            <Button variant="primary" size="md" aria-label="Medium" data-testid="btn-md">
              Medium
            </Button>
            <Button variant="primary" size="lg" aria-label="Large" data-testid="btn-lg">
              Large
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Send size={16} aria-hidden="true" />}
              aria-label="With left icon"
              data-testid="btn-left-icon"
            >
              With Icon
            </Button>
            <Button
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight size={16} aria-hidden="true" />}
              aria-label="With right icon"
              data-testid="btn-right-icon"
            >
              Continue
            </Button>
            <Button variant="primary" size="md" isLoading aria-label="Loading" data-testid="btn-loading">
              Loading
            </Button>
            <Button variant="primary" size="md" disabled aria-label="Disabled" data-testid="btn-disabled">
              Disabled
            </Button>
          </div>
        </div>
      </SmokeSection>

      {/* Cards */}
      <SmokeSection title="Cards" data-testid="section-cards">
        <div className="space-y-4">
          <Card>
            <p className="text-sm font-medium text-text-primary">Default Card</p>
            <p className="mt-1 text-sm text-text-secondary">
              Standard card with surface background and subtle border.
            </p>
          </Card>
          <Card className="bg-bg-raised">
            <p className="text-sm font-medium text-text-primary">Raised Card</p>
            <p className="mt-1 text-sm text-text-secondary">
              Card with raised background for emphasis.
            </p>
          </Card>
          <Card className="border-accent-border">
            <p className="text-sm font-medium text-accent">Accent Card</p>
            <p className="mt-1 text-sm text-text-secondary">
              Card with accent border for highlighted content.
            </p>
          </Card>
        </div>
      </SmokeSection>

      {/* Badges */}
      <SmokeSection title="Badges" data-testid="section-badges">
        <div className="flex flex-wrap gap-4">
          <Badge variant="success" data-testid="badge-success">Success</Badge>
          <Badge variant="warning" data-testid="badge-warning">Warning</Badge>
          <Badge variant="error" data-testid="badge-error">Error</Badge>
          <Badge variant="neutral" data-testid="badge-neutral">Neutral</Badge>
          <Badge variant="accent" data-testid="badge-accent">Accent</Badge>
        </div>
      </SmokeSection>

      {/* Inputs */}
      <SmokeSection title="Inputs" data-testid="section-inputs">
        <div className="space-y-4 max-w-md">
          <Input
            label="Default input"
            placeholder="Type something here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            data-testid="input-default"
          />
          <Input
            label="With hint"
            placeholder="user@example.com"
            hint="Enter your email address"
            data-testid="input-hint"
          />
          <Input
            label="Error state"
            placeholder="Required field"
            error={showError ? "That doesn't look right. Check and try again." : undefined}
            data-testid="input-error"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowError(!showError)}
            aria-label={showError ? 'Hide error' : 'Show error'}
            leftIcon={showError ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
            data-testid="toggle-error-btn"
          >
            {showError ? 'Hide error state' : 'Show error state'}
          </Button>
          <Input
            label="Disabled input"
            placeholder="Not editable"
            disabled
            data-testid="input-disabled"
          />
        </div>
      </SmokeSection>

      {/* Colors */}
      <SmokeSection title="Color Tokens" data-testid="section-colors">
        <div className="space-y-4">
          <div>
            <p className="text-label font-medium text-text-secondary mb-2">Backgrounds</p>
            <div className="flex gap-2">
              <div className="h-12 w-12 rounded-sm bg-bg-base border border-border" title="bg-base" />
              <div className="h-12 w-12 rounded-sm bg-bg-surface border border-border" title="bg-surface" />
              <div className="h-12 w-12 rounded-sm bg-bg-raised border border-border" title="bg-raised" />
              <div className="h-12 w-12 rounded-sm bg-bg-overlay border border-border" title="bg-overlay" />
              <div className="h-12 w-12 rounded-sm bg-bg-muted border border-border" title="bg-muted" />
            </div>
          </div>
          <div>
            <p className="text-label font-medium text-text-secondary mb-2">Accent</p>
            <div className="flex gap-2">
              <div className="h-12 w-12 rounded-sm bg-accent" title="accent" />
              <div className="h-12 w-12 rounded-sm bg-accent-hover" title="accent-hover" />
              <div className="h-12 w-12 rounded-sm bg-accent-active" title="accent-active" />
              <div className="h-12 w-12 rounded-sm bg-accent-subtle border border-border" title="accent-subtle" />
            </div>
          </div>
          <div>
            <p className="text-label font-medium text-text-secondary mb-2">Semantic</p>
            <div className="flex gap-2">
              <div className="h-12 w-12 rounded-sm bg-success" title="success" />
              <div className="h-12 w-12 rounded-sm bg-warning" title="warning" />
              <div className="h-12 w-12 rounded-sm bg-error" title="error" />
              <div className="h-12 w-12 rounded-sm bg-pending" title="pending" />
            </div>
          </div>
        </div>
      </SmokeSection>

      {/* Icon showcase */}
      <SmokeSection title="Icons (Lucide)" data-testid="section-icons">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-bg-raised">
              <Send size={20} className="text-text-secondary" aria-hidden="true" />
            </div>
            <span className="text-micro text-text-tertiary">Send</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-bg-raised">
              <Plus size={20} className="text-text-secondary" aria-hidden="true" />
            </div>
            <span className="text-micro text-text-tertiary">Plus</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-bg-raised">
              <Trash2 size={20} className="text-text-secondary" aria-hidden="true" />
            </div>
            <span className="text-micro text-text-tertiary">Trash</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-bg-raised">
              <Eye size={20} className="text-text-secondary" aria-hidden="true" />
            </div>
            <span className="text-micro text-text-tertiary">Eye</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-bg-raised">
              <ArrowRight size={20} className="text-text-secondary" aria-hidden="true" />
            </div>
            <span className="text-micro text-text-tertiary">Arrow</span>
          </div>
        </div>
      </SmokeSection>

      {/* Spacing & Layout */}
      <SmokeSection title="Spacing Demo" data-testid="section-spacing">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-accent" />
            <span className="text-label text-text-tertiary">4px — micro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-2 rounded-full bg-accent" />
            <span className="text-label text-text-tertiary">8px — tight</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-accent" />
            <span className="text-label text-text-tertiary">16px — element</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-6 rounded-full bg-accent" />
            <span className="text-label text-text-tertiary">24px — card</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-8 rounded-full bg-accent" />
            <span className="text-label text-text-tertiary">32px — section</span>
          </div>
        </div>
      </SmokeSection>

      {/* Combined example */}
      <SmokeSection title="Combined Example" data-testid="section-combined">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Recent Activity</p>
              <p className="text-label text-text-tertiary">Your activity will appear here</p>
            </div>
            <Badge variant="accent">New</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-subtle">
                  <Plus size={14} className="text-success" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-text-primary">Received payment</p>
                  <p className="text-label text-text-tertiary">2 hours ago</p>
                </div>
              </div>
              <p className="font-mono text-sm text-success">+$42.00</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle">
                  <Send size={14} className="text-accent" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-text-primary">Sent payment</p>
                  <p className="text-label text-text-tertiary">5 hours ago</p>
                </div>
              </div>
              <p className="font-mono text-sm text-error">-$18.50</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pending-subtle">
                  <Send size={14} className="text-pending" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-text-primary">Pending transfer</p>
                  <p className="text-label text-text-tertiary">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">Pending</Badge>
                <p className="font-mono text-sm text-text-secondary">-$7.25</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={14} aria-hidden="true" />}
              aria-label="View all activity"
              data-testid="view-all-btn"
            >
              View all
            </Button>
          </div>
        </Card>
      </SmokeSection>
    </div>
  )
}
