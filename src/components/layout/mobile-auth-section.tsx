'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/constants/routes.constants';
import { User, Bell, Settings, LogOut, LogIn, UserPlus } from 'lucide-react';

export const MobileAuthSection = memo(function MobileAuthSection() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Çıkış yapma işlemi
  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME });
  }, []);

  // Dropdown içeriği - useCallback ile optimize edildi
  const renderDropdownContent = useCallback(() => {
    if (!session) return null;
    
    return (
      <>
        <DropdownMenuItem asChild className="auth-dropdown-item">
          <Link href={ROUTES.PAGES.PROFILE}>
            <User className="icon-dropdown" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="auth-dropdown-item">
          <Link href={ROUTES.PAGES.NOTIFICATIONS}>
            <Bell className="icon-dropdown" />
            <span>Bildirimler</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="auth-dropdown-item">
          <Link href={ROUTES.PAGES.SETTINGS}>
            <Settings className="icon-dropdown" />
            <span>Ayarlar</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="auth-dropdown-item-danger group">
          <LogOut className="icon-dropdown group-hover:text-red-500 group-focus:text-red-500 transition-colors duration-200" />
          <span className="group-hover:text-red-500 group-focus:text-red-500 transition-colors duration-200">Çıkış Yap</span>
        </DropdownMenuItem>
      </>
    );
  }, [session, handleSignOut]);

  // Loading durumu
  if (status === 'loading') {
    return (
      <div className="flex-1 h-14 flex items-center justify-center border-l border-border/20">
        <Skeleton className="h-5 w-5 bg-muted animate-pulse rounded-full" />
      </div>
    );
  }

  // Giriş yapmamış kullanıcı
  if (!session) {
    return (
      <div className="flex-1 h-14 flex items-center justify-center border-l border-border/20">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-full rounded-none hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <User className="h-5 w-5 stroke-[1.5]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" className="w-48 mb-2 auth-dropdown">
            <DropdownMenuItem asChild className="auth-dropdown-item">
              <Link href={ROUTES.PAGES.AUTH.LOGIN}>
                <LogIn className="icon-dropdown" />
                <span>Giriş</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 mt-1">
              <Link href={ROUTES.PAGES.AUTH.REGISTER}>
                <UserPlus className="icon-dropdown" />
                <span>Kayıt Ol</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Giriş yapmış kullanıcı
  return (
    <div className="flex-1 h-14 flex items-center justify-center border-l border-border/20">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-full rounded-none hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={session.user.image || undefined} alt={session.user.username} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-3 w-3 stroke-[1.5]" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top" className="w-48 mb-2 auth-dropdown">
          {renderDropdownContent()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}); 