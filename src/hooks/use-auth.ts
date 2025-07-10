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
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/auth'

/**
 * Auth durumunu yöneten ana hook
 */
export function useAuth(): AuthHookReturn {
  const { data: session, status } = useSession()
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
    await signIn('google', { callbackUrl: ROUTES.PAGES.HOME })
  }, [])

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push(ROUTES.PAGES.HOME)
  }, [router])

  return {
    // Session bilgileri
    user: session?.user,
    session,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    needsUsername: false, // OAuth artık otomatik username oluşturuyor
    
    // Auth fonksiyonları
    login,
    loginWithGoogle,
    logout,
    setupUsername: async () => ({ success: true }), // Eski uyumluluk için boş fonksiyon
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
export function useRequireAuth(redirectTo = ROUTES.PAGES.AUTH.SIGN_IN): RequireAuthHookReturn {
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
  redirectTo = ROUTES.PAGES.HOME
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