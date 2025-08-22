'use client'

import Link from 'next/link'
import { AuthSection } from './auth-section'
import { ROUTES_DOMAIN, NAVIGATION_DOMAIN } from '@/lib/constants'

export function Header() {
  return (
    <header className="glass-card sticky top-0 z-50 hidden md:block" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <div className="container mx-auto px-4 h-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES_DOMAIN.PAGES.HOME} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">A</span>
          </div>
          <span className="font-bold text-xl">Aniwa</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {NAVIGATION_DOMAIN.MENU.HEADER_NAVIGATION_ITEMS.map((item) => (
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
