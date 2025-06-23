// Aniwa Projesi - Rate Limiting Middleware Helpers
// Bu dosya rate limiting için middleware yardımcı fonksiyonlarını içerir

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from './index'
import { RATE_LIMITS } from '@/lib/constants/rate-limits'
import type { RateLimitConfig, RateLimitKeyOptions } from '@/types/rate-limit'

/**
 * Global API rate limiting için middleware
 */
export async function withGlobalRateLimit(
  request: NextRequest,
  next: () => Promise<NextResponse> | NextResponse
): Promise<NextResponse> {
  // API route'ları için rate limiting uygula
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return next()
  }
  
  const ip = getClientIP(request)
  const keyOptions: RateLimitKeyOptions = {
    ip,
    endpoint: 'global-api',
  }
  
  const status = await checkRateLimit(RATE_LIMITS.GLOBAL, keyOptions)
  
  if (status.isRateLimited && status.error) {
    return NextResponse.json(
      { 
        error: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.',
        retryAfter: status.error.retryAfter,
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': status.result.limit.toString(),
          'X-RateLimit-Remaining': status.result.remaining.toString(),
          'X-RateLimit-Reset': status.result.reset.toString(),
          'Retry-After': status.error.retryAfter?.toString() || '60',
        },
      }
    )
  }
  
  // Rate limit header'larını response'a ekle
  const response = await next()
  response.headers.set('X-RateLimit-Limit', status.result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', status.result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', status.result.reset.toString())
  
  return response
}

/**
 * Auth endpoint'leri için özel rate limiting
 */
export async function withAuthRateLimit(
  request: NextRequest,
  authType: keyof typeof RATE_LIMITS.AUTH
): Promise<NextResponse | null> {
  const ip = getClientIP(request)
  const config = RATE_LIMITS.AUTH[authType]
  const keyOptions: RateLimitKeyOptions = {
    ip,
    endpoint: `auth-${authType.toLowerCase()}`,
  }
  
  const status = await checkRateLimit(config, keyOptions)
  
  if (status.isRateLimited && status.error) {
    // Auth endpoint'ine göre özel mesaj
    let message: string = 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.'
    
    switch (authType) {
      case 'LOGIN':
        message = 'Çok fazla giriş denemesi yaptınız. Lütfen biraz bekleyip tekrar deneyin.'
        break
      case 'SIGNUP':
        message = 'Çok fazla kayıt denemesi yaptınız. Lütfen biraz bekleyip tekrar deneyin.'
        break
      case 'PASSWORD_RESET':
        message = 'Şifre sıfırlama talebinizi çok sık gönderiyorsunuz. Lütfen biraz bekleyip tekrar deneyin.'
        break
      case 'EMAIL_VERIFICATION':
        message = 'Email doğrulama talebinizi çok sık gönderiyorsunuz. Lütfen biraz bekleyip tekrar deneyin.'
        break
    }
    
    return NextResponse.json(
      { 
        error: message,
        retryAfter: status.error.retryAfter,
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': status.result.limit.toString(),
          'X-RateLimit-Remaining': status.result.remaining.toString(),
          'X-RateLimit-Reset': status.result.reset.toString(),
          'Retry-After': status.error.retryAfter?.toString() || '60',
        },
      }
    )
  }
  
  return null // Rate limit geçti, devam et
}

/**
 * API route handler'ları için rate limiting wrapper
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: {
    keyGenerator?: (request: NextRequest) => RateLimitKeyOptions
    message?: string
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const keyOptions = options?.keyGenerator 
      ? options.keyGenerator(request)
      : { ip: getClientIP(request), endpoint: request.nextUrl.pathname }
    
    const status = await checkRateLimit(config, keyOptions)
    
    if (status.isRateLimited && status.error) {
      return NextResponse.json(
        { 
          error: options?.message || 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.',
          retryAfter: status.error.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': status.result.limit.toString(),
            'X-RateLimit-Remaining': status.result.remaining.toString(),
            'X-RateLimit-Reset': status.result.reset.toString(),
            'Retry-After': status.error.retryAfter?.toString() || '60',
          },
        }
      )
    }
    
    // Rate limit header'larını response'a ekle
    const response = await handler(request)
    response.headers.set('X-RateLimit-Limit', status.result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', status.result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', status.result.reset.toString())
    
    return response
  }
} 