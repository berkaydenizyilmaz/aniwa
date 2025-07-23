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
import { cn } from '@/lib/utils';

interface AdminSidebarAuthProps {
  collapsed?: boolean;
}

export const AdminSidebarAuth = memo(function AdminSidebarAuth({ collapsed = false }: AdminSidebarAuthProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Çıkış yapma işlemi
  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME });
  };

  // Dropdown content
  const dropdownContent = session && (
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

  // Loading durumu
  if (status === 'loading') {
    return (
      <div className={cn(
        "flex items-center",
        collapsed ? "justify-center" : "space-x-3"
      )}>
        <Skeleton className="h-8 w-8 rounded-full" />
        {!collapsed && <Skeleton className="h-4 w-20" />}
      </div>
    );
  }

  // Giriş yapmamış kullanıcı
  if (!session) {
    return (
      <div className={cn(
        "flex items-center",
        collapsed ? "justify-center" : "space-x-2"
      )}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hover:bg-secondary-foreground/10 hover:text-secondary-foreground/80 transition-all duration-200",
                collapsed ? "h-8 w-8" : "h-8 w-8"
              )}
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-48 auth-dropdown">
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
        {!collapsed && (
          <span className="text-xs text-secondary-foreground/80">Giriş Yap</span>
        )}
      </div>
    );
  }

  // Giriş yapmış kullanıcı
  return (
    <div className={cn(
      "flex items-center",
      collapsed ? "justify-center" : "space-x-3"
    )}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:bg-secondary-foreground/10 hover:text-secondary-foreground/80 transition-all duration-200",
              collapsed ? "h-8 w-8" : "h-8 w-8"
            )}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={session.user.image || undefined} alt={session.user.username} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="w-48 auth-dropdown">
          {dropdownContent}
        </DropdownMenuContent>
      </DropdownMenu>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-secondary-foreground">
            {session.user.username}
          </span>
          <span className="text-xs text-secondary-foreground/60">
            Admin
          </span>
        </div>
      )}
    </div>
  );
}); 