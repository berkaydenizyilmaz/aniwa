import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  checkRateLimit, 
  createRateLimitResponse, 
  addRateLimitHeaders 
} from '@/lib/utils/rate-limit.utils';
import { ROUTES_DOMAIN } from '@/lib/constants';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API rate limit kontrolü (NextAuth API'leri hariç)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
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

  // Giriş yapan kullanıcıların erişemeyeceği sayfa kontrolü
  if (ROUTES_DOMAIN.MIDDLEWARE.GUEST_ONLY.PAGES.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.GUEST_ONLY.PAGES[number])) {
    try {
      const token = await getToken({ req: request });
      
      if (token) {
        // Giriş yapmış kullanıcı, anasayfaya yönlendir
        return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.HOME, request.url));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }

  // Giriş yapan kullanıcıların erişemeyeceği API kontrolü
  if (ROUTES_DOMAIN.MIDDLEWARE.GUEST_ONLY.API.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.GUEST_ONLY.API[number])) {
    try {
      const token = await getToken({ req: request });
      
      if (token) {
        // Giriş yapmış kullanıcı, 403 döndür
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'Bu işlem için giriş yapmamış olmanız gerekiyor',
            code: 'ALREADY_AUTHENTICATED',
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }

  // Giriş yapmamış kullanıcıların erişemeyeceği sayfa kontrolü
  if (ROUTES_DOMAIN.MIDDLEWARE.AUTH_REQUIRED.PAGES.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.AUTH_REQUIRED.PAGES[number])) {
    try {
      const token = await getToken({ req: request });
      
      if (!token) {
        // Giriş yapmamış kullanıcı, giriş sayfasına yönlendir
        return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.AUTH.LOGIN, request.url));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }

  // Giriş yapmamış kullanıcıların erişemeyeceği API kontrolü
  if (ROUTES_DOMAIN.MIDDLEWARE.AUTH_REQUIRED.API.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.AUTH_REQUIRED.API[number])) {
    try {
      const token = await getToken({ req: request });
      
      if (!token) {
        // Giriş yapmamış kullanıcı, 401 döndür
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'Bu işlem için giriş yapmanız gerekiyor',
            code: 'AUTHENTICATION_REQUIRED',
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }

  // Admin yetkisi kontrolü
  if (ROUTES_DOMAIN.MIDDLEWARE.ADMIN_ONLY.PAGES.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.ADMIN_ONLY.PAGES[number]) ||
      ROUTES_DOMAIN.MIDDLEWARE.ADMIN_ONLY.API.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.ADMIN_ONLY.API[number])) {
    try {
      const token = await getToken({ req: request });
      
      if (!token) {
        // Giriş yapmamış kullanıcı
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: 'Bu işlem için giriş yapmanız gerekiyor',
              code: 'AUTHENTICATION_REQUIRED',
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.AUTH.LOGIN, request.url));
        }
      }
      
      // Admin yetkisi kontrolü
      if (token.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: 'Bu işlem için admin yetkisi gerekiyor',
              code: 'INSUFFICIENT_PERMISSIONS',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.HOME, request.url));
        }
      }
    } catch (error) {
      console.error('Admin check error:', error);
    }
  }

  // Editör yetkisi kontrolü
  if (ROUTES_DOMAIN.MIDDLEWARE.EDITOR_ONLY.PAGES.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.EDITOR_ONLY.PAGES[number]) ||
      ROUTES_DOMAIN.MIDDLEWARE.EDITOR_ONLY.API.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.EDITOR_ONLY.API[number])) {
    try {
      const token = await getToken({ req: request });
      
      if (!token) {
        // Giriş yapmamış kullanıcı
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: 'Bu işlem için giriş yapmanız gerekiyor',
              code: 'AUTHENTICATION_REQUIRED',
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.AUTH.LOGIN, request.url));
        }
      }
      
      // Editör yetkisi kontrolü (admin veya editor)
      if (token.role !== 'admin' && token.role !== 'editor') {
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: 'Bu işlem için editör yetkisi gerekiyor',
              code: 'INSUFFICIENT_PERMISSIONS',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.HOME, request.url));
        }
      }
    } catch (error) {
      console.error('Editor check error:', error);
    }
  }

  // Moderatör yetkisi kontrolü
  if (ROUTES_DOMAIN.MIDDLEWARE.MODERATOR_ONLY.PAGES.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.MODERATOR_ONLY.PAGES[number]) ||
      ROUTES_DOMAIN.MIDDLEWARE.MODERATOR_ONLY.API.includes(pathname as typeof ROUTES_DOMAIN.MIDDLEWARE.MODERATOR_ONLY.API[number])) {
    try {
      const token = await getToken({ req: request });
      
      if (!token) {
        // Giriş yapmamış kullanıcı
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: 'Bu işlem için giriş yapmanız gerekiyor',
              code: 'AUTHENTICATION_REQUIRED',
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.AUTH.LOGIN, request.url));
        }
      }
      
      // Moderatör yetkisi kontrolü (admin veya moderator)
      if (token.role !== 'admin' && token.role !== 'moderator') {
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: 'Bu işlem için moderatör yetkisi gerekiyor',
              code: 'INSUFFICIENT_PERMISSIONS',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return NextResponse.redirect(new URL(ROUTES_DOMAIN.PAGES.HOME, request.url));
        }
      }
    } catch (error) {
      console.error('Moderator check error:', error);
    }
  }

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