// Rate limit utility - @upstash/ratelimit kullanarak
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { RATE_LIMIT } from '@/lib/constants/rate-limit.constants';

// Rate limit sonucu tipi
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Rate limiter instance'ı oluştur
const rateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(RATE_LIMIT.API.GENERAL.MAX_REQUESTS, `${RATE_LIMIT.API.GENERAL.WINDOW_MS}ms`),
  analytics: true,
  prefix: 'rate_limit:api:general',
});

// Rate limit kontrolü
export async function checkRateLimit(request: Request): Promise<RateLimitResult> {
  try {
    // Next.js middleware'de request.ip direkt kullan
    const clientIP = (request as Request & { ip?: string }).ip;
    
    if (!clientIP) {
      console.warn('IP adresi bulunamadı, rate limit uygulanamıyor');
      throw new Error('IP adresi bulunamadı');
    }
    
    const result = await rateLimiter.limit(clientIP);

    if (!result.success) {
      return {
        success: false,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      };
    }

    return {
      success: true,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    
    // KV servisi hatası durumunda fail-closed (güvenlik için)
    throw new Error('Rate limit servisi geçici olarak kullanılamıyor');
  }
}

// Rate limit response oluştur
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Rate limit aşıldı',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': result.retryAfter?.toString() || '0',
      },
    }
  );
}

// Rate limit header'larını response'a ekle
export function addRateLimitHeaders(response: Response, result: RateLimitResult): void {
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.reset.toString());
} 