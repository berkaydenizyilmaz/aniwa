import { z } from 'zod'
import { USER_ROLES } from '@/constants'
import { LogLevel } from '@prisma/client'
import { ADMIN } from '@/constants'

// =============================================================================
// ADMIN ŞEMALARI
// =============================================================================

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

// Admin kullanıcı listeleme sorgu parametreleri için şema
export const userListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sort: z.string().optional().default('createdAt-desc'),
  search: z.string().optional(),
})

export type UserListQueryValues = z.infer<typeof userListQuerySchema>

// Admin tarafından kullanıcı güncelleme şeması
export const adminUpdateUserSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz.').optional(),
  roles: z.array(z.nativeEnum(USER_ROLES)).optional(),
  isBanned: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
})

export type AdminUpdateUserValues = z.infer<typeof adminUpdateUserSchema>