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
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ROUTES } from '@/lib/constants/routes.constants'
import { ADMIN_MENU_ITEMS, AUTH_MENU_ITEMS } from '@/lib/constants/menu.constants'
import { USER } from '@/lib/constants/user.constants'
import { useMutation } from '@tanstack/react-query'

export function AuthSection() {
  const { data: session, status } = useSession()
  
  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ callbackUrl: ROUTES.PAGES.HOME });
    },
    onError: (error) => {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    },
  });
  
  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.PAGES.AUTH.LOGIN}>Giriş Yap</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={ROUTES.PAGES.AUTH.REGISTER}>Kayıt Ol</Link>
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
          <div className="cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user?.image || ''} alt={session.user?.username || ''} />
              <AvatarFallback className="bg-muted text-sm">
                {session.user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card w-48" align="center" forceMount>
          {AUTH_MENU_ITEMS.map((item) => {
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
          {ADMIN_MENU_ITEMS
            .filter((item) => 
              session.user.roles.includes(item.role) || 
              session.user.roles.includes(USER.ROLES.ADMIN)
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