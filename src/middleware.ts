import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware logic will be implemented later
  return NextResponse.next();
}

// Middleware'in çalışacağı path'ler
export const config = {
  matcher: [
    // API route'ları
    '/api/:path*',
    // Auth sayfaları
    '/auth/:path*',
    // Korumalı sayfalar
    '/profile/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
}; 