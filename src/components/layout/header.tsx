'use client';

import Link from 'next/link';
import { AuthSection } from './auth-section';
import { MobileBottomNav } from './mobile-bottom-nav';
import { ROUTES } from '@/lib/constants/routes.constants';

export function Header() {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Desktop Header */}
      <header className="hidden sm:block border-b border-border/30 shadow-sm bg-secondary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link 
                href={ROUTES.PAGES.HOME} 
                className="text-2xl font-bold text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10 px-2 py-1 rounded transition-all duration-200"
              >
                Aniwa
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link 
                href={ROUTES.PAGES.HOME} 
                className="text-sm font-semibold text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10 px-3 py-2 rounded transition-all duration-200"
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/anime" 
                className="text-sm font-semibold text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10 px-3 py-2 rounded transition-all duration-200"
              >
                Anime
              </Link>
              <Link 
                href="/lists" 
                className="text-sm font-semibold text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10 px-3 py-2 rounded transition-all duration-200"
              >
                Listeler
              </Link>
            </nav>

            {/* Auth Section */}
            <AuthSection />
          </div>
        </div>
      </header>
    </>
  );
} 