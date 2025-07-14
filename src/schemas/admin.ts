import { z } from 'zod'
import { LogLevel, UserRole } from '@prisma/client'
import { idSchema } from './user'
import { USER_ROLES, ADMIN } from '@/constants'

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

// Log filtreleme şeması (query parameters için)
export const logQuerySchema = z.object({
  level: z.array(z.string()).default([]).transform((val) => 
    val.map(v => v as LogLevel).filter(v => Object.values(LogLevel).includes(v))
  ),
  event: z.array(z.string()).default([]),
  userId: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  limit: z.string().nullish().transform(val => val ? parseInt(val) : ADMIN.LOGS.DEFAULT_LIMIT)
    .pipe(z.number().min(1).max(ADMIN.LOGS.MAX_LIMIT)),
  page: z.string().nullish().transform(val => val ? parseInt(val) : 1)
    .pipe(z.number().min(1)),
  sortBy: z.enum(['timestamp', 'level', 'event']).nullish(),
  sortOrder: z.enum(['asc', 'desc']).nullish(),
})

// Log filtreleme şeması (internal kullanım için)
export const logFiltersSchema = z.object({
  level: z.array(z.nativeEnum(LogLevel)).optional(),
  event: z.array(z.string()).optional(),
  userId: z.string().optional(),
  userRoles: z.array(z.nativeEnum(UserRole)).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(ADMIN.LOGS.MAX_LIMIT).default(ADMIN.LOGS.DEFAULT_LIMIT),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['timestamp', 'level', 'event']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const updateUserRoleSchema = z.object({
  userId: idSchema,
  roles: z.array(z.enum(Object.values(USER_ROLES) as [string, ...string[]])),
}) 