// Aniwa Projesi - Admin Schemas
// Bu dosya admin ile ilgili Zod şemalarını içerir

import { z } from 'zod'
import { idSchema } from './user'
import { dateSchema } from './anime'

// =============================================================================
// ADMIN ŞEMALARI
// =============================================================================

export const logFiltersSchema = z.object({
  level: z.array(z.enum(['ERROR', 'WARN', 'INFO', 'DEBUG'])).optional(),
  userId: idSchema.optional(),
  event: z.array(z.string()).optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  sortBy: z.enum(['createdAt', 'level', 'event']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const updateUserRoleSchema = z.object({
  userId: idSchema,
  roles: z.array(z.enum(['USER', 'MODERATOR', 'EDITOR', 'ADMIN'])),
}) 