'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileAuthSection } from '../auth';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Home, Film, List } from 'lucide-react';

export function MobileBottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/30 backdrop-blur-md border-t border-border/20 shadow-xl">
      <div className="flex items-stretch h-14">
        {/* Ana Sayfa */}
        <Button 
          variant="mobile" 
          asChild
          className="flex-1 h-full rounded-none border-r border-border/20"
        >
          <Link href={ROUTES.PAGES.HOME} className="flex items-center justify-center h-full">
            <Home className="h-5 w-5 stroke-[1.5]" />
          </Link>
        </Button>

        {/* Anime */}
        <Button 
          variant="mobile" 
          asChild
          className="flex-1 h-full rounded-none border-r border-border/20"
        >
          <Link href={ROUTES.PAGES.ANIME} className="flex items-center justify-center h-full">
            <Film className="h-5 w-5 stroke-[1.5]" />
          </Link>
        </Button>

        {/* Listeler */}
        <Button 
          variant="mobile" 
          asChild
          className="flex-1 h-full rounded-none border-r border-border/20"
        >
          <Link href={ROUTES.PAGES.LISTS} className="flex items-center justify-center h-full">
            <List className="h-5 w-5 stroke-[1.5]" />
          </Link>
        </Button>

        {/* Auth Section */}
        <MobileAuthSection />
      </div>
    </nav>
  );
} 