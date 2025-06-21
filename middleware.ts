// Aniwa Projesi - NextAuth Middleware
// Bu dosya route seviyesinde kimlik doğrulama ve yetkilendirme kontrolü yapar

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { PROTECTED_ROUTE_PATTERNS, PUBLIC_ROUTE_LIST, AUTH_ROUTES, API_ROUTES, PUBLIC_ROUTES } from '@/lib/constants/routes'

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname
    const token = req.nextauth.token

    // Admin rotaları için rol kontrolü
    if (pathname.startsWith(PROTECTED_ROUTE_PATTERNS.ADMIN)) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    // Moderator rotaları için rol kontrolü
    if (pathname.startsWith(PROTECTED_ROUTE_PATTERNS.MODERATOR)) {
      const allowedRoles = ['ADMIN', 'MODERATOR']
      if (!token?.role || !allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    // Editor rotaları için rol kontrolü
    if (pathname.startsWith(PROTECTED_ROUTE_PATTERNS.EDITOR)) {
      const allowedRoles = ['ADMIN', 'MODERATOR', 'EDITOR']
      if (!token?.role || !allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    // OAuth token kontrolü - OAuth sonrası username seçimi gerekiyor
    if (token && token.oauthToken && !pathname.startsWith(AUTH_ROUTES.SETUP_USERNAME) && !pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.SETUP_USERNAME, req.url))
    }

    // Username setup kontrolü - OAuth token'ı olan kullanıcılar için
    if (pathname.startsWith(AUTH_ROUTES.SETUP_USERNAME)) {
      // Setup sayfasına erişim için OAuth token gerekli
      if (!token || !token.oauthToken) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // API rotaları için özel kontrol
        if (pathname.startsWith(API_ROUTES.AUTH.BASE)) {
          return true // NextAuth API rotaları her zaman erişilebilir
        }

        // Public route kontrolü
                  if (PUBLIC_ROUTE_LIST.some(route => pathname === route || pathname.startsWith(route + '/'))) {
          return true
        }

        // Protected rotalar için token gerekli
        return !!token
      },
    },
  }
)

// Middleware'in çalışacağı rotaları belirt
export const config = {
  matcher: [
    /*
     * Şu rotalar hariç tüm rotaları kontrol et:
     * - api (API rotaları hariç /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public klasöründeki dosyalar
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 