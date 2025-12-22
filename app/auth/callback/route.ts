import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    // If exchange was successful, redirect to dashboard
    if (data.session) {
      return NextResponse.redirect(new URL(next, request.url))
    }
    
    // If there was an error, redirect to login
    if (error) {
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL(next, request.url))
}

