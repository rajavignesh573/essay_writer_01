import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Pricing from '@/components/Pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Essay Writer',
  description: 'Choose the perfect plan for your essay writing needs',
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

