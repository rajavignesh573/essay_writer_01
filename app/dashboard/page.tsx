import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EssayWriter from '@/components/EssayWriter'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'

export const metadata: Metadata = {
  title: 'Dashboard - Essay Writer',
  description: 'Generate AI-powered essays with ease. Create high-quality, well-structured essays in seconds using our advanced AI writing assistant.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/dashboard`,
  },
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <EssayWriter initialCredits={profile?.credits || 0} />
    </div>
  )
}

