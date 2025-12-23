'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, History, CreditCard, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number>(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!mounted) return

        setUser(user)

        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('id', user.id)
            .single()
          if (mounted && profile) setCredits(profile.credits)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    getUser()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        if (session?.user) {
          supabase
            .from('user_profiles')
            .select('credits')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (mounted && profile) setCredits(profile.credits)
            })
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Essay Writer
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                Write
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              >
                <History className="w-4 h-4 mr-1.5" />
                History
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              >
                Blog
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              >
                <CreditCard className="w-4 h-4 mr-1.5" />
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-100">
              <span className="text-sm font-medium text-indigo-700">Credits:</span>
              <span className="text-sm font-bold text-indigo-900 bg-white px-2 py-0.5 rounded-full">{credits}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

