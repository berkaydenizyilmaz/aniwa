'use client';

import Link from 'next/link';
import { HeaderAuthSection } from './header-auth-section';
import { MobileBottomNav } from './mobile-bottom-nav';
import { ROUTES } from '@/lib/constants/routes.constants';

export function Header() {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Desktop Header */}
      <header className="hidden sm:block border-b border-border/40 bg-card/50 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link 
                href={ROUTES.PAGES.HOME} 
                className="text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-200 group"
              >
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-accent/80 transition-all duration-200">
                  Aniwa
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <Link 
                href={ROUTES.PAGES.HOME} 
                className="nav-item"
              >
                Ana Sayfa
              </Link>
              <Link 
                href={ROUTES.PAGES.ANIME} 
                className="nav-item"
              >
                Anime
              </Link>
              <Link 
                href={ROUTES.PAGES.LISTS} 
                className="nav-item"
              >
                Listeler
              </Link>
            </nav>

            {/* Auth Section */}
            <HeaderAuthSection />
          </div>
        </div>
      </header>
    </>
  );
}