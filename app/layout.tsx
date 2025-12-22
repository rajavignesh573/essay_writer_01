import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Essay Writer - AI-Powered Essay Generation',
  description: 'Generate high-quality essays with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

