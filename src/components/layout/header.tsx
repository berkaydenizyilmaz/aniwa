'use client';

import Link from 'next/link';
import { AuthSection } from './auth-section';
import { MobileBottomNav } from './mobile-bottom-nav';
import { ROUTES } from '@/lib/constants/routes.constants';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Desktop Header */}
      <header className="hidden sm:block border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href={ROUTES.PAGES.HOME} 
                className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-accent/10"
              >
                Aniwa
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <NavLink href={ROUTES.PAGES.HOME}>Ana Sayfa</NavLink>
              <NavLink href={ROUTES.PAGES.ANIME}>Anime</NavLink>
              <NavLink href={ROUTES.PAGES.LISTS}>Listeler</NavLink>
            </nav>

            {/* Auth Section */}
            <AuthSection />
          </div>
        </div>
      </header>
    </>
  );
}

// Navigasyon linklerini ayrı bir bileşen olarak çıkardık
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "text-sm font-medium text-muted-foreground hover:text-foreground",
        "px-3 py-2 rounded-md transition-colors duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {children}
    </Link>
  );
}