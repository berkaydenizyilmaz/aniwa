// Aniwa Projesi - Admin Schemas
// Bu dosya admin ile ilgili Zod şemalarını içerir

import { z } from 'zod'
import { idSchema } from './user'
import { dateSchema } from './anime'
import { LOG_LEVELS, USER_ROLES } from '@/constants'

// =============================================================================
// ADMIN ŞEMALARI
// =============================================================================

export const logFiltersSchema = z.object({
  level: z.array(z.enum(Object.values(LOG_LEVELS) as [string, ...string[]])).optional(),
  userId: idSchema.optional(),
  event: z.array(z.string()).optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  sortBy: z.enum(['createdAt', 'level', 'event']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const updateUserRoleSchema = z.object({
  userId: idSchema,
  roles: z.array(z.enum(Object.values(USER_ROLES) as [string, ...string[]])),
}) 