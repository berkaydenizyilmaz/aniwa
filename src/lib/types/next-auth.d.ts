// NextAuth.js tip genişletmeleri
import 'next-auth';
import 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    role: number; // Bitwise role system
    profilePicture?: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      role: number; // Bitwise role system
      profilePicture?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    role: number; // Bitwise role system
    profilePicture?: string;
  }
} 