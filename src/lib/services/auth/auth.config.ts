import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ROUTES_DOMAIN, AUTH_DOMAIN } from '@/lib/constants';

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Sadece authentication için gerekli alanları çek
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: {
            id: true,
            username: true,
            email: true,
            passwordHash: true,
            roles: true, // Bitwise role system - Int field
            profilePicture: true
          }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Şifre kontrolü
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Son giriş zamanını güncelle
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.roles, // Bitwise role system
          profilePicture: user.profilePicture,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: AUTH_DOMAIN.BUSINESS.SESSION.MAX_AGE,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user && 'username' in user && 'role' in user) {
        const u = user as { username: string; role: number; profilePicture?: string };
        token.username = u.username;
        token.role = u.role; // Bitwise role system
        token.profilePicture = u.profilePicture;
      }
      // Client-side update() çağrıları
      if (trigger === 'update' && session?.user) {
        if (session.user.username) token.username = session.user.username;
        if (session.user.role) token.role = session.user.role; // Bitwise role system
        if (session.user.profilePicture) token.profilePicture = session.user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.username = token.username as string;
        session.user.role = token.role as number; // Bitwise role system
        session.user.profilePicture = token.profilePicture as string | undefined;
      }
      return session;
    }
  },
  pages: {
        signIn: ROUTES_DOMAIN.PAGES.AUTH.LOGIN
  },
};