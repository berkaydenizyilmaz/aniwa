'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ROUTES_DOMAIN, NAVIGATION_DOMAIN, UserRole } from '@/lib/constants'
import { hasRole } from '@/lib/utils/role.utils'
import { useMutation } from '@tanstack/react-query'

export function AuthSection() {
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
      <div className="flex items-center space-x-2">
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES_DOMAIN.PAGES.AUTH.LOGIN}>Giriş Yap</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={ROUTES_DOMAIN.PAGES.AUTH.REGISTER}>Kayıt Ol</Link>
        </Button>
      </div>
    )
  }

  const handleSignOut = () => {
    signOutMutation.mutate();
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={session.user?.profilePicture || ''} alt={session.user?.username || ''} className="object-cover" />
              <AvatarFallback className="bg-muted text-sm rounded-lg">
                {session.user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card w-48" align="center" forceMount>
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
    </div>
  )
}