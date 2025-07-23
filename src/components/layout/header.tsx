'use client'

import Link from 'next/link'
import { AuthSection } from './auth-section'
import { ROUTES } from '@/lib/constants/routes.constants'

export function Header() {
  return (
    <header className="glass-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.PAGES.HOME} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl">Aniwa</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href={ROUTES.PAGES.ANIME} className="text-muted-foreground hover:text-foreground transition-colors">
            Anime
          </Link>
          <Link href={ROUTES.PAGES.LISTS} className="text-muted-foreground hover:text-foreground transition-colors">
            Listeler
          </Link>
          <Link href={ROUTES.PAGES.PROFILE} className="text-muted-foreground hover:text-foreground transition-colors">
            Profil
          </Link>
        </nav>

        {/* Auth Section */}
        <AuthSection />
      </div>
    </header>
  )
}