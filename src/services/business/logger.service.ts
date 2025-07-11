// Business Layer Logger Service
// Sadece kullanılan logging fonksiyonlarını içerir

import { createLog } from '@/services/db/log.service'
import { LogLevel, SENSITIVE_FIELDS } from '@/constants/logging'
import type { LogMetadata } from '@/types/logging'
import { Prisma } from '@prisma/client'

// Sensitive data'yı temizle
const sanitizeMetadata = (metadata?: LogMetadata): LogMetadata | undefined => {
  if (!metadata) return undefined

  const sanitized = { ...metadata }
  SENSITIVE_FIELDS.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]'
    }
  })

  return sanitized
}

// MongoDB'ye kaydetme için wrapper fonksiyonu
const logToDatabase = async (
  level: LogLevel,
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  try {
    await createLog({
      level,
      event,
      message,
      metadata: sanitizeMetadata(metadata) as Prisma.JsonValue || null,
      userId: userId || undefined,
    })
  } catch (error) {
    // Database log hatası durumunda sadece console'a yaz (infinite loop'u önle)
    console.error('Database log error:', error)
  }
}

// Console logging için formatlanmış çıktı
const formatConsoleLog = (level: LogLevel, event: string, message: string, metadata?: LogMetadata) => {
  const timestamp = new Date().toISOString()
  const emoji = {
    ERROR: '🔴',
    WARN: '🟡',
    INFO: '🔵',
    DEBUG: '⚪'
  }[level] || '⚪'

  console.log(`${emoji} [${timestamp}] [${event}] ${message}`)

  if (metadata && Object.keys(metadata).length > 0) {
    console.log('   📋 Details:', sanitizeMetadata(metadata))
  }
}

// Ana logging fonksiyonları
// Error loglama
export const logError = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  formatConsoleLog(LogLevel.ERROR, event, message, metadata)
  void logToDatabase(LogLevel.ERROR, event, message, metadata, userId)
}

// Warning loglama
export const logWarn = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  formatConsoleLog(LogLevel.WARN, event, message, metadata)
  void logToDatabase(LogLevel.WARN, event, message, metadata, userId)
}

// Info loglama
export const logInfo = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  formatConsoleLog(LogLevel.INFO, event, message, metadata)
  void logToDatabase(LogLevel.INFO, event, message, metadata, userId)
} 