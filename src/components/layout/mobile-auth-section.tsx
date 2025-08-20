'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { User, LogOut, LogIn, UserPlus } from 'lucide-react'  
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ROUTES_DOMAIN, NAVIGATION_DOMAIN, UserRole } from '@/lib/constants'
import { hasRole } from '@/lib/utils/role.utils'
import { useMutation } from '@tanstack/react-query'

export function MobileAuthSection() {
  const { data: session, status } = useSession()
  
  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ callbackUrl: ROUTES_DOMAIN.PAGES.HOME });
    },
    onError: (error) => {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    },
  });
  
  if (status === 'loading') {
    return (
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  if (!session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-muted text-xs">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card w-48" align="end" side="top" forceMount>
          <DropdownMenuItem asChild>
            <Link href={ROUTES_DOMAIN.PAGES.AUTH.LOGIN} className="cursor-pointer group">
              <LogIn className="mr-2 h-4 w-4 group-hover:text-foreground" />
              <span>Giriş Yap</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES_DOMAIN.PAGES.AUTH.REGISTER} className="cursor-pointer group">
              <UserPlus className="mr-2 h-4 w-4 group-hover:text-foreground" />
              <span>Kayıt Ol</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const handleSignOut = () => {
    signOutMutation.mutate();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage src={session.user?.profilePicture || ''} alt={session.user?.username || ''} className="object-cover" />
            <AvatarFallback className="bg-muted text-xs rounded-lg">
              {session.user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-card w-48" align="end" side="top" forceMount>
        {NAVIGATION_DOMAIN.MENU.AUTH_MENU_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem key={item.label} asChild>
              <Link href={item.href} className="group">
                <Icon className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        {NAVIGATION_DOMAIN.MENU.ADMIN_MENU_ITEMS
          .filter((item) => 
            hasRole(session.user.role, item.role) || 
            hasRole(session.user.role, UserRole.ADMIN)
          )
          .map((item) => {
            const Icon = item.icon
            return (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href} className="group">
                  <Icon className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            )
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
  )
}