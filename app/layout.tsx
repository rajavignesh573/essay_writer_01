import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Essay Writer - AI-Powered Essay Generation',
    template: '%s | Essay Writer',
  },
  description: 'Generate high-quality, well-structured essays instantly with AI. Perfect for students and professionals. Start with 2 free credits. Powered by GPT-4o-mini.',
  keywords: [
    'essay writer',
    'AI essay generator',
    'writing assistant',
    'essay help',
    'academic writing',
    'essay writing tool',
    'AI writing',
    'essay generator free',
    'online essay writer',
    'automated essay writing',
    'essay writing service',
    'academic essay generator',
  ],
  authors: [{ name: 'Essay Writer' }],
  creator: 'Essay Writer',
  publisher: 'Essay Writer',
  category: 'Education',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'Essay Writer - AI-Powered Essay Generation',
    description: 'Generate high-quality, well-structured essays instantly with AI. Perfect for students and professionals. Start with 2 free credits.',
    siteName: 'Essay Writer',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Essay Writer - AI-Powered Essay Generation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essay Writer - AI-Powered Essay Generation',
    description: 'Generate high-quality essays instantly with AI. Start with 2 free credits.',
    images: [`${baseUrl}/opengraph-image`],
    creator: '@essaywriter',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: '/icon', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

