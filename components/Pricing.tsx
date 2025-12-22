'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import { Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (planType: 'monthly' | 'annual') => {
    setLoading(planType)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Get unlimited essay generation with our flexible plans</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Plan</h2>
              <div className="text-4xl font-bold text-indigo-600 mb-1">$19</div>
              <p className="text-gray-500">per month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">20 essay credits per month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Unlimited essay history</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Edit and download essays</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Cancel anytime</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading !== null}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading === 'monthly' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe Monthly'
              )}
            </button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-indigo-500 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Best Value
              </span>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Annual Plan</h2>
              <div className="text-4xl font-bold text-indigo-600 mb-1">$190</div>
              <p className="text-gray-500">per year</p>
              <p className="text-sm text-green-600 font-medium mt-2">Save $38 per year</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">300 essay credits total</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Unlimited essay history</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Edit and download essays</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">One-time payment</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={loading !== null}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading === 'annual' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy Annual Plan'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

