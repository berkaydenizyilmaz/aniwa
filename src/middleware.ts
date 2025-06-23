// Aniwa Projesi - NextAuth Middleware + Rate Limiting
// Bu dosya route seviyesinde kimlik doğrulama, yetkilendirme ve rate limiting kontrolü yapar

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { PROTECTED_ROUTE_PATTERNS, PUBLIC_ROUTE_LIST, AUTH_ROUTES, API_ROUTES, PUBLIC_ROUTES } from '@/lib/constants/routes'
import { USER_ROLES } from "@/lib/constants/auth"
import { HTTP_STATUS } from '@/lib/constants/app'
import { UserRole } from "@prisma/client"
import { withGlobalRateLimit } from '@/lib/rate-limit/middleware'

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname
    const token = req.nextauth.token
    
    // 0. RATE LIMITING - Tüm istekler için genel rate limiting kontrolü
    const rateLimitResponse = await withGlobalRateLimit(req, () => NextResponse.next())
    if (rateLimitResponse.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      return rateLimitResponse
    }
    
    // 1. GİRİŞ YAPMIŞ KULLANICILAR - Auth sayfalarına ve API'lerine erişemez
    if (token && !token.oauthToken) {
      // Auth sayfalarına erişemez
      if (pathname === AUTH_ROUTES.SIGN_IN || pathname === AUTH_ROUTES.SIGN_UP) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
      // Auth API'lerine erişemez
      if (pathname === API_ROUTES.AUTH.SIGNUP) {
        return NextResponse.json({ error: 'Zaten giriş yapmışsınız' }, { status: 403 })
      }
    }

    // 2. OAUTH KULLANICILAR - Username setup kontrolü
    if (token && token.oauthToken && token.oauthToken !== 'existing_user') {
      // OAuth kullanıcısı username setup sayfasında değilse oraya yönlendir
      if (!pathname.startsWith(AUTH_ROUTES.SETUP_USERNAME) && !pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.SETUP_USERNAME, req.url))
      }
    }

    // 2.1. OAUTH EXPIRED - Token süresi dolmuş kullanıcıları sessiz çıkış yaptır
    if (token && token.oauthExpired) {
      // Sessiz çıkış yap ve ana sayfaya yönlendir (onay ekranı olmadan)
      const signoutUrl = new URL(API_ROUTES.AUTH.SIGN_OUT, req.url)
      signoutUrl.searchParams.set('callbackUrl', PUBLIC_ROUTES.HOME)
      signoutUrl.searchParams.set('redirect', 'false')
      return NextResponse.redirect(signoutUrl)
    }

    // 3. USERNAME SETUP SAYFASI - Sadece OAuth kullanıcıları erişebilir
    if (pathname.startsWith(AUTH_ROUTES.SETUP_USERNAME)) {
      if (!token || !token.oauthToken) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    // 4. ADMIN SAYFALARI - ADMIN rolü gerekli
    if (pathname.startsWith(PROTECTED_ROUTE_PATTERNS.ADMIN)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.ADMIN)) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    // 5. MODERATOR SAYFALARI - MODERATOR rolü gerekli
    if (pathname.startsWith(PROTECTED_ROUTE_PATTERNS.MODERATOR)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.MODERATOR)) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    // 6. EDITOR SAYFALARI - EDITOR rolü gerekli
    if (pathname.startsWith(PROTECTED_ROUTE_PATTERNS.EDITOR)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.EDITOR)) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTES.HOME, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // 1. NextAuth kendi API rotaları - Her zaman erişilebilir (session, providers, vs)
        if (pathname.startsWith(API_ROUTES.AUTH.BASE) && !pathname.startsWith(API_ROUTES.AUTH.SIGNUP)) {
          return true
        }

        // 2. Auth API'leri - Token kontrolü middleware'de yapılacak
        if (pathname === API_ROUTES.AUTH.SIGNUP) {
          return true
        }

        // 3. Ana sayfa - Her zaman erişilebilir
        if (pathname === PUBLIC_ROUTES.HOME) {
          return true
        }

        // 4. Public sayfalar - Her zaman erişilebilir
        if (PUBLIC_ROUTE_LIST.some(route => pathname === route || pathname.startsWith(route + PUBLIC_ROUTES.HOME))) {
          return true
        }

        // 5. Auth sayfaları - Token kontrolü middleware fonksiyonunda yapılacak
        if (pathname === AUTH_ROUTES.SIGN_IN || pathname === AUTH_ROUTES.SIGN_UP) {
          return true
        }

        // 6. Username setup - OAuth token kontrolü middleware fonksiyonunda yapılacak
        if (pathname.startsWith(AUTH_ROUTES.SETUP_USERNAME)) {
          return true
        }

        // 7. Protected sayfalar - Token gerekli
        if (pathname.startsWith(PROTECTED_ROUTE_PATTERNS.ADMIN) || 
            pathname.startsWith(PROTECTED_ROUTE_PATTERNS.MODERATOR) || 
            pathname.startsWith(PROTECTED_ROUTE_PATTERNS.EDITOR)) {
          return !!token
        }

        // 8. Diğer tüm sayfalar şu an için public
        return true
      },
    },
  }
)

// Middleware'in çalışacağı rotaları belirt
export const config = {
  matcher: [
    /*
     * Şu rotalar hariç tüm rotaları kontrol et:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public klasöründeki dosyalar
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 