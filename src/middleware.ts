import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { withGlobalRateLimit } from '@/lib/rate-limit/middleware'
import { ROUTES, ROUTE_ACCESS, USER_ROLES } from '@/constants'

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname
    const token = req.nextauth.token
    
    // 0. RATE LIMITING - Tüm istekler için genel rate limiting kontrolü
    const rateLimitResponse = await withGlobalRateLimit(req, () => NextResponse.next())
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse
    }
    
    // 1. GİRİŞ YAPMIŞ KULLANICILAR - Guest-only sayfalarına ve API'lerine erişemez
    if (token) {
      // Guest-only sayfalarına erişemez
      if (ROUTE_ACCESS.GUEST_ONLY_ROUTES.some(route => pathname === route)) {
        return NextResponse.redirect(new URL(ROUTES.PAGES.HOME, req.url))
      }
      // Guest-only API'lerine erişemez
      if (ROUTE_ACCESS.GUEST_ONLY_API_ROUTES.some(route => pathname === route)) {
        return NextResponse.json({ error: 'Zaten giriş yapmışsınız' }, { status: 403 })
      }
    }

    // 2. ADMIN SAYFALARI - ADMIN rolü gerekli
    if (pathname.startsWith(ROUTES.PAGES.ADMIN.BASE)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.ADMIN)) {
        return NextResponse.redirect(new URL(ROUTES.PAGES.HOME, req.url))
      }
    }

    // 3. MODERATOR SAYFALARI - MODERATOR rolü gerekli
    if (pathname.startsWith(ROUTES.PAGES.MODERATOR.BASE)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.MODERATOR)) {
        return NextResponse.redirect(new URL(ROUTES.PAGES.HOME, req.url))
      }
    }

    // 4. EDITOR SAYFALARI - EDITOR rolü gerekli
    if (pathname.startsWith(ROUTES.PAGES.EDITOR.BASE)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.EDITOR)) {
        return NextResponse.redirect(new URL(ROUTES.PAGES.HOME, req.url))
      }
    }

    // 5. ADMIN API'LERİ - ADMIN rolü gerekli
    if (pathname.startsWith(ROUTES.API.ADMIN.BASE)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.ADMIN)) {
        return NextResponse.json(
          { success: false, error: 'Bu işlem için admin yetkisi gereklidir.' },
          { status: 403 }
        )
      }
    }

    // 6. MODERATOR API'LERİ - MODERATOR rolü gerekli
    if (pathname.startsWith(ROUTES.API.MODERATOR.BASE)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.MODERATOR)) {
        return NextResponse.json(
          { success: false, error: 'Bu işlem için moderatör yetkisi gereklidir.' },
          { status: 403 }
        )
      }
    }

    // 7. EDITOR API'LERİ - EDITOR rolü gerekli
    if (pathname.startsWith(ROUTES.API.EDITOR.BASE)) {
      if (!token || !(token.roles as UserRole[])?.includes(USER_ROLES.EDITOR)) {
        return NextResponse.json(
          { success: false, error: 'Bu işlem için editör yetkisi gereklidir.' },
          { status: 403 }
        )
      }
    }

    // 8. GİRİŞ GEREKTİREN API'LER - Auth gerekli
    if (ROUTE_ACCESS.AUTH_REQUIRED_API_ROUTES.some(route => pathname.startsWith(route))) {
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Bu işlem için giriş yapmanız gereklidir.' },
          { status: 401 }
        )
      }
    }

    // 9. GİRİŞ GEREKTİREN SAYFALAR - Auth gerekli
    if (ROUTE_ACCESS.AUTH_REQUIRED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
      if (!token) {
        return NextResponse.redirect(new URL(ROUTES.PAGES.AUTH.SIGN_IN, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // 1. NextAuth kendi API rotaları - Her zaman erişilebilir (session, providers, vs)
        if (pathname.startsWith(ROUTES.API.AUTH.BASE) && !pathname.startsWith(ROUTES.API.AUTH.SIGNUP)) {
          return true
        }

        // 2. Auth API'leri - Token kontrolü middleware'de yapılacak
        if (pathname === ROUTES.API.AUTH.SIGNUP) {
          return true
        }

        // 3. Ana sayfa - Her zaman erişilebilir
        if (pathname === ROUTES.PAGES.HOME) {
          return true
        }

        // 4. Public sayfalar - Her zaman erişilebilir
        if (ROUTE_ACCESS.PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + ROUTES.PAGES.HOME))) {
          return true
        }

        // 5. Guest-only sayfaları - Token kontrolü middleware fonksiyonunda yapılacak
        if (ROUTE_ACCESS.GUEST_ONLY_ROUTES.some(route => pathname === route)) {
          return true
        }

        // 6. Protected sayfalar - Token gerekli
        if (pathname.startsWith(ROUTES.PAGES.ADMIN.BASE) || 
            pathname.startsWith(ROUTES.PAGES.MODERATOR.BASE) || 
            pathname.startsWith(ROUTES.PAGES.EDITOR.BASE)) {
          return !!token
        }

        // 7. Auth gerekli sayfalar - Token gerekli
        if (ROUTE_ACCESS.AUTH_REQUIRED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
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