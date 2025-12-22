'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from './Navbar'
import { Loader2, Download, Copy, Check, FileText } from 'lucide-react'

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

  const handleGenerate = useCallback(async () => {
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
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate essay')
      }

      setEssay(data.essay.content)
      setEssayId(data.essay.id)
      setCredits(data.credits)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, credits])

  const handleSave = useCallback(async () => {
    if (!essayId || !essay.trim()) return

    try {
      const response = await fetch('/api/update-essay', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: essayId, content: essay }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save essay')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save essay. Please try again.')
    }
  }, [essayId, essay])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(essay)
      setCopied(true)
      const timeoutId = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeoutId)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }, [essay])

  const handleDownload = useCallback(() => {
    const blob = new Blob([essay], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `essay-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [essay])

  // Prevent copy on the entire page except editor (with cleanup)
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.editor-select')) {
        e.preventDefault()
      }
    }

    document.addEventListener('copy', handleCopy)
    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 no-select">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Generate Essay
            </h1>
          </div>
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
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:transform-none"
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Essay
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
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

