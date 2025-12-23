import { ImageResponse } from 'next/og'

export const alt = 'Essay Writer - AI-Powered Essay Generation'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: 20 }}
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h1 style={{ margin: 0, fontWeight: 'bold' }}>Essay Writer</h1>
        </div>
        <p style={{ fontSize: 36, margin: 0, opacity: 0.9 }}>
          AI-Powered Essay Generation
        </p>
        <p style={{ fontSize: 24, marginTop: 20, opacity: 0.8 }}>
          Generate high-quality essays instantly
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}

