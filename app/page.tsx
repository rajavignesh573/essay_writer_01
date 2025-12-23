import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Zap, Shield, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { seoConfig } from '@/lib/seo/config'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'

export const metadata: Metadata = {
  title: 'Essay Writer - AI-Powered Essay Generation | Professional Writing Assistant',
  description: 'Generate high-quality, well-structured essays instantly with AI. Perfect for students and professionals. Start with 2 free credits. Powered by GPT-4o-mini for exceptional writing quality.',
  keywords: [
    'essay writer',
    'AI essay generator',
    'writing assistant',
    'essay help',
    'academic writing',
    'essay writing tool',
    'AI writing',
    'essay generator free',
    'online essay writer',
  ],
  openGraph: {
    title: 'Essay Writer - AI-Powered Essay Generation',
    description: 'Generate high-quality, well-structured essays instantly with AI. Perfect for students and professionals. Start with 2 free credits.',
    url: baseUrl,
    siteName: 'Essay Writer',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Essay Writer - AI-Powered Essay Generation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essay Writer - AI-Powered Essay Generation',
    description: 'Generate high-quality essays instantly with AI. Start with 2 free credits.',
    images: [`${baseUrl}/opengraph-image`],
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Show landing page to unauthenticated users

  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: seoConfig.organization.name,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: baseUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Start with 2 free credits',
    },
    ...(seoConfig.ratings.useRealData && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: seoConfig.ratings.value.toString(),
        ratingCount: seoConfig.ratings.count.toString(),
      },
    }),
    description: 'AI-powered essay writing tool that generates high-quality, well-structured essays instantly.',
    featureList: [
      'AI-Powered Essay Generation',
      'High-Quality Writing',
      'Secure & Private',
      'Edit & Download',
    ],
    screenshot: `${baseUrl}/opengraph-image`,
  }

  // Organization Structured Data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.organization.name,
    url: seoConfig.organization.url,
    logo: seoConfig.organization.logo,
    description: 'AI-powered essay writing tool for students and professionals',
    ...(seoConfig.social.twitter && {
      sameAs: [
        ...(seoConfig.social.twitter ? [`https://twitter.com/${seoConfig.social.twitter.replace('@', '')}`] : []),
        ...(seoConfig.social.facebook ? [seoConfig.social.facebook] : []),
        ...(seoConfig.social.linkedin ? [seoConfig.social.linkedin] : []),
        ...(seoConfig.social.instagram ? [`https://instagram.com/${seoConfig.social.instagram.replace('@', '')}`] : []),
      ].filter(Boolean),
    }),
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Essay Writer
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/blog"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                prefetch={true}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Writing Assistant</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Write Essays with
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Generate high-quality, well-structured essays in seconds. Perfect for students,
              professionals, and anyone who needs polished writing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                prefetch={true}
                className="group px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Start Writing Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                prefetch={true}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              ✨ Start with <span className="font-semibold text-indigo-600">2 free credits</span> - No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Write Better
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create exceptional essays effortlessly
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate complete essays in seconds, not hours. Get your work done faster.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">High Quality</h3>
              <p className="text-gray-600">
                Powered by GPT-4o-mini, ensuring well-structured, coherent, and professional essays.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your essays are encrypted and stored securely. Your privacy is our priority.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Edit & Download</h3>
              <p className="text-gray-600">
                Customize your essays, save them, and download in your preferred format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up Free</h3>
              <p className="text-gray-600">
                Create your account with Google OAuth. Get 2 free credits instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enter Your Prompt</h3>
              <p className="text-gray-600">
                Simply type your essay topic or question. Our AI does the rest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Essay</h3>
              <p className="text-gray-600">
                Receive a complete, well-structured essay ready to use or customize.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-1">$19</div>
              <p className="text-gray-600 mb-6">per month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">20 essay credits per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited essay history</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Cancel anytime</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="p-8 rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 relative hover:shadow-xl transition-all">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-1">$190</div>
              <p className="text-gray-600 mb-6">per year</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">300 essay credits total</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Save $38 per year</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">One-time payment</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Writing?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students and professionals who trust Essay Writer for their writing needs.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Start Writing Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Essay Writer</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/login" prefetch={true} className="hover:text-white transition-colors">
                Login
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Essay Writer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

