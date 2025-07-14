'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRole } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { Settings, User, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { isAdmin } = useRole()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span className="text-sm">Yükleniyor...</span>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user.username || user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={ROUTES.PAGES.USER.PROFILE(user.username || user.email || '')} className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.PAGES.USER.SETTINGS} className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Ayarlar</span>
              </Link>
            </DropdownMenuItem>
            
            {/* Admin Panel - Sadece admin rolüne sahip kullanıcılara göster */}
            {isAdmin() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.PAGES.ADMIN.BASE} className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Yönetim</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button asChild variant="outline" size="sm">
        <Link href={ROUTES.PAGES.AUTH.SIGN_IN}>
          Giriş
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href={ROUTES.PAGES.AUTH.SIGN_UP}>
          Kayıt
        </Link>
      </Button>
    </div>
  )
} 