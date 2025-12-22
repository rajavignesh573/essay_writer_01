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
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('credits')
          .eq('id', user.id)
          .single()
        if (profile) setCredits(profile.credits)
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center px-2 py-2 text-xl font-bold text-indigo-600">
              Essay Writer
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                <FileText className="w-4 h-4 mr-1" />
                Write
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
              >
                <History className="w-4 h-4 mr-1" />
                History
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-indigo-700">Credits:</span>
              <span className="text-sm font-bold text-indigo-900">{credits}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

