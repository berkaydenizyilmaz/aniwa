// Bu dosya kimlik doğrulama ile ilgili custom hook'ları içerir

'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UserRole } from '@prisma/client'
import type { UseAuthReturn, SessionUser } from '@/types/auth'
import { ROUTES, USER_ROLES } from '@/constants'

// Auth durumunu yöneten ana hook
export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()
  const router = useRouter()

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signIn('google', {
        redirect: false,
      })
      
      if (result?.ok) {
        router.push(ROUTES.PAGES.HOME)
      }
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false })
      router.push(ROUTES.PAGES.HOME)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }, [router])

  const hasRole = useCallback(
    (role: UserRole) => session?.user?.roles?.includes(role) ?? false,
    [session?.user?.roles]
  )

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => session?.user?.roles ? roles.some(role => session.user.roles.includes(role)) : false,
    [session?.user?.roles]
  )

  const requireRole = useCallback(
    (role: UserRole) => {
      if (!hasRole(role)) {
        throw new Error(`Required role: ${role}`)
      }
      return true
    },
    [hasRole]
  )

  const requireAnyRole = useCallback(
    (roles: UserRole[]) => {
      if (!hasAnyRole(roles)) {
        throw new Error(`Required roles: ${roles.join(', ')}`)
      }
      return true
    },
    [hasAnyRole]
  )

  return {
    user: session?.user as SessionUser || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    loginWithGoogle,
    logout,
    hasRole,
    hasAnyRole,
    requireRole,
    requireAnyRole,
  }
}

// Kullanıcı rolü kontrolü için hook
export function useRole() {
  const { user } = useAuth()

  const hasRole = useCallback(
    (role: UserRole) => user?.roles?.includes(role) ?? false,
    [user?.roles]
  )

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => user?.roles ? roles.some(role => user.roles.includes(role)) : false,
    [user?.roles]
  )

  const hasAllRoles = useCallback(
    (roles: UserRole[]) => user?.roles ? roles.every(role => user.roles.includes(role)) : false,
    [user?.roles]
  )

  const isAdmin = useCallback(() => hasRole(USER_ROLES.ADMIN), [hasRole])
  const isModerator = useCallback(() => hasAnyRole([USER_ROLES.ADMIN, USER_ROLES.MODERATOR]), [hasAnyRole])
  const isEditor = useCallback(() => hasAnyRole([USER_ROLES.ADMIN, USER_ROLES.MODERATOR, USER_ROLES.EDITOR]), [hasAnyRole])

  return {
    roles: user?.roles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isModerator,
    isEditor,
  }
}

// Korumalı sayfa erişimi için hook
export function useRequireAuth(redirectTo = ROUTES.PAGES.AUTH.SIGN_IN) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo)
  }

  return { isAuthenticated, isLoading }
}

// Rol tabanlı erişim kontrolü için hook
export function useRequireRole(
  requiredRole: UserRole | UserRole[], 
  redirectTo = ROUTES.PAGES.HOME
) {
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