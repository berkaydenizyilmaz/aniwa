// Aniwa Projesi - Rate Limit Test Endpoint
// Bu endpoint rate limiting'i test etmek için kullanılır

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit/middleware'

async function handler(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'Rate limit test başarılı',
    timestamp: new Date().toISOString(),
    ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
  })
}

// Test için küçük bir limit (5 request/dakika)
const testConfig = {
  requests: 5,
  window: '1 m' as `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`,
  algorithm: 'slidingWindow' as const,
}

export const GET = withRateLimit(testConfig, handler, {
  message: 'Test rate limit aşıldı. 1 dakika bekleyip tekrar deneyin.',
}) 