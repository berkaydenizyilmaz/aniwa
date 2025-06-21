// Aniwa Projesi - Auth Hooks
// Bu dosya kimlik doğrulama ile ilgili custom hook'ları içerir

'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UserRole } from '@prisma/client'

/**
 * Auth durumunu yöneten ana hook
 */
export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    return result
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await signIn('google', { callbackUrl: '/' })
  }, [])

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push('/')
  }, [router])

  const setupUsername = useCallback(async (username: string) => {
    if (!session?.user?.email) {
      throw new Error('Kullanıcı email bilgisi bulunamadı')
    }

    const response = await fetch('/api/auth/setup-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        username
      })
    })

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Username ayarlama başarısız')
    }

    // Modern NextAuth session güncelleme
    await update({
      username: result.data.username
    })
    
    // Ana sayfaya yönlendir
    router.push('/')
    
    return result
  }, [session?.user?.email, router, update])

  return {
    // Session bilgileri
    user: session?.user,
    session,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    needsUsername: !!session?.user && !session?.user.username,
    
    // Auth fonksiyonları
    login,
    loginWithGoogle,
    logout,
    setupUsername,
  }
}

/**
 * Kullanıcı rolü kontrolü için hook
 */
export function useRole() {
  const { user } = useAuth()

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user?.role]
  )

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => user?.role && roles.includes(user.role),
    [user?.role]
  )

  const isAdmin = useCallback(() => hasRole('ADMIN'), [hasRole])
  const isModerator = useCallback(() => hasAnyRole(['ADMIN', 'MODERATOR']), [hasAnyRole])
  const isEditor = useCallback(() => hasAnyRole(['ADMIN', 'MODERATOR', 'EDITOR']), [hasAnyRole])

  return {
    role: user?.role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    isEditor,
  }
}

/**
 * Korumalı sayfa erişimi için hook
 */
export function useRequireAuth(redirectTo = '/auth/signin') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo)
  }

  return { isAuthenticated, isLoading }
}

/**
 * Rol tabanlı erişim kontrolü için hook
 */
export function useRequireRole(requiredRole: UserRole | UserRole[], redirectTo = '/') {
  const { isAuthenticated, isLoading } = useAuth()
  const { hasRole, hasAnyRole } = useRole()
  const router = useRouter()

  const hasRequiredRole = Array.isArray(requiredRole) 
    ? hasAnyRole(requiredRole) 
    : hasRole(requiredRole)

  if (!isLoading && isAuthenticated && !hasRequiredRole) {
    router.push(redirectTo)
  }

  return { hasRequiredRole, isLoading }
} 