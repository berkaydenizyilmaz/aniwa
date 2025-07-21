'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Home, Film, List, User, Bell, Settings, LogOut } from 'lucide-react';

export function MobileBottomNav() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Username'den avatar fallback oluştur
  const getAvatarFallback = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  // Ekran boyutu değiştiğinde dropdown'ı kapat
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
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

        {/* Profil/Auth */}
        {session ? (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex-1 h-12"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={session.user.image || undefined} alt={session.user.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {getAvatarFallback(session.user.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
                         <DropdownMenuContent align="center" side="top" className="w-64 mb-2">
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
               <DropdownMenuItem className="logout-item">
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Çıkış Yap</span>
               </DropdownMenuItem>
             </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="flex-1 h-12"
          >
            <Link href={ROUTES.PAGES.AUTH.LOGIN}>
              <User className="h-6 w-6 text-card-foreground" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
} 