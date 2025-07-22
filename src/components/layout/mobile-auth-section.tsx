'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
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

export function MobileAuthSection() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Çıkış yapma işlemi
  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME });
  };

  // Dropdown içeriği
  const renderDropdownContent = () => {
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
        <DropdownMenuItem onClick={handleSignOut} className="text-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group">
          <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive transition-colors duration-200" />
          <span className="group-hover:text-destructive transition-colors duration-200">Çıkış Yap</span>
        </DropdownMenuItem>
      </>
    );
  };

  // Loading durumu
  if (status === 'loading') {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="flex-1 h-14 rounded-xl"
        disabled
      >
        <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
      </Button>
    );
  }

  // Giriş yapmamış kullanıcı
  if (!session) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 h-14 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <User className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top" className="w-48 mb-2 bg-card/80 backdrop-blur-md border-border/20 shadow-xl">
          <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
            <Link href={ROUTES.PAGES.AUTH.LOGIN}>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Giriş</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 mt-1">
            <Link href={ROUTES.PAGES.AUTH.REGISTER}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Kayıt Ol</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Giriş yapmış kullanıcı
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex-1 h-14 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={session.user.image || undefined} alt={session.user.username} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="top" className="w-48 mb-2 bg-card/80 backdrop-blur-md border-border/20 shadow-xl">
        {renderDropdownContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 