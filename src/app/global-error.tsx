'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Something went wrong</h2>
            <button
              type="button"
              onClick={reset}
              style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
