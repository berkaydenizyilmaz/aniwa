import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  checkRateLimit, 
  createRateLimitResponse, 
  addRateLimitHeaders 
} from '@/lib/utils/rate-limit.utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API rate limit kontrolü
  if (pathname.startsWith('/api/')) {
    try {
      // Genel API rate limit
      const rateLimitResult = await checkRateLimit(request);

      if (!rateLimitResult.success) {
        return createRateLimitResponse(rateLimitResult);
      }

      // Rate limit header'larını ekle
      const response = NextResponse.next();
      addRateLimitHeaders(response, rateLimitResult);
      
      return response;
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      
      // Rate limit servisi hatası durumunda 500 döndür
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Rate limit servisi geçici olarak kullanılamıyor',
          code: 'RATE_LIMIT_SERVICE_ERROR',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Diğer middleware işlemleri buraya eklenebilir
  // (Auth kontrolü, redirect'ler vs.)

  return NextResponse.next();
}

// Middleware'in çalışacağı path'ler
export const config = {
  matcher: [
    // API route'ları
    '/api/:path*',
    // Auth sayfaları
    '/auth/:path*',
    // Korumalı sayfalar
    '/profile/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
}; 