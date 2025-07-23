'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';

interface AdminAuthSectionProps {
  isSidebarOpen: boolean;
}

const menuItems = [
  { icon: User, label: 'Profil', href: ROUTES.PAGES.PROFILE },
  { icon: Settings, label: 'Ayarlar', href: ROUTES.PAGES.SETTINGS },
];

export function AdminAuthSection({ isSidebarOpen }: AdminAuthSectionProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center space-x-2 w-full">
          <Avatar className="h-5 w-5 flex-shrink-0">
            <AvatarImage src={session.user?.image || ''} alt={session.user?.username || ''} />
            <AvatarFallback className="bg-muted text-xs">
              {session.user?.username?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          {isSidebarOpen && (
            <span className="font-medium">{session.user.username}</span>
          )}
        </div>
      </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card w-48" align="center" forceMount>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
                <Link href={item.href} className="group">
                  <Icon className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive group cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive" />
            <span>Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
} 