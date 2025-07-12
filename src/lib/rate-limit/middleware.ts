// Bu dosya rate limiting için middleware yardımcı fonksiyonlarını içerir

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from './index'
import { AUTH_RATE_LIMIT_TYPES, AUTH_RATE_LIMIT_CONFIG, GLOBAL_RATE_LIMIT_CONFIG } from '@/constants/rate-limits'
import type { RateLimitConfig, RateLimitKeyOptions } from '@/types'
import { getToken } from 'next-auth/jwt'

// Global API rate limiting için middleware
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
  
  const status = await checkRateLimit(GLOBAL_RATE_LIMIT_CONFIG.API_GENERAL, keyOptions)
  
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

// Auth endpoint'leri için otomatik rate limiting wrapper
export function withAuthRateLimit(
  authType: keyof typeof AUTH_RATE_LIMIT_CONFIG,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request)
    const config = AUTH_RATE_LIMIT_CONFIG[authType]
    
    // Kullanıcı token'ını al (varsa)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    const keyOptions: RateLimitKeyOptions = {
      ip,
      userId: token?.sub, // Kullanıcı ID'si (varsa)
      endpoint: `auth-${String(authType).toLowerCase()}`,
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

// Kullanıcı seviyesine göre rate limiting wrapper - Basitleştirilmiş
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
    
    // Basit rate limiting - herkese aynı limit
    const config: RateLimitConfig = {
      requests: 100,
      window: '15m',
      message: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.'
    }
    
    const keyOptions: RateLimitKeyOptions = {
      ip,
      userId: token?.sub,
      endpoint: options?.endpoint || request.nextUrl.pathname,
    }
    
    const status = await checkRateLimit(config, keyOptions)
    
    if (status.isRateLimited && status.error) {
      const message = options?.message || config.message
      
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

// API route handler'ları için rate limiting wrapper
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