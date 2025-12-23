import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'

// Sample blog posts data - replace with real data from your CMS or database
const blogPosts: Record<string, { title: string; date: string; content: string }> = {
  'how-to-write-perfect-essay': {
    title: 'How to Write a Perfect Essay: A Step-by-Step Guide',
    date: '2024-01-15',
    content: `
      <p>Writing a perfect essay requires careful planning, clear structure, and attention to detail. In this comprehensive guide, we'll walk you through the essential steps to craft an essay that impresses your readers.</p>
      
      <h2>1. Understand the Assignment</h2>
      <p>Before you start writing, make sure you fully understand the assignment requirements. Pay attention to the topic, word count, formatting style, and deadline.</p>
      
      <h2>2. Research and Gather Information</h2>
      <p>Conduct thorough research on your topic. Use credible sources such as academic journals, books, and reputable websites. Take notes and organize your findings.</p>
      
      <h2>3. Create an Outline</h2>
      <p>An outline helps you organize your thoughts and ensures your essay flows logically. Include your main points, supporting evidence, and conclusion.</p>
      
      <h2>4. Write the Introduction</h2>
      <p>Start with a hook to grab the reader's attention, provide background information, and end with a clear thesis statement.</p>
      
      <h2>5. Develop Body Paragraphs</h2>
      <p>Each body paragraph should focus on a single main idea, supported by evidence and examples. Use transitions to connect your ideas smoothly.</p>
      
      <h2>6. Write the Conclusion</h2>
      <p>Summarize your main points, restate your thesis in a new way, and leave the reader with a lasting impression.</p>
      
      <h2>7. Revise and Edit</h2>
      <p>Review your essay for clarity, coherence, and correctness. Check for grammar, spelling, and punctuation errors. Consider using AI writing tools to enhance your work.</p>
    `,
  },
  'common-essay-writing-mistakes': {
    title: '10 Common Essay Writing Mistakes to Avoid',
    date: '2024-01-10',
    content: `
      <p>Even experienced writers make mistakes. Here are the most common essay writing errors and how to avoid them:</p>
      
      <h2>1. Not Following the Prompt</h2>
      <p>Always read the assignment carefully and ensure you're addressing all requirements.</p>
      
      <h2>2. Weak Thesis Statement</h2>
      <p>Your thesis should be clear, specific, and arguable. Avoid vague or overly broad statements.</p>
      
      <h2>3. Poor Organization</h2>
      <p>Structure your essay logically with clear introduction, body, and conclusion sections.</p>
      
      <h2>4. Lack of Evidence</h2>
      <p>Support your arguments with credible evidence, examples, and citations.</p>
      
      <h2>5. Plagiarism</h2>
      <p>Always cite your sources properly and use your own words when paraphrasing.</p>
      
      <h2>6. Grammar and Spelling Errors</h2>
      <p>Proofread carefully or use grammar checking tools to catch mistakes.</p>
      
      <h2>7. Inconsistent Tone</h2>
      <p>Maintain a consistent academic tone throughout your essay.</p>
      
      <h2>8. Weak Transitions</h2>
      <p>Use transition words and phrases to connect your ideas smoothly.</p>
      
      <h2>9. Ignoring Word Count</h2>
      <p>Stay within the specified word count range. Too short or too long essays can lose points.</p>
      
      <h2>10. Not Revising</h2>
      <p>Always revise and edit your work before submitting. First drafts are rarely perfect.</p>
    `,
  },
  'ai-in-academic-writing': {
    title: 'The Power of AI in Academic Writing',
    date: '2024-01-05',
    content: `
      <p>Artificial Intelligence is revolutionizing the way we approach academic writing. Here's how AI tools can enhance your essay writing process:</p>
      
      <h2>Benefits of AI Writing Tools</h2>
      <p>AI writing assistants can help you:</p>
      <ul>
        <li>Generate ideas and outlines</li>
        <li>Improve grammar and style</li>
        <li>Enhance clarity and coherence</li>
        <li>Save time on research and writing</li>
      </ul>
      
      <h2>Maintaining Academic Integrity</h2>
      <p>While AI tools are helpful, it's important to use them ethically. Always:</p>
      <ul>
        <li>Review and edit AI-generated content</li>
        <li>Add your own insights and analysis</li>
        <li>Cite sources properly</li>
        <li>Follow your institution's guidelines</li>
      </ul>
      
      <h2>The Future of Writing</h2>
      <p>AI is here to stay. Learning to work with AI tools effectively will give you a competitive edge in academic and professional writing.</p>
    `,
  },
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Essay Writer Blog`,
    description: `Read our article: ${post.title}`,
    openGraph: {
      title: post.title,
      description: `Read our article: ${post.title}`,
      url: `${baseUrl}/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${params.slug}`,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none bg-white rounded-xl shadow-sm p-8 border border-gray-200"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}

