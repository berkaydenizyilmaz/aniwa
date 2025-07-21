    'use client';

import { useSession, signOut } from 'next-auth/react';
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

export function AuthSection() {
  const { data: session, status } = useSession();

  // Username'den avatar fallback oluştur
  const getAvatarFallback = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  // Çıkış yapma işlemi
  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME });
  };

  // Loading durumu
  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  // Giriş yapmamış kullanıcı
  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <ThemeToggle />
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
      </div>
    );
  }

  // Giriş yapmış kullanıcı
  return (
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={session.user.image || undefined} alt={session.user.username} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getAvatarFallback(session.user.username)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-64 md:block hidden">
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications">
              <Bell className="mr-2 h-4 w-4" />
              <span>Bildirimler</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Ayarlar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="logout-item">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 