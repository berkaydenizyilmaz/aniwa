// Aniwa Projesi - NextAuth Konfigürasyonu
// Bu dosya kimlik doğrulama sistemini yönetir

import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { env } from './env'
import { logInfo, logError, logWarn } from './logger'
import { LOG_EVENTS } from './constants/logging'
import { SESSION_MAX_AGE, JWT_MAX_AGE, OAUTH_PROVIDERS } from './constants/auth'
import { DEFAULT_THEME, DEFAULT_LANGUAGE } from './constants/app'
import { AUTH_ROUTES } from './constants/routes'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          image: profile.picture,
          // Username'i null bırak - sonradan seçtirilecek
          username: null,
          role: 'USER' as const,
        }
      },
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
      }

      return session
    },

    async signIn({ user, account }) {
      try {
        // OAuth ile giriş yapılıyorsa
        if (account?.provider === OAUTH_PROVIDERS.GOOGLE) {
          // Mevcut kullanıcıyı kontrol et
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          // Eğer kullanıcı var ama username'i yoksa, username seçim sayfasına yönlendir
          if (existingUser && !existingUser.username) {
            // URL'de username seçim gerektiğini belirt
            return `${AUTH_ROUTES.SETUP_USERNAME}?email=${encodeURIComponent(user.email!)}`
          }

          logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'Google OAuth başarılı', {
            userId: user.id,
            email: user.email,
            provider: account.provider
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
      // Relative URL'leri base URL ile birleştir
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Aynı origin'deyse izin ver
      else if (new URL(url).origin === baseUrl) return url
      // Varsayılan olarak base URL'e yönlendir
      return baseUrl
    }
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      const eventData = {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser
      }

      if (isNewUser) {
        logInfo(LOG_EVENTS.AUTH_USER_CREATED, 'Yeni kullanıcı oluşturuldu', eventData, user.id)
        
        // Yeni kullanıcı için varsayılan ayarları oluştur
        try {
          await prisma.userProfileSettings.create({
            data: {
              userId: user.id,
              themePreference: DEFAULT_THEME,
              languagePreference: DEFAULT_LANGUAGE
            }
          })
        } catch (error) {
          logError(LOG_EVENTS.AUTH_USER_SETTINGS_ERROR, 'Kullanıcı ayarları oluşturulamadı', {
            ...eventData,
            error: error instanceof Error ? error.message : 'Bilinmeyen hata'
          }, user.id)
        }
      } else {
        logInfo(LOG_EVENTS.AUTH_LOGIN_SUCCESS, 'Kullanıcı giriş yaptı', eventData, user.id)
      }
    },

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