'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true'

function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-vesta-cream flex items-center justify-center px-6">
      <div className="max-w-lg text-center animate-fade-up">
        <div className="w-14 h-14 bg-vesta-charcoal rounded-sm flex items-center justify-center mx-auto mb-8">
          <span className="text-vesta-cream font-serif text-2xl">V</span>
        </div>
        <p className="text-vesta-bronze font-medium text-sm tracking-widest uppercase mb-4">
          Coming Soon
        </p>
        <h1 className="font-serif text-5xl text-vesta-charcoal leading-tight mb-6">
          Vesta Designer Hub
        </h1>
        <p className="text-vesta-muted text-lg leading-relaxed mb-8">
          A new home for designer tools, project resources, and team collaboration.
          We&apos;re putting the finishing touches on something great.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-vesta-warm rounded-full">
          <div className="w-2 h-2 bg-vesta-sage rounded-full animate-pulse" />
          <span className="text-sm text-vesta-muted">Launching soon at vestahome.design</span>
        </div>
        <footer className="mt-24">
          <span className="text-xs text-vesta-muted">&copy; {new Date().getFullYear()} Vesta Home</span>
        </footer>
      </div>
    </div>
  )
}

function LoginScreen({ onSignIn }) {
  return (
    <div className="min-h-screen bg-vesta-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full animate-fade-up">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-vesta-charcoal rounded-sm flex items-center justify-center mx-auto mb-6">
            <span className="text-vesta-cream font-serif text-2xl">V</span>
          </div>
          <h1 className="font-serif text-3xl text-vesta-charcoal mb-2">Vesta Designer Hub</h1>
          <p className="text-vesta-muted">Sign in to access tools and resources</p>
        </div>

        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-vesta-border rounded-lg hover:border-vesta-bronze hover:shadow-md transition-all duration-200 text-vesta-charcoal font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-xs text-vesta-muted">
          Use your Vesta Home Google Workspace account to sign in
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (isComingSoon) {
      setLoading(false)
      return
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (isComingSoon) return <ComingSoonPage />

  if (loading) {
    return (
      <div className="min-h-screen bg-vesta-cream flex items-center justify-center">
        <div className="w-8 h-8 bg-vesta-charcoal rounded-sm flex items-center justify-center animate-pulse">
          <span className="text-vesta-cream font-serif text-sm">V</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onSignIn={handleSignIn} />
  }

  return (
    <div className="min-h-screen bg-vesta-cream">
      {/* Header */}
      <header className="border-b border-vesta-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-vesta-charcoal rounded-sm flex items-center justify-center">
              <span className="text-vesta-cream font-serif text-sm">V</span>
            </div>
            <span className="font-serif text-xl text-vesta-charcoal">Vesta Designer Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-vesta-muted">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-vesta-muted hover:text-vesta-charcoal transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="py-16 animate-fade-up">
          <p className="text-vesta-bronze font-medium text-sm tracking-widest uppercase mb-4">
            Designer Hub
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-vesta-charcoal leading-tight mb-4">
            Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}.
          </h1>
          <p className="text-vesta-muted text-lg max-w-xl leading-relaxed">
            Your central workspace for project completion, design resources, and team tools.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {/* Project Close Form */}
          <Link href="/project-close" className="group animate-fade-up-delay-1">
            <div className="border border-vesta-border rounded-lg p-8 hover:border-vesta-bronze hover:shadow-lg transition-all duration-300 bg-white h-full">
              <div className="w-12 h-12 bg-vesta-bronze bg-opacity-10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-20 transition-colors">
                <svg className="w-6 h-6 text-vesta-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-vesta-charcoal mb-2">Project Close Form</h3>
              <p className="text-vesta-muted text-sm leading-relaxed">
                Complete your project debrief. Covers design, install operations, procurement, and photography.
              </p>
              <div className="mt-6 flex items-center gap-2 text-vesta-bronze text-sm font-medium">
                <span>Start form</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* My Submissions */}
          <Link href="/my-submissions" className="group animate-fade-up-delay-1">
            <div className="border border-vesta-border rounded-lg p-8 hover:border-vesta-bronze hover:shadow-lg transition-all duration-300 bg-white h-full">
              <div className="w-12 h-12 bg-vesta-sage bg-opacity-15 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-25 transition-colors">
                <svg className="w-6 h-6 text-vesta-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-vesta-charcoal mb-2">My Submissions</h3>
              <p className="text-vesta-muted text-sm leading-relaxed">
                Review your previously submitted project close forms and their details.
              </p>
              <div className="mt-6 flex items-center gap-2 text-vesta-sage text-sm font-medium">
                <span>View history</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Vesta Design Studio (Eames) */}
          <a
            href="https://new-eames.byshowroom.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group animate-fade-up-delay-2"
          >
            <div className="border border-vesta-border rounded-lg p-8 hover:border-vesta-bronze hover:shadow-lg transition-all duration-300 bg-white h-full">
              <div className="w-12 h-12 bg-vesta-charcoal bg-opacity-[0.07] rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-[0.12] transition-colors">
                <svg className="w-6 h-6 text-vesta-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-vesta-charcoal mb-2">Vesta Design Studio</h3>
              <p className="text-vesta-muted text-sm leading-relaxed">
                Access staging tools, design plans, and inventory management.
              </p>
              <div className="mt-6 flex items-center gap-2 text-vesta-charcoal text-sm font-medium">
                <span>Open Design Studio</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>

          {/* Placeholder - Design Library */}
          <div className="animate-fade-up-delay-3">
            <div className="border border-dashed border-vesta-border rounded-lg p-8 opacity-50 h-full">
              <div className="w-12 h-12 bg-vesta-warm rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-vesta-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-vesta-charcoal mb-2">Design Library</h3>
              <p className="text-vesta-muted text-sm leading-relaxed">
                Browse curated mood boards, style guides, and design references.
              </p>
              <div className="mt-6 text-vesta-muted text-sm">Coming soon</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-vesta-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm text-vesta-muted">&copy; {new Date().getFullYear()} Vesta Home</span>
          <span className="text-xs text-vesta-muted">vestahome.design</span>
        </div>
      </footer>
    </div>
  )
}
