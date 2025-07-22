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
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ROUTES } from '@/lib/constants/routes.constants';
import { User, Bell, Settings, LogOut } from 'lucide-react';

export const HeaderAuthSection = memo(function HeaderAuthSection() {
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
        <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
          <Link href={ROUTES.PAGES.PROFILE}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
          <Link href={ROUTES.PAGES.NOTIFICATIONS}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Bildirimler</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
          <Link href={ROUTES.PAGES.SETTINGS}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Ayarlar</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-foreground hover:text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-500 transition-all duration-200 group">
          <LogOut className="mr-2 h-4 w-4 group-hover:text-red-500 group-focus:text-red-500 transition-colors duration-200" />
          <span className="group-hover:text-red-500 group-focus:text-red-500 transition-colors duration-200">Çıkış Yap</span>
        </DropdownMenuItem>
      </>
    );
  }, [session, handleSignOut]);

  // Loading durumu
  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <div className="flex items-center space-x-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    );
  }

  // Giriş yapmamış kullanıcı
  if (!session) {
    return (
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Link href={ROUTES.PAGES.AUTH.LOGIN}>Giriş</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
          >
            <Link href={ROUTES.PAGES.AUTH.REGISTER}>Kayıt Ol</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Giriş yapmış kullanıcı
  return (
    <div className="flex items-center space-x-3">
      <ThemeToggle />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-7 w-7 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-200">
            <AvatarImage src={session.user.image || undefined} alt={session.user.username} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-3.5 w-3.5" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="bottom" className="w-64 bg-card/80 backdrop-blur-md border-border/20 mt-4 shadow-xl">
          {renderDropdownContent()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}); 