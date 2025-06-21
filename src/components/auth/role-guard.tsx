// Aniwa Projesi - Role Guard Component
// Bu bileşen kullanıcı rolüne göre içerik gösterir/gizler

'use client'

import { ReactNode } from 'react'
import { useRole } from '@/hooks/use-auth'
import type { UserRole } from '@/generated/prisma'

interface RoleGuardProps {
  /**
   * İzin verilen roller
   */
  allowedRoles: UserRole[]
  
  /**
   * Gösterilecek içerik
   */
  children: ReactNode
  
  /**
   * Yetki yoksa gösterilecek alternatif içerik
   */
  fallback?: ReactNode
  
  /**
   * Yetki yoksa hiçbir şey gösterme (varsayılan: true)
   */
  hideOnUnauthorized?: boolean
}

/**
 * Kullanıcının rolüne göre içerik gösterir
 * 
 * @example
 * ```tsx
 * <RoleGuard allowedRoles={['ADMIN', 'MODERATOR']}>
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null,
  hideOnUnauthorized = true 
}: RoleGuardProps) {
  const { hasAnyRole, role } = useRole()
  
  // Kullanıcının rolü yoksa
  if (!role) {
    return hideOnUnauthorized ? null : fallback
  }
  
  // Kullanıcının yetkisi varsa içeriği göster
  if (hasAnyRole(allowedRoles)) {
    return <>{children}</>
  }
  
  // Yetki yoksa fallback veya hiçbir şey gösterme
  return hideOnUnauthorized ? null : fallback
}

/**
 * Sadece admin kullanıcılar için kısayol
 */
export function AdminOnly({ children, fallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

/**
 * Moderator ve admin kullanıcılar için kısayol
 */
export function ModeratorOnly({ children, fallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'MODERATOR']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

/**
 * Editor, moderator ve admin kullanıcılar için kısayol
 */
export function EditorOnly({ children, fallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'MODERATOR', 'EDITOR']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
} 