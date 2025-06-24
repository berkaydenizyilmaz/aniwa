'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRole } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/constants/routes'
import { Settings } from 'lucide-react'
import Link from 'next/link'

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
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Merhaba, </span>
          <span className="font-medium">
            {user.username || user.email}
          </span>
        </div>
        
        {/* Admin Panel Linki - Sadece admin rolüne sahip kullanıcılara göster */}
        {isAdmin() && (
          <Button asChild variant="ghost" size="sm">
            <Link href={PROTECTED_ROUTES.ADMIN.BASE} className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Yönetim</span>
            </Link>
          </Button>
        )}
        
        <Button 
          onClick={logout}
          variant="outline"
          size="sm"
        >
          Çıkış
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button asChild variant="outline" size="sm">
        <Link href={AUTH_ROUTES.SIGN_IN}>
          Giriş
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href={AUTH_ROUTES.SIGN_UP}>
          Kayıt
        </Link>
      </Button>
    </div>
  )
} 