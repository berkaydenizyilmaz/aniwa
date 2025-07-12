// Bu dosya log işlemleri validasyon şemalarını içerir

import { z } from 'zod'
import { LogLevel, UserRole } from '@prisma/client'

// Prisma enum'larını Zod enum'larına çevir
const logLevelEnum = z.enum([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR])
const userRoleEnum = z.enum([UserRole.USER, UserRole.MODERATOR, UserRole.EDITOR, UserRole.ADMIN])

// Log oluşturma şeması
export const createLogSchema = z.object({
  level: logLevelEnum,
  event: z.string().min(1, 'Event gerekli'),
  message: z.string().min(1, 'Mesaj gerekli'),
  metadata: z.record(z.unknown()).optional(),
  userId: z.string().optional()
})

// Log filtreleme şeması
export const logFiltersSchema = z.object({
  level: logLevelEnum.optional(),
  event: z.string().optional(),
  userId: z.string().optional(),
  userRoles: z.array(userRoleEnum).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().positive().max(100).default(50),
  offset: z.number().min(0).default(0)
})

// Tip çıkarımları
export type CreateLogData = z.infer<typeof createLogSchema>
export type LogFiltersData = z.infer<typeof logFiltersSchema> 