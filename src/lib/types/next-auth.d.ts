// NextAuth.js tip genişletmeleri
import 'next-auth';
import 'next-auth/jwt';
import { DefaultSession } from 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    username: string;
    roles: UserRole[];
    profilePicture?: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      roles: UserRole[];
      profilePicture?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    roles: UserRole[];
    profilePicture?: string;
  }
} 