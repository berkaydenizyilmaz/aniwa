// Bu dosya yönetim paneli ile ilgili doğrulama şemalarını içerir

import { z } from 'zod'
import { LogLevel, UserRole } from '@prisma/client'
import { idSchema } from './user'
import { USER_ROLES } from '@/constants'

// =============================================================================
// ADMIN ŞEMALARI
// =============================================================================

// Log oluşturma şeması
export const createLogSchema = z.object({
  level: z.nativeEnum(LogLevel),
  event: z.string().min(1),
  message: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
  userId: z.string().optional(),
})

// Log filtreleme şeması
export const logFiltersSchema = z.object({
  level: z.array(z.string()).optional(),
  event: z.array(z.string()).optional(),
  userId: z.string().optional(),
  userRoles: z.array(z.nativeEnum(UserRole)).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['createdAt', 'level', 'event']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const updateUserRoleSchema = z.object({
  userId: idSchema,
  roles: z.array(z.enum(Object.values(USER_ROLES) as [string, ...string[]])),
}) 