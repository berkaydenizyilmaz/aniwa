'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileAuthSection } from './mobile-auth-section';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Home, Film, List } from 'lucide-react';

export function MobileBottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/30 backdrop-blur-md border-t border-border/20 shadow-xl">
      <div className="flex items-center h-14">
        {/* Ana Sayfa */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="nav-item-mobile nav-item-mobile-border rounded-none"
        >
          <Link href={ROUTES.PAGES.HOME}>
            <Home className="icon-nav" />
          </Link>
        </Button>

        {/* Anime */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="nav-item-mobile nav-item-mobile-border rounded-none"
        >
          <Link href={ROUTES.PAGES.ANIME}>
            <Film className="icon-nav" />
          </Link>
        </Button>

        {/* Listeler */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="nav-item-mobile nav-item-mobile-border rounded-none"
        >
          <Link href={ROUTES.PAGES.LISTS}>
            <List className="icon-nav" />
          </Link>
        </Button>

        {/* Auth Section */}
        <MobileAuthSection />
      </div>
    </nav>
  );
} 