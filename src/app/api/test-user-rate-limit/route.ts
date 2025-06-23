// Aniwa Projesi - User Tier Rate Limit Test Endpoint
// Bu endpoint kullanıcı seviyesine göre rate limiting'i test etmek için kullanılır

import { NextRequest, NextResponse } from 'next/server'
import { withUserTierRateLimit } from '@/lib/rate-limit/middleware'
import { getToken } from 'next-auth/jwt'

async function userTierTestHandler(request: NextRequest): Promise<NextResponse> {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  return NextResponse.json({
    success: true,
    message: 'User tier rate limit test başarılı',
    timestamp: new Date().toISOString(),
    user: token ? {
      id: token.sub,
      email: token.email,
      emailVerified: token.emailVerified,
      tier: token.emailVerified ? 'verified' : 'registered'
    } : null,
    userTier: token ? (token.emailVerified ? 'verified' : 'registered') : 'guest',
    ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
  })
}

export const GET = withUserTierRateLimit(userTierTestHandler, {
  message: 'Kullanıcı seviyesi rate limit test aşıldı.',
  endpoint: 'user-tier-test',
}) 