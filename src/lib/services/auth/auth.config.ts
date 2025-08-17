import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ROUTES } from '@/lib/constants/routes.constants';
import { AUTH } from '@/lib/constants/auth.constants';

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

        // Kullanıcıyı bul
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { userSettings: true }
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
          roles: user.roles,
          profilePicture: user.profilePicture,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: AUTH.SESSION.MAX_AGE,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user && 'username' in user && 'roles' in user) {
        const u = user as { username: string; roles: string[]; profilePicture?: string };
        token.username = u.username;
        token.roles = u.roles;
        token.profilePicture = u.profilePicture;
      }
      // Client-side update() çağrıları
      if (trigger === 'update' && session?.user) {
        if (session.user.username) token.username = session.user.username;
        if (session.user.roles) token.roles = session.user.roles;
        if (session.user.profilePicture) token.profilePicture = session.user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.username = token.username as string;
        session.user.roles = token.roles as string[];
        session.user.profilePicture = token.profilePicture as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: ROUTES.PAGES.AUTH.LOGIN
  },
};