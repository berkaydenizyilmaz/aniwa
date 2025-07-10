// Aniwa Projesi - Rate Limiting Service
// Bu dosya ana rate limiting fonksiyonalitesini sağlar

import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { env, hasRateLimit } from '@/lib/env'
import { logWarn, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { RATE_LIMIT_MULTIPLIERS } from '@/constants/rate-limits'
import type { 
  RateLimitConfig, 
  RateLimitKeyOptions,
  RateLimitStatus 
} from '@/types/rate-limit'

// Rate limit key oluşturur
// Öncelik sırası: customKey > userId > ip
export function createRateLimitKey(options: RateLimitKeyOptions): string {
  const { ip, userId, endpoint, customKey } = options
  
  if (customKey) {
    return `ratelimit:${customKey}`
  }
  
  const parts = ['ratelimit']
  
  if (endpoint) {
    parts.push(`endpoint:${endpoint}`)
  }
  
  // Kullanıcı bazlı rate limiting öncelikli
  if (userId) {
    parts.push(`user:${userId}`)
  } else if (ip) {
    parts.push(`ip:${ip}`)
  }
  
  return parts.join(':')
}

// Environment'a göre rate limit konfigürasyonunu ayarlar
function adjustConfigForEnvironment(config: RateLimitConfig): RateLimitConfig {
  const multiplier = RATE_LIMIT_MULTIPLIERS[env.NODE_ENV] || 1
  
  return {
    ...config,
    requests: Math.max(1, Math.floor(config.requests * multiplier)),
  }
}

// Rate limiter instance oluşturur
function createRateLimiter(config: RateLimitConfig): Ratelimit | null {
  if (!hasRateLimit) {
    logWarn(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Rate limiting devre dışı - KV konfigürasyonu eksik')
    return null
  }
  
  try {
    const adjustedConfig = adjustConfigForEnvironment(config)
    
    // Sliding window algoritması kullan
    const limiter = Ratelimit.slidingWindow(
      adjustedConfig.requests,
      adjustedConfig.window as `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`
    )
    
    return new Ratelimit({
      redis: kv,
      limiter,
      analytics: true, // Vercel Analytics entegrasyonu
    })
  } catch (error) {
    logError(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Rate limiter oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      requests: config.requests,
      window: config.window,
      algorithm: config.algorithm,
    })
    return null
  }
}

// Rate limit kontrolü yapar
export async function checkRateLimit(
  config: RateLimitConfig,
  keyOptions: RateLimitKeyOptions
): Promise<RateLimitStatus> {
  // Rate limiting devre dışıysa geç
  if (!hasRateLimit) {
    return {
      isRateLimited: false,
      result: {
        success: true,
        limit: config.requests,
        remaining: config.requests,
        reset: Date.now() + 60000, // 1 dakika sonra
      },
    }
  }
  
  const rateLimiter = createRateLimiter(config)
  if (!rateLimiter) {
    // Rate limiter oluşturulamazsa geç (graceful degradation)
    return {
      isRateLimited: false,
      result: {
        success: true,
        limit: config.requests,
        remaining: config.requests,
        reset: Date.now() + 60000,
      },
    }
  }
  
  try {
    const key = createRateLimitKey(keyOptions)
    const result = await rateLimiter.limit(key)
    
    // Sadece rate limit aşımlarını logla (başarılı olanları değil)
    if (!result.success) {
      logWarn(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Rate limit aşıldı', {
        key: key.substring(0, 20) + '...', // Güvenlik için kısalt
        limit: result.limit,
        reset: new Date(result.reset).toISOString(),
      })
    }
    
    return {
      isRateLimited: !result.success,
      result: {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        pending: result.pending,
      },
      error: !result.success ? {
        message: 'Rate limit aşıldı',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      } : undefined,
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Rate limit kontrolü hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      ip: keyOptions.ip,
      userId: keyOptions.userId,
      endpoint: keyOptions.endpoint,
    })
    
    // Hata durumunda graceful degradation - geç
    return {
      isRateLimited: false,
      result: {
        success: true,
        limit: config.requests,
        remaining: config.requests,
        reset: Date.now() + 60000,
      },
    }
  }
}

// IP adresini request'ten çıkarır
export function getClientIP(request: Request): string {
  // Vercel'de x-forwarded-for header'ı kullan
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  // Cloudflare'den geliyorsa cf-connecting-ip kullan
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // X-Real-IP header'ı kontrol et
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fallback olarak localhost kullan
  return '127.0.0.1'
} 