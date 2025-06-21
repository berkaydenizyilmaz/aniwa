import pino from 'pino'
import { LogService } from '@/services/db/log.service'
import type { LogLevel } from '@prisma/client'
import { SENSITIVE_FIELDS, LOG_EVENTS, PERFORMANCE_THRESHOLDS } from '@/lib/constants/logging'
import type { LogMetadata, PerformanceMetadata, AuthMetadata } from '@/types/logging'

/**
 * Environment'a göre log level'ı belirle
 */
const getLogLevel = (): pino.Level => {
  const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
  return level as pino.Level
}

/**
 * Environment'a göre transport'ları belirle
 * Next.js API routes için basitleştirilmiş versiyon
 */
const getTransports = () => {
  // API routes'ta transport kullanmayalım - sadece basit JSON logging
  return undefined
}

/**
 * Ana Pino logger'ı oluştur
 * Proje kurallarına uygun: performanslı, güvenli, yapılandırılabilir
 */
export const logger = pino({
  level: getLogLevel(),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  redact: {
    paths: [...SENSITIVE_FIELDS],
    remove: true,
  },
  transport: getTransports(),
})

/**
 * MongoDB'ye kaydetme için wrapper fonksiyonu
 * Mevcut LogService'i kullanarak - hiçbir şeyi bozmadan
 */
export const logToDatabase = async (
  level: LogLevel,
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  try {
    await LogService.createLog({
      level,
      event,
      message,
      metadata: metadata || null,
      userId: userId || undefined,
    })
  } catch (error) {
    // Database log hatası durumunda sadece console'a yaz (infinite loop'u önle)
    console.error('Database log error:', error)
  }
}

/**
 * Hibrit logger fonksiyonları (hem console hem database)
 * Mevcut log.service.ts'deki helper fonksiyonları ile uyumlu
 */
export const logError = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  logger.error({ event, metadata, userId }, message)
  void logToDatabase('ERROR', event, message, metadata, userId)
}

export const logWarn = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  logger.warn({ event, metadata, userId }, message)
  void logToDatabase('WARN', event, message, metadata, userId)
}

export const logInfo = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  logger.info({ event, metadata, userId }, message)
  void logToDatabase('INFO', event, message, metadata, userId)
}

export const logDebug = (
  event: string,
  message: string,
  metadata?: LogMetadata,
  userId?: string
) => {
  logger.debug({ event, metadata, userId }, message)
  void logToDatabase('DEBUG', event, message, metadata, userId)
}

/**
 * HTTP Request logging için özel fonksiyon
 * Express middleware'lerde kullanım için
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
  
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'
  
  if (level === 'error') {
    logError(LOG_EVENTS.HTTP_REQUEST, `${method} ${url} - ${statusCode}`, metadata, userId)
  } else if (level === 'warn') {
    logWarn(LOG_EVENTS.HTTP_REQUEST, `${method} ${url} - ${statusCode}`, metadata, userId)
  } else {
    logInfo(LOG_EVENTS.HTTP_REQUEST, `${method} ${url} - ${statusCode}`, metadata, userId)
  }
}

/**
 * Error handling için özel fonksiyon
 * Uncaught exception ve unhandled rejection'lar için
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
 * Yavaş operasyonları tespit etmek için
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

/**
 * Auth events için özel fonksiyon
 */
export const logAuth = (
  action: string,
  success: boolean,
  userId?: string,
  metadata?: AuthMetadata
) => {
  const authData = {
    action,
    success,
    ...metadata,
  }
  
  if (success) {
    logInfo(LOG_EVENTS.AUTH_LOGIN_SUCCESS, `Auth success: ${action}`, authData, userId)
  } else {
    logWarn(LOG_EVENTS.AUTH_LOGIN_FAILED, `Auth failed: ${action}`, authData, userId)
  }
}

export default logger 