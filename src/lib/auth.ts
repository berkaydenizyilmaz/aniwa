// Aniwa Projesi - NextAuth Konfigürasyonu
// Bu dosya kimlik doğrulama sistemini yönetir

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { env } from './env'
import { logInfo, logError, logWarn } from './logger'
import { LOG_EVENTS } from './constants/logging'
import { SESSION_MAX_AGE, JWT_MAX_AGE, OAUTH_PROVIDERS } from './constants/auth'
import { AUTH_ROUTES } from './constants/routes'
import { createOAuthPendingUser } from '@/services/auth/oauth.service'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          logWarn(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Eksik kimlik bilgileri')
          return null
        }

        try {
          // Kullanıcıyı username ile bul
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          })

          if (!user || !user.passwordHash) {
            logWarn(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Kullanıcı bulunamadı', {
              username: credentials.username
            })
            return null
          }

          // Şifre kontrolü
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isPasswordValid) {
            logWarn(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Geçersiz şifre', {
              userId: user.id,
              username: credentials.username
            })
            return null
          }

          logInfo(LOG_EVENTS.AUTH_LOGIN_SUCCESS, 'Başarılı giriş', {
            userId: user.id,
            username: user.username
          }, user.id)

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image || user.profilePicture,
            role: user.role,
          }
        } catch (error) {
          logError(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Giriş hatası', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata',
            username: credentials.username
          })
          return null
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },

  jwt: {
    maxAge: JWT_MAX_AGE,
  },

  pages: {
    signIn: AUTH_ROUTES.SIGN_IN,
    error: AUTH_ROUTES.ERROR,
    verifyRequest: AUTH_ROUTES.VERIFY_REQUEST,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // İlk giriş
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
        token.image = user.image
        
        // OAuth token'ı varsa ekle
        if (user.oauthToken) {
          token.oauthToken = user.oauthToken
        }
      }

      // OAuth provider bilgilerini ekle
      if (account) {
        token.provider = account.provider
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string | null
        session.user.role = token.role
        session.user.provider = token.provider as string
        
        // OAuth token'ı varsa ekle
        if (token.oauthToken) {
          session.user.oauthToken = token.oauthToken
        }
      }

      return session
    },

    async signIn({ user, account, profile }) {
      try {
        // OAuth ile giriş yapılıyorsa
        if (account?.provider === OAUTH_PROVIDERS.GOOGLE && profile) {
          // Geçici kullanıcı oluştur veya mevcut kullanıcıyı kontrol et
                     const result = await createOAuthPendingUser({
             email: user.email!,
             provider: account.provider,
             providerId: account.providerAccountId,
             name: profile.name,
             image: profile.picture
           })

          if (!result.success) {
            logError(LOG_EVENTS.AUTH_OAUTH_FAILED, 'OAuth geçici kullanıcı oluşturulamadı', {
              email: user.email,
              provider: account.provider,
              error: result.error
            })
            return false
          }

          // Token'ı user objesine ekle (username seçimi için)
          user.oauthToken = result.data!.token

          logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'Google OAuth başarılı', {
            email: user.email,
            provider: account.provider,
            hasToken: !!result.data?.token
          })
        }

        return true
      } catch (error) {
        logError(LOG_EVENTS.AUTH_SIGNIN_ERROR, 'SignIn callback hatası', {
          error: error instanceof Error ? error.message : 'Bilinmeyen hata',
          userId: user.id,
          provider: account?.provider
        })
        return false
      }
    },

    async redirect({ url, baseUrl }) {
      // OAuth sonrası username seçim kontrolü
      if (url === baseUrl || url === `${baseUrl}/`) {
        // Ana sayfaya yönlendiriliyorsa, session'ı kontrol et
        // Bu kısım client-side'da yapılacak
        return baseUrl
      }

      // Relative URL'leri base URL ile birleştir
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Aynı origin'deyse izin ver
      else if (new URL(url).origin === baseUrl) return url
      // Varsayılan olarak base URL'e yönlendir
      return baseUrl
    }
  },

  events: {
    async signOut({ session }) {
      if (session?.user?.id) {
        logInfo(LOG_EVENTS.AUTH_LOGOUT_SUCCESS, 'Kullanıcı çıkış yaptı', {
          userId: session.user.id,
          email: session.user.email
        }, session.user.id)
      }
    },
  },

  debug: env.NODE_ENV === 'development',
} 