import { z } from 'zod'
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