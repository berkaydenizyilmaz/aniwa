'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileAuthSection } from './mobile-auth-section';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Home, Film, List } from 'lucide-react';

export function MobileBottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/30 backdrop-blur-md border-t border-border/20 shadow-xl">
      <div className="flex items-center justify-around px-2 py-3">
        {/* Ana Sayfa */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="flex-1 h-14 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          <Link href={ROUTES.PAGES.HOME}>
            <Home className="h-6 w-6" />
          </Link>
        </Button>

        {/* Anime */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="flex-1 h-14 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          <Link href={ROUTES.PAGES.ANIME}>
            <Film className="h-6 w-6" />
          </Link>
        </Button>

        {/* Listeler */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="flex-1 h-14 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          <Link href={ROUTES.PAGES.LISTS}>
            <List className="h-6 w-6" />
          </Link>
        </Button>

        {/* Auth Section */}
        <MobileAuthSection />
      </div>
    </nav>
  );
} 