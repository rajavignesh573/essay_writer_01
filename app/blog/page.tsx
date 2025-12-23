import Link from 'next/link'
import { FileText, Calendar, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'

export const metadata: Metadata = {
  title: 'Blog - Essay Writing Tips & Guides',
  description: 'Learn how to write better essays with our comprehensive guides, tips, and tutorials. Expert advice on essay writing, academic writing, and AI-powered writing tools.',
  keywords: [
    'essay writing tips',
    'how to write an essay',
    'essay writing guide',
    'academic writing',
    'essay structure',
    'writing tutorials',
  ],
  openGraph: {
    title: 'Blog - Essay Writing Tips & Guides',
    description: 'Learn how to write better essays with our comprehensive guides and tutorials.',
    url: `${baseUrl}/blog`,
    siteName: 'Essay Writer',
    type: 'website',
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
}

// Sample blog posts - replace with real data from your CMS or database
const blogPosts = [
  {
    id: 1,
    title: 'How to Write a Perfect Essay: A Step-by-Step Guide',
    excerpt: 'Learn the essential steps to craft a well-structured essay that impresses your readers.',
    date: '2024-01-15',
    slug: 'how-to-write-perfect-essay',
  },
  {
    id: 2,
    title: '10 Common Essay Writing Mistakes to Avoid',
    excerpt: 'Discover the most frequent mistakes students make and how to avoid them in your writing.',
    date: '2024-01-10',
    slug: 'common-essay-writing-mistakes',
  },
  {
    id: 3,
    title: 'The Power of AI in Academic Writing',
    excerpt: 'Explore how AI writing tools can enhance your essay writing process while maintaining authenticity.',
    date: '2024-01-05',
    slug: 'ai-in-academic-writing',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Essay Writing Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert tips, guides, and tutorials to help you write better essays
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                >
                  Read more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            More articles coming soon! Check back regularly for new content.
          </p>
        </div>
      </div>
    </div>
  )
}

