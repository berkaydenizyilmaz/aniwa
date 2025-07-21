'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ROUTES } from '@/lib/constants/routes.constants';
import { toastSuccess, toastError, toastWarning, toastInfo } from '@/components/ui/toast';

export function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME });
  };

  return (
    <header className="border-b border-gray-200/30 shadow-sm bg-secondary">
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
            
            {/* Toast Test Buttons */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toastSuccess('Başarılı!', 'Bu bir başarı mesajıdır')}
                className="text-xs"
              >
                Success
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toastError('Hata!', 'Bu bir hata mesajıdır')}
                className="text-xs"
              >
                Error
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toastWarning('Uyarı!', 'Bu bir uyarı mesajıdır')}
                className="text-xs"
              >
                Warning
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toastInfo('Bilgi', 'Bu bir bilgi mesajıdır')}
                className="text-xs"
              >
                Info
              </Button>
            </div>
          </nav>

          {/* Auth & Theme */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {status === 'loading' ? (
              <div className="text-sm text-secondary-foreground/80">Yükleniyor...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-secondary-foreground/90">
                  Merhaba, {session.user.username}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                >
                  Çıkış
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                >
                  <Link href={ROUTES.PAGES.AUTH.LOGIN}>Giriş</Link>
                </Button>
                <Button 
                  size="sm"
                  asChild
                >
                  <Link href={ROUTES.PAGES.AUTH.REGISTER}>Kayıt Ol</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 