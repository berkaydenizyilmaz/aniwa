'use client'

import Link from 'next/link'
import { AuthSection } from './auth-section'
import { ROUTES } from '@/lib/constants/routes.constants'

const navigationItems = [
  { label: 'Anime', href: ROUTES.PAGES.ANIME },
  { label: 'Listeler', href: ROUTES.PAGES.LISTS },
]

export function Header() {
  return (
    <header className="glass-card border-b sticky top-0 z-50 hidden md:block">
      <div className="container mx-auto px-4 h-10 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.PAGES.HOME} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">A</span>
          </div>
          <span className="font-bold text-xl">Aniwa</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link 
              key={item.label}
              href={item.href} 
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <AuthSection />
      </div>
    </header>
  )
}