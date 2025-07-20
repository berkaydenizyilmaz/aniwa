'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-xl font-bold hover:text-primary">
              Aniwa
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm hover:text-primary">
              Ana Sayfa
            </Link>
            <Link href="/anime" className="text-sm hover:text-primary">
              Anime
            </Link>
            <Link href="/lists" className="text-sm hover:text-primary">
              Listeler
            </Link>
          </nav>

          {/* Auth & Theme */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {status === 'loading' ? (
              <div className="text-sm text-muted-foreground">Yükleniyor...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Merhaba, {session.user.username}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Çıkış
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/giris">Giriş</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/kayit">Kayıt Ol</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 