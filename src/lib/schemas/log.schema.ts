// Log validasyon şemaları

import { z } from 'zod';
import { LogLevel } from '@prisma/client';

// Log oluşturma şeması (logger için)
export const createLogSchema = z.object({
  level: z.nativeEnum(LogLevel),
  event: z.string().min(1, 'Event gerekli'),
  message: z.string().min(1, 'Mesaj gerekli'),
  metadata: z.record(z.string(), z.unknown()).optional(),
  userId: z.string().optional(),
});

import { baseFiltersSchema } from './shared/base';

// Log filtreleme şeması
export const logFiltersSchema = baseFiltersSchema.extend({
  level: z.nativeEnum(LogLevel).optional(),
  event: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Tip türetmeleri
export type CreateLogInput = z.infer<typeof createLogSchema>;
export type LogFilters = z.infer<typeof logFiltersSchema>; 