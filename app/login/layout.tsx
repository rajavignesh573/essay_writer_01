import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Essay Writer',
  description: 'Sign in to start writing amazing essays with AI. Get 2 free credits to start.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
