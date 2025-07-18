// Auth.js tip genişletmeleri

import 'next-auth';
import 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    roles: string[];
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    roles: string[];
  }
} 