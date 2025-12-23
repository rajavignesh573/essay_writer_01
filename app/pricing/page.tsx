import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Pricing from '@/components/Pricing'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'

export const metadata: Metadata = {
  title: 'Pricing - Essay Writer',
  description: 'Choose the perfect plan for your essay writing needs. Monthly plan: $19/month for 20 credits. Annual plan: $190/year for 300 credits. Start with 2 free credits.',
  keywords: [
    'essay writer pricing',
    'essay generator pricing',
    'essay writing service cost',
    'AI essay writer price',
    'essay writing subscription',
  ],
  openGraph: {
    title: 'Pricing - Essay Writer',
    description: 'Choose the perfect plan for your essay writing needs. Monthly and annual plans available.',
    url: `${baseUrl}/pricing`,
    siteName: 'Essay Writer',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pricing - Essay Writer',
    description: 'Choose the perfect plan for your essay writing needs.',
  },
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
}

export default async function PricingPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Pricing />
    </div>
  )
}

