import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logError } from '@/lib/utils/errors'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const errorParam = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Use the current request origin to ensure redirects stay on the same domain
  const origin = requestUrl.origin

  // If there's an error from OAuth provider, log it and redirect
  if (errorParam) {
    logError(new Error(`OAuth error: ${errorParam} - ${errorDescription}`), {
      endpoint: '/auth/callback',
      error: errorParam,
      errorDescription,
      origin,
    })
    return NextResponse.redirect(new URL(`/login?error=${errorParam}&description=${encodeURIComponent(errorDescription || '')}`, origin))
  }

  if (code) {
    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      // If exchange was successful, redirect to dashboard on the same domain
      if (data?.session) {
        return NextResponse.redirect(new URL(next, origin))
      }
      
      // If there was an error, log it and redirect to login
      if (error) {
        logError(error, {
          endpoint: '/auth/callback',
          action: 'exchange_code_for_session',
          code: code.substring(0, 10) + '...', // Log partial code for debugging
          origin,
        })
        
        // Provide more specific error message
        const errorMessage = error.message || 'authentication_failed'
        return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, origin))
      }
    } catch (err) {
      logError(err, {
        endpoint: '/auth/callback',
        action: 'callback_processing',
        origin,
      })
      return NextResponse.redirect(new URL('/login?error=unexpected_error', origin))
    }
  }

  // If no code and no error, redirect to login
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', origin))
  }

  // Fallback redirect - use the same domain
  return NextResponse.redirect(new URL(next, origin))
}

