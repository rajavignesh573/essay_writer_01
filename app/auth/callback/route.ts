import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  // Use the current request origin to ensure redirects stay on the same domain
  const origin = requestUrl.origin

  if (code) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    // If exchange was successful, redirect to dashboard on the same domain
    if (data.session) {
      return NextResponse.redirect(new URL(next, origin))
    }
    
    // If there was an error, redirect to login on the same domain
    if (error) {
      return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
    }
  }

  // Fallback redirect - use the same domain
  return NextResponse.redirect(new URL(next, origin))
}

