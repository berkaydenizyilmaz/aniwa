'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { AUTH_ROUTES } from '@/lib/constants/routes'
import Link from 'next/link'

export default function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

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