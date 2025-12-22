'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import { format } from 'date-fns'
import { Download, Edit, Copy, Check, ChevronLeft, ChevronRight, History } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Essay {
  id: string
  prompt: string
  content: string
  created_at: string
  updated_at: string
}

interface EssayHistoryProps {
  essays: Essay[]
  currentPage?: number
  totalPages?: number
}

export default function EssayHistory({
  essays,
  currentPage = 1,
  totalPages = 1,
}: EssayHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = (content: string, prompt: string, date: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `essay-${format(new Date(date), 'yyyy-MM-dd')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEdit = (essay: Essay) => {
    setEditingId(essay.id)
    setEditedContent({ [essay.id]: essay.content })
  }

  const handleSave = async (id: string) => {
    try {
      const response = await fetch('/api/update-essay', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content: editedContent[id] }),
      })

      if (response.ok) {
        setEditingId(null)
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedContent({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 no-select">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <History className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Essay History
          </h1>
        </div>
        {essays.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No essays yet. Start writing your first essay!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {essays.map((essay) => (
              <div key={essay.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{essay.prompt}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {format(new Date(essay.created_at), 'PPp')}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {editingId === essay.id ? (
                      <>
                        <button
                          onClick={() => handleSave(essay.id)}
                          className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(essay)}
                          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleCopy(essay.content, essay.id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {copiedId === essay.id ? (
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
                          onClick={() => handleDownload(essay.content, essay.prompt, essay.created_at)}
                          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingId === essay.id ? (
                  <textarea
                    value={editedContent[essay.id] || ''}
                    onChange={(e) =>
                      setEditedContent({ ...editedContent, [essay.id]: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 editor-select resize-none min-h-[300px]"
                  />
                ) : (
                  <div className="prose max-w-none editor-select">
                    <p className="text-gray-700 whitespace-pre-wrap">{essay.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <Link
              href={`/history?page=${Math.max(1, currentPage - 1)}`}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Link>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={`/history?page=${Math.min(totalPages, currentPage + 1)}`}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

