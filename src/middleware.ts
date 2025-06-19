import { NextResponse } from 'next/server';

export default async function middleware() {
  // Rate limiting mantığı buraya gelecek
  // Şimdilik sadece isteği devam ettiriyoruz

  return NextResponse.next();
}

// Middleware'ın hangi rotalarda çalışacağını burada belirleyeceğiz (örneğin tüm /api rotaları)
export const config = {
  matcher: [
    /*
     * Eşleştirmek istediğin rotaları buraya ekleyebilirsin.
     * Örneğin, tüm API rotaları için: '/api/:path*'
     * Veya sadece belirli bir rota için: '/api/login'
     */
  ],
};