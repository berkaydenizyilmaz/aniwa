import { createLog } from '@/services/db/log.db'
import { LogLevel, SENSITIVE_FIELDS } from '@/constants/logging'
import type { LogMetadata } from '@/types'
import { Prisma } from '@prisma/client'

// Sensitive data'yı temizle
const sanitizeMetadata = (metadata?: LogMetadata): LogMetadata | undefined => {
  if (!metadata) return undefined

  const sanitized = { ...metadata }
  SENSITIVE_FIELDS.forEach((field: string) => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]'
    }
  })

  return sanitized
}

// Database'e log kaydetme
const logToDatabase = async (
  level: LogLevel,
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
): Promise<void> => {
  try {
    await createLog({
      level,
      event,
      message,
      metadata: sanitizeMetadata(metadata) as Prisma.InputJsonValue,
      user: userId ? { connect: { id: userId } } : undefined,
    })
  } catch (error) {
    // Database log hatası durumunda sadece console'a yaz (infinite loop'u önle)
    console.error('Database log error:', error)
  }
}

// Console'a formatlanmış log yazdırma
const formatConsoleLog = (level: LogLevel, event: string, message: string, metadata?: LogMetadata) => {
  const timestamp = new Date().toISOString()
  const emoji: Record<LogLevel, string> = {
    [LogLevel.ERROR]: '🔴',
    [LogLevel.WARN]: '🟡',
    [LogLevel.INFO]: '🔵',
    [LogLevel.DEBUG]: '⚪'
  }

  console.log(`${emoji[level] || '⚪'} [${timestamp}] [${event}] ${message}`)

  if (metadata && Object.keys(metadata).length > 0) {
    console.log('   📋 Details:', sanitizeMetadata(metadata))
  }
}

// Ana logging fonksiyonları - hem console hem database
export const logError = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
): void => {
  formatConsoleLog(LogLevel.ERROR, event, message, metadata)
  void logToDatabase(LogLevel.ERROR, event, message, metadata, userId)
}

export const logWarn = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
): void => {
  formatConsoleLog(LogLevel.WARN, event, message, metadata)
  void logToDatabase(LogLevel.WARN, event, message, metadata, userId)
}

export const logInfo = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
): void => {
  formatConsoleLog(LogLevel.INFO, event, message, metadata)
  void logToDatabase(LogLevel.INFO, event, message, metadata, userId)
}

export const logDebug = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
): void => {
  formatConsoleLog(LogLevel.DEBUG, event, message, metadata)
  void logToDatabase(LogLevel.DEBUG, event, message, metadata, userId)
} 