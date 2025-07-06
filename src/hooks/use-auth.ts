// Aniwa Projesi - Auth Hooks
// Bu dosya kimlik doğrulama ile ilgili custom hook'ları içerir

'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UserRole } from '@prisma/client'
import type { 
  AuthHookReturn, 
  RoleHookReturn, 
  RequireAuthHookReturn, 
  RequireRoleHookReturn 
} from '@/types/auth'
import { API_ROUTES, AUTH_ROUTES, PUBLIC_ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/auth'

/**
 * Auth durumunu yöneten ana hook
 */
export function useAuth(): AuthHookReturn {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const login = useCallback(async (username: string, password: string) => {
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })
    
    return result
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await signIn('google', { callbackUrl: PUBLIC_ROUTES.HOME })
  }, [])

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push(PUBLIC_ROUTES.HOME)
  }, [router])

  const setupUsername = useCallback(async (username: string) => {
    if (!session?.user?.email) {
      throw new Error('Kullanıcı email bilgisi bulunamadı')
    }

    const response = await fetch(API_ROUTES.AUTH.SETUP_USERNAME, {
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

    // Session'ı yenile
    await update()
    
    // Ana sayfaya yönlendir
    router.push(PUBLIC_ROUTES.HOME)
    
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
export function useRole(): RoleHookReturn {
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

/**
 * Korumalı sayfa erişimi için hook
 */
export function useRequireAuth(redirectTo = AUTH_ROUTES.SIGN_IN): RequireAuthHookReturn {
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
export function useRequireRole(
  requiredRole: UserRole | UserRole[], 
  redirectTo = PUBLIC_ROUTES.HOME
): RequireRoleHookReturn {
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