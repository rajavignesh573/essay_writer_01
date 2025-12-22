import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Essay Writer - AI-Powered Essay Generation',
    template: '%s | Essay Writer',
  },
  description: 'Generate high-quality, well-structured essays instantly with AI. Perfect for students and professionals. Start with 2 free credits.',
  keywords: ['essay writer', 'AI essay generator', 'writing assistant', 'essay help', 'academic writing'],
  authors: [{ name: 'Essay Writer' }],
  creator: 'Essay Writer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://essay-writer-01.vercel.app',
    title: 'Essay Writer - AI-Powered Essay Generation',
    description: 'Generate high-quality essays instantly with AI. Start with 2 free credits.',
    siteName: 'Essay Writer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essay Writer - AI-Powered Essay Generation',
    description: 'Generate high-quality essays instantly with AI. Start with 2 free credits.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}

