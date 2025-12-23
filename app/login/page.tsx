'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  // Get the site URL dynamically - always use current origin to support multiple domains
  // This ensures OAuth redirects work correctly for both vercel.app and custom domains
  const siteUrl = useMemo(
    () => {
      if (typeof window !== 'undefined') {
        return window.location.origin
      }
      // Fallback for SSR (shouldn't happen in client component, but just in case)
      return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    },
    []
  )

  useEffect(() => {
    setMounted(true)
    let isMounted = true

    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (isMounted && user) {
          router.replace('/dashboard')
        }
      } catch (error) {
        console.error('Error checking user:', error)
      }
    }
    
    checkUser()

    return () => {
      isMounted = false
    }
  }, [supabase, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Essay Writer
          </h1>
          <p className="text-lg text-gray-600">Sign in to start writing amazing essays</p>
        </div>
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4f46e5',
                    brandAccent: '#4338ca',
                  },
                },
              },
            }}
            providers={['google']}
            redirectTo={`${siteUrl}/auth/callback?next=/dashboard`}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

