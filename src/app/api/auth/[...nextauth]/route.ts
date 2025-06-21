// Aniwa Projesi - NextAuth API Route Handler
// Bu dosya NextAuth'un tüm kimlik doğrulama endpoint'lerini yönetir

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 