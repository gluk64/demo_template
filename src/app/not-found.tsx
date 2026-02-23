export default function NotFound(): React.JSX.Element {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Page not found</h2>
        <p style={{ marginTop: '8px', color: 'rgb(136, 136, 136)' }}>
          The page you are looking for does not exist.
        </p>
        <a
          href="/dashboard"
          style={{ display: 'inline-block', marginTop: '16px', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Go home
        </a>
      </div>
    </div>
  )
}
