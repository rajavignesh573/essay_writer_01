import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EssayHistory from '@/components/EssayHistory'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'

export const metadata: Metadata = {
  title: 'Essay History - Essay Writer',
  description: 'View and manage all your generated essays. Access your writing history, edit essays, and download them in your preferred format.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/history`,
  },
}

const ESSAYS_PER_PAGE = 20

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const page = parseInt(searchParams.page || '1', 10)
  const from = (page - 1) * ESSAYS_PER_PAGE
  const to = from + ESSAYS_PER_PAGE - 1

  // Fetch essays with pagination
  const { data: essays, error } = await supabase
    .from('essays')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  // Get total count for pagination
  const { count } = await supabase
    .from('essays')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const totalPages = count ? Math.ceil(count / ESSAYS_PER_PAGE) : 1

  return (
    <div className="min-h-screen bg-gray-50">
      <EssayHistory
        essays={essays || []}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}

