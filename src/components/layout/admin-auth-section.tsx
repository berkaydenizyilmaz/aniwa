'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { ADMIN_MENU_ITEMS, AUTH_MENU_ITEMS } from '@/lib/constants/menu.constants';
import { USER } from '@/lib/constants/user.constants';
import { useMutation } from '@tanstack/react-query';
import { UserRole } from '@prisma/client';


interface AdminAuthSectionProps {
  isSidebarOpen: boolean;
}

export function AdminAuthSection({ isSidebarOpen }: AdminAuthSectionProps) {
  const { data: session } = useSession();

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ callbackUrl: ROUTES.PAGES.HOME });
    },
    onError: (error) => {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    },
  });

  if (!session?.user) {
    return null;
  }

  const handleSignOut = () => {
    signOutMutation.mutate();
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
        {AUTH_MENU_ITEMS.map((item) => {
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
        {ADMIN_MENU_ITEMS
          .filter((item) =>
            session.user.roles.includes(item.role) ||
            session.user.roles.includes(UserRole.ADMIN)
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
          disabled={signOutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 