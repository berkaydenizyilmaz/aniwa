// Bu dosya kimlik doğrulama sistemini yönetir

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db/prisma'
import { env } from './env'
import { logInfo, logError, logWarn } from '@/services/business/logger.service'
import { LOG_EVENTS } from '@/constants'
import { AUTH } from '@/constants/auth'
import { ROUTES } from '@/constants'
import { generateUsernameFromName, generateUserSlug } from '@/lib/utils'
import { USER_ROLES } from '@/constants'
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
            roles: user.roles,
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
    maxAge: AUTH.SESSION_MAX_AGE,
  },

  jwt: {
    maxAge: AUTH.JWT_MAX_AGE,
  },

  pages: {
    signIn: ROUTES.PAGES.AUTH.SIGN_IN,
    error: ROUTES.PAGES.AUTH.ERROR,
    verifyRequest: ROUTES.PAGES.AUTH.VERIFY_REQUEST,
  },

  callbacks: {
    async jwt({ token, user }) {
      // İlk giriş
      if (user) {
        token.id = user.id
        token.username = user.username
        token.roles = user.roles
        token.image = user.image
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string | null
        session.user.roles = token.roles
      }

      return session
    },

    async signIn({ user, account, profile }) {
      try {
        // OAuth ile giriş yapılıyorsa
        if (account?.provider === AUTH.OAUTH_PROVIDERS.GOOGLE && profile) {
          // Mevcut kullanıcı kontrolü
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email!.toLowerCase() }
          })

          if (existingUser) {
            // Mevcut kullanıcı - bilgileri güncelle
            user.id = existingUser.id
            user.username = existingUser.username
            user.roles = existingUser.roles
            
            logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'Mevcut kullanıcı OAuth girişi', {
              userId: existingUser.id,
              email: existingUser.email,
              provider: account.provider
            }, existingUser.id)
            
            return true
          }

          // Yeni kullanıcı oluştur
          const username = await generateUsernameFromName(profile.name || user.email!.split('@')[0])
          const slug = generateUserSlug(username)

          // Transaction ile kullanıcı + ayarları oluştur
          const newUser = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
              data: {
                email: user.email!.toLowerCase(),
                username,
                slug,
                roles: [USER_ROLES.USER],
                image: profile.picture,
              }
            })

            // Varsayılan ayarları oluştur
            await tx.userProfileSettings.create({
              data: {
                userId: createdUser.id,
              }
            })

            return createdUser
          })

          // User objesini güncelle
          user.id = newUser.id
          user.username = newUser.username
          user.roles = newUser.roles

          logInfo(LOG_EVENTS.AUTH_USER_CREATED, 'OAuth kullanıcısı oluşturuldu', {
            userId: newUser.id,
            email: newUser.email,
            username: newUser.username,
            slug: newUser.slug,
            provider: account.provider
          }, newUser.id)
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