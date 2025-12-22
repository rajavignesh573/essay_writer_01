'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from './Navbar'
import { Loader2, Download, Copy, Check } from 'lucide-react'

interface EssayWriterProps {
  initialCredits: number
}

export default function EssayWriter({ initialCredits }: EssayWriterProps) {
  const [prompt, setPrompt] = useState('')
  const [essay, setEssay] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [credits, setCredits] = useState(initialCredits)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [essayId, setEssayId] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    if (credits < 1) {
      setError('Insufficient credits. Please purchase a subscription.')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate essay')
      }

      setEssay(data.essay.content)
      setEssayId(data.essay.id)
      setCredits(data.credits)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!essayId || !essay.trim()) return

    try {
      await fetch('/api/update-essay', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: essayId, content: essay }),
      })
    } catch (err) {
      console.error('Failed to save essay:', err)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(essay)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([essay], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `essay-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Prevent copy on the entire page except editor
  if (typeof window !== 'undefined') {
    document.addEventListener('copy', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.editor-select')) {
        e.preventDefault()
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 no-select">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Generate Essay</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Essay Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your essay prompt here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={4}
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || credits < 1}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                `Generate Essay (1 Credit)`
              )}
            </button>
          </div>
        </div>

        {essay && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Essay</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 editor-select resize-none min-h-[400px]"
              placeholder="Your generated essay will appear here..."
            />
          </div>
        )}
      </div>
    </div>
  )
}

