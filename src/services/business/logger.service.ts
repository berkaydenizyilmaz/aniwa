import { createLog } from '@/services/db/log.db'
import { LogLevel, SENSITIVE_FIELDS } from '@/constants/logging'
import type { LogMetadata, LogFunctionParams, CreateLogParams } from '@/types/logging'
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
const logToDatabase = async (params: CreateLogParams): Promise<void> => {
  try {
    await createLog({
      level: params.level,
      event: params.event,
      message: params.message,
      metadata: sanitizeMetadata(params.metadata) as Prisma.InputJsonValue,
      user: params.userId ? { connect: { id: params.userId } } : undefined,
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
export const logError = (params: LogFunctionParams): void => {
  const { event, message, metadata, userId } = params
  formatConsoleLog(LogLevel.ERROR, event, message, metadata)
  void logToDatabase({ level: LogLevel.ERROR, event, message, metadata, userId })
}

export const logWarn = (params: LogFunctionParams): void => {
  const { event, message, metadata, userId } = params
  formatConsoleLog(LogLevel.WARN, event, message, metadata)
  void logToDatabase({ level: LogLevel.WARN, event, message, metadata, userId })
}

export const logInfo = (params: LogFunctionParams): void => {
  const { event, message, metadata, userId } = params
  formatConsoleLog(LogLevel.INFO, event, message, metadata)
  void logToDatabase({ level: LogLevel.INFO, event, message, metadata, userId })
}

export const logDebug = (params: LogFunctionParams): void => {
  const { event, message, metadata, userId } = params
  formatConsoleLog(LogLevel.DEBUG, event, message, metadata)
  void logToDatabase({ level: LogLevel.DEBUG, event, message, metadata, userId })
} 