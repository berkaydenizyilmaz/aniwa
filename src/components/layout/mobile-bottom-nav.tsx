'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { AuthSection } from './auth-section';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Home, Film, List } from 'lucide-react';

export function MobileBottomNav() {
  const { data: session, status } = useSession();

  // Loading durumu
  if (status === 'loading') {
    return (
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
          <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
          <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
          <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  // Giriş yapmamış kullanıcı
  if (!session) {
    return (
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
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
            <Link href="/anime">
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
            <Link href="/lists">
              <List className="h-6 w-6 text-secondary-foreground" />
            </Link>
          </Button>

          {/* Auth Section */}
          <AuthSection variant="mobile" />
        </div>
      </nav>
    );
  }

  // Giriş yapmış kullanıcı
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {/* Ana Sayfa */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="flex-1 h-12"
        >
          <Link href={ROUTES.PAGES.HOME}>
            <Home className="h-6 w-6 text-card-foreground" />
          </Link>
        </Button>

        {/* Anime */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="flex-1 h-12"
        >
          <Link href="/anime">
            <Film className="h-6 w-6 text-card-foreground" />
          </Link>
        </Button>

        {/* Listeler */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="flex-1 h-12"
        >
          <Link href="/lists">
            <List className="h-6 w-6 text-card-foreground" />
          </Link>
        </Button>

        {/* Auth Section */}
        <AuthSection variant="mobile" />
      </div>
    </nav>
  );
} 