/**
 * Logging ile ilgili tip tanımları
 */

// Log metadata için tip
export interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined | LogMetadata | LogMetadata[]
}

// HTTP request metadata için tip
export interface RequestMetadata extends LogMetadata {
  method: string
  url: string
  statusCode: number
  duration: number
  ip?: string
  userAgent?: string
}

// Performance metadata için tip
export interface PerformanceMetadata extends LogMetadata {
  operation: string
  duration: number
}

// Auth metadata için tip
export interface AuthMetadata extends LogMetadata {
  action: string
  success: boolean
} 