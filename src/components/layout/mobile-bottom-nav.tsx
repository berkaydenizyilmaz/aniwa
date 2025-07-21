'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthSection } from './auth-section';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Home, Film, List } from 'lucide-react';

export function MobileBottomNav() {

  // Navigation items (her iki durumda da aynı)
  const navigationItems = (
    <>
      {/* Ana Sayfa */}
      <Button 
        variant="ghost" 
        size="icon" 
        asChild
        className="flex-1 h-12"
      >
        <Link href={ROUTES.PAGES.HOME}>
          <Home className="h-6 w-6 text-secondary-foreground" />
        </Link>
      </Button>

      {/* Anime */}
      <Button 
        variant="ghost" 
        size="icon" 
        asChild
        className="flex-1 h-12"
      >
        <Link href={ROUTES.PAGES.ANIME}>
          <Film className="h-6 w-6 text-secondary-foreground" />
        </Link>
      </Button>

      {/* Listeler */}
      <Button 
        variant="ghost" 
        size="icon" 
        asChild
        className="flex-1 h-12"
      >
        <Link href={ROUTES.PAGES.LISTS}>
          <List className="h-6 w-6 text-secondary-foreground" />
        </Link>
      </Button>

      {/* Auth Section */}
      <AuthSection variant="mobile" />
    </>
  );

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems}
      </div>
    </nav>
  );
} 