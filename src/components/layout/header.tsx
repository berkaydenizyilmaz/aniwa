'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ROUTES } from '@/lib/constants/routes.constants';

export function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME });
  };

  return (
    <header className="border-b border-gray-200/30 shadow-sm" style={{ backgroundColor: '#2f325c' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link 
              href={ROUTES.PAGES.HOME} 
              className="text-2xl font-bold text-white hover:text-gray-200 transition-all duration-200 font-geist-sans"
            >
              Aniwa
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href={ROUTES.PAGES.HOME} 
              className="text-sm font-semibold text-gray-300 hover:text-gray-200 transition-colors duration-200 font-geist-sans"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/anime" 
              className="text-sm font-semibold text-gray-300 hover:text-gray-200 transition-colors duration-200 font-geist-sans"
            >
              Anime
            </Link>
            <Link 
              href="/lists" 
              className="text-sm font-semibold text-gray-300 hover:text-gray-200 transition-colors duration-200 font-geist-sans"
            >
              Listeler
            </Link>
          </nav>

          {/* Auth & Theme */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {status === 'loading' ? (
              <div className="text-sm text-white/80 font-geist-sans">Yükleniyor...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-white/90 font-geist-sans">
                  Merhaba, {session.user.username}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="!border-[#5bc0ff] !text-[#5bc0ff] hover:!border-[#5bc0ff]/80 hover:!text-[#5bc0ff]/80 !bg-transparent hover:!bg-transparent transition-all duration-200 font-geist-sans"
                >
                  Çıkış
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="!border-[#5bc0ff] !text-[#5bc0ff] hover:!border-[#5bc0ff]/80 hover:!text-[#5bc0ff]/80 !bg-transparent hover:!bg-transparent transition-all duration-200 font-geist-sans"
                >
                  <Link href={ROUTES.PAGES.AUTH.LOGIN}>Giriş</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="!bg-[#5bc0ff] !text-white hover:!bg-[#5bc0ff]/90 !font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
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