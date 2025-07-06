// Aniwa Projesi - Basit ve Etkili Logger
// Bu dosya hem console hem MongoDB logging sağlar

import { createLog } from '@/services/log/log.service'
import { LogLevel, SENSITIVE_FIELDS, LOG_EVENTS, PERFORMANCE_THRESHOLDS } from '@/constants/logging'
import type { LogMetadata, PerformanceMetadata } from '@/types/logging'
import { Prisma } from '@prisma/client'

/**
 * Sensitive data'yı temizle
 */
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

/**
 * MongoDB'ye kaydetme için wrapper fonksiyonu
 */
export const logToDatabase = async (
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

/**
 * Console logging için formatlanmış çıktı
 */
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

/**
 * Ana logging fonksiyonları
 */
export const logError = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  formatConsoleLog(LogLevel.ERROR, event, message, metadata)
  void logToDatabase(LogLevel.ERROR, event, message, metadata, userId)
}

export const logWarn = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  formatConsoleLog(LogLevel.WARN, event, message, metadata)
  void logToDatabase(LogLevel.WARN, event, message, metadata, userId)
}

export const logInfo = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  formatConsoleLog(LogLevel.INFO, event, message, metadata)
  void logToDatabase(LogLevel.INFO, event, message, metadata, userId)
}

export const logDebug = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  // Debug logları sadece development'ta göster
  if (process.env.NODE_ENV === 'development') {
    formatConsoleLog(LogLevel.DEBUG, event, message, metadata)
  }
  void logToDatabase(LogLevel.DEBUG, event, message, metadata, userId)
}

/**
 * HTTP Request logging için özel fonksiyon
 */
export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  userId?: string,
  ip?: string,
  userAgent?: string
) => {
  const metadata = {
    method,
    url,
    statusCode,
    duration,
    ip,
    userAgent,
  }
  
  const level: LogLevel = statusCode >= 500 ? LogLevel.ERROR : 
                statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
  
  if (level === LogLevel.ERROR) {
    logError(LOG_EVENTS.HTTP_REQUEST, `${method} ${url} - ${statusCode}`, metadata, userId)
  } else if (level === LogLevel.WARN) {
    logWarn(LOG_EVENTS.HTTP_REQUEST, `${method} ${url} - ${statusCode}`, metadata, userId)
  } else {
    logInfo(LOG_EVENTS.HTTP_REQUEST, `${method} ${url} - ${statusCode}`, metadata, userId)
  }
}

/**
 * Error handling için özel fonksiyon
 */
export const logException = (error: Error, context?: string, userId?: string) => {
  const metadata = {
    name: error.name,
    stack: error.stack,
    context,
  }
  
  logError(LOG_EVENTS.EXCEPTION, error.message, metadata, userId)
}

/**
 * Performance logging için özel fonksiyon
 */
export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: PerformanceMetadata
) => {
  const performanceData = {
    operation,
    duration,
    ...metadata,
  }
  
  if (duration > PERFORMANCE_THRESHOLDS.SLOW_OPERATION) {
    logWarn(LOG_EVENTS.PERFORMANCE, `Slow operation: ${operation} (${duration}ms)`, performanceData)
  } else {
    logDebug(LOG_EVENTS.PERFORMANCE, `${operation} completed in ${duration}ms`, performanceData)
  }
} 