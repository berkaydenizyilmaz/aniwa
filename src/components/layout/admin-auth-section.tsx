'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Shield, Edit, Crown } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { USER } from '@/lib/constants/user.constants';
    
interface AdminAuthSectionProps {
  isSidebarOpen: boolean;
}

const menuItems = [
  { icon: User, label: 'Profil', href: ROUTES.PAGES.PROFILE },
  { icon: Settings, label: 'Ayarlar', href: ROUTES.PAGES.SETTINGS },
];

const adminMenuItems = [
  { icon: Crown, label: 'Admin Paneli', href: ROUTES.PAGES.ADMIN.DASHBOARD, role: USER.ROLES.ADMIN },
  { icon: Edit, label: 'Editör Paneli', href: ROUTES.PAGES.EDITOR.DASHBOARD, role: USER.ROLES.EDITOR },
  { icon: Shield, label: 'Moderasyon Paneli', href: ROUTES.PAGES.MODERATOR.DASHBOARD, role: USER.ROLES.MODERATOR },
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
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href} className="group">
                  <Icon className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          {adminMenuItems
            .filter((item) => 
              session.user.roles.includes(USER.ROLES.ADMIN) || 
              session.user.roles.includes(item.role)
            )
            .map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href} className="group">
                    <Icon className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive group"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive" />
            <span>Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
} 