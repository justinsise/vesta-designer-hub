'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  return (
    <header className="border-b border-vesta-border bg-white bg-opacity-80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-vesta-charcoal rounded-sm flex items-center justify-center">
            <span className="text-vesta-cream font-serif text-xs">V</span>
          </div>
          <span className="font-serif text-lg text-vesta-charcoal">Vesta Designer Hub</span>
        </Link>
        {user && (
          <span className="text-xs text-vesta-muted">{user.email}</span>
        )}
      </div>
    </header>
  )
}
