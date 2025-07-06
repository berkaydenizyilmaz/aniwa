// Aniwa Projesi - Rate Limiting Middleware Helpers
// Bu dosya rate limiting için middleware yardımcı fonksiyonlarını içerir

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from './index'
import { AUTH_RATE_LIMIT_TYPES, RATE_LIMITS } from '@/constants/rate-limits'
import type { RateLimitConfig, RateLimitKeyOptions } from '@/types/rate-limit'
import { getToken } from 'next-auth/jwt'

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
 * Auth endpoint'leri için otomatik rate limiting wrapper
 */
export function withAuthRateLimit(
  authType: keyof typeof RATE_LIMITS.AUTH,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request)
    const config = RATE_LIMITS.AUTH[authType]
    
    // Kullanıcı token'ını al (varsa)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    const keyOptions: RateLimitKeyOptions = {
      ip,
      userId: token?.sub, // Kullanıcı ID'si (varsa)
      endpoint: `auth-${authType.toLowerCase()}`,
    }
    
    const status = await checkRateLimit(config, keyOptions)
    
    if (status.isRateLimited && status.error) {
      // Auth endpoint'ine göre özel mesaj
      let message: string = 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.'
      
      switch (authType) {
        case AUTH_RATE_LIMIT_TYPES.LOGIN:
          message = 'Çok fazla giriş denemesi yaptınız. Lütfen biraz bekleyip tekrar deneyin.'
          break
        case AUTH_RATE_LIMIT_TYPES.SIGNUP:
          message = 'Çok fazla kayıt denemesi yaptınız. Lütfen biraz bekleyip tekrar deneyin.'
          break
        case AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET:
          message = 'Şifre sıfırlama talebinizi çok sık gönderiyorsunuz. Lütfen biraz bekleyip tekrar deneyin.'
          break
        case AUTH_RATE_LIMIT_TYPES.EMAIL_VERIFICATION:
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
    
    // Rate limit geçti, ana handler'ı çalıştır
    const response = await handler(request)
    
    // Rate limit header'larını response'a ekle
    response.headers.set('X-RateLimit-Limit', status.result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', status.result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', status.result.reset.toString())
    
    return response
  }
}

/**
 * Kullanıcı seviyesine göre rate limiting wrapper
 */
export function withUserTierRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: {
    message?: string
    endpoint?: string
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    // Kullanıcı seviyesini belirle
    let config: RateLimitConfig
    let tierName: string
    
    if (!token) {
      // Giriş yapmamış kullanıcı (Guest)
      config = RATE_LIMITS.USER_TIER.GUEST
      tierName = 'guest'
    } else if (token.emailVerified) {
      // Email doğrulanmış kullanıcı (Verified)
      config = RATE_LIMITS.USER_TIER.VERIFIED
      tierName = 'verified'
    } else {
      // Kayıtlı ama email doğrulanmamış (Registered)
      config = RATE_LIMITS.USER_TIER.REGISTERED
      tierName = 'registered'
    }
    
    const keyOptions: RateLimitKeyOptions = {
      ip,
      userId: token?.sub,
      endpoint: options?.endpoint || request.nextUrl.pathname,
    }
    
    const status = await checkRateLimit(config, keyOptions)
    
    if (status.isRateLimited && status.error) {
      const message = options?.message || 
        `${tierName === 'guest' ? 'Giriş yapmamış kullanıcılar için' : 'Kullanıcı seviyeniz için'} çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.`
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter: status.error.retryAfter,
          userTier: tierName,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': status.result.limit.toString(),
            'X-RateLimit-Remaining': status.result.remaining.toString(),
            'X-RateLimit-Reset': status.result.reset.toString(),
            'Retry-After': status.error.retryAfter?.toString() || '60',
            'X-User-Tier': tierName,
          },
        }
      )
    }
    
    // Rate limit geçti, ana handler'ı çalıştır
    const response = await handler(request)
    
    // Rate limit header'larını response'a ekle
    response.headers.set('X-RateLimit-Limit', status.result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', status.result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', status.result.reset.toString())
    response.headers.set('X-User-Tier', tierName)
    
    return response
  }
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