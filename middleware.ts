// Aniwa Projesi - NextAuth Middleware
// Bu dosya route seviyesinde kimlik doğrulama ve yetkilendirme kontrolü yapar

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname
    const token = req.nextauth.token

    // Admin rotaları için rol kontrolü
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Moderator rotaları için rol kontrolü
    if (pathname.startsWith('/moderation')) {
      const allowedRoles = ['ADMIN', 'MODERATOR']
      if (!token?.role || !allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Editor rotaları için rol kontrolü
    if (pathname.startsWith('/editor')) {
      const allowedRoles = ['ADMIN', 'MODERATOR', 'EDITOR']
      if (!token?.role || !allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Username setup kontrolü - OAuth sonrası
    if (pathname.startsWith('/auth/setup-username')) {
      // Setup sayfasına erişim için login gerekli ama username olmamalı
      if (!token || token.username) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Username eksik kullanıcıları setup sayfasına yönlendir
    if (token && !token.username && !pathname.startsWith('/auth/setup-username') && !pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/auth/setup-username', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public rotalar - herkes erişebilir
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/about',
          '/contact',
          '/anime', // Anime listesi public olabilir
        ]

        // API rotaları için özel kontrol
        if (pathname.startsWith('/api/auth/')) {
          return true // NextAuth API rotaları her zaman erişilebilir
        }

        // Public route kontrolü
        if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
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