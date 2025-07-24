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
import { User, Settings, LogOut, Bell, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ROUTES } from '@/lib/constants/routes.constants'
import { ADMIN_MENU_ITEMS } from '@/lib/constants/menu.constants'
import { USER } from '@/lib/constants/user.constants'

const menuItems = [
  { icon: User, label: 'Profil', href: ROUTES.PAGES.PROFILE },
  { icon: Bell, label: 'Bildirimler', href: ROUTES.PAGES.NOTIFICATIONS },
  { icon: Settings, label: 'Ayarlar', href: ROUTES.PAGES.SETTINGS },
]

export function MobileAuthSection() {
  const { data: session, status } = useSession()
  
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
            <Link href={ROUTES.PAGES.AUTH.LOGIN} className="cursor-pointer group">
              <LogIn className="mr-2 h-4 w-4 group-hover:text-foreground" />
              <span>Giriş Yap</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.PAGES.AUTH.REGISTER} className="cursor-pointer group">
              <UserPlus className="mr-2 h-4 w-4 group-hover:text-foreground" />
              <span>Kayıt Ol</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.PAGES.HOME })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user?.image || ''} alt={session.user?.username || ''} />
            <AvatarFallback className="bg-muted text-xs">
              {session.user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-card w-48" align="end" side="top" forceMount>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem key={item.label} asChild>
              <Link href={item.href} className="group">
                <Icon className="mr-2 h-4 w-4 group-hover:text-foreground" />
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
                  <Icon className="mr-2 h-4 w-4 group-hover:text-foreground" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            )
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
  )
}