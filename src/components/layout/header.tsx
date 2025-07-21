'use client';

import Link from 'next/link';
import { AuthSection } from './auth-section';
import { ROUTES } from '@/lib/constants/routes.constants';

export function Header() {
  return (
    <header className="border-b border-border/30 shadow-sm bg-secondary">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link 
              href={ROUTES.PAGES.HOME} 
              className="text-2xl font-bold text-secondary-foreground hover:text-secondary-foreground/80 transition-all duration-200"
            >
              Aniwa
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href={ROUTES.PAGES.HOME} 
              className="text-sm font-semibold text-secondary-foreground hover:text-secondary-foreground/80 transition-colors duration-200"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/anime" 
              className="text-sm font-semibold text-secondary-foreground hover:text-secondary-foreground/80 transition-colors duration-200"
            >
              Anime
            </Link>
            <Link 
              href="/lists" 
              className="text-sm font-semibold text-secondary-foreground hover:text-secondary-foreground/80 transition-colors duration-200"
            >
              Listeler
            </Link>
          </nav>

          {/* Auth Section */}
          <AuthSection />
        </div>
      </div>
    </header>
  );
} 