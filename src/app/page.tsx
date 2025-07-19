'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Aniwa</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-gray-700">
                    Merhaba, {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/giris"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/kayit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Anime Takip Platformuna Hoş Geldiniz
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            İzlediğiniz animeleri takip edin, puanlayın ve yorum yapın.
          </p>
          
          {session ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Başarıyla giriş yaptınız! 🎉
              </p>
              <div className="flex justify-center space-x-4">
                                 <Link
                   href="/dashboard"
                   className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                 >
                   Dashboard&apos;a Git
                 </Link>
                <Link
                  href="/profile"
                  className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
                >
                  Profil
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Başlamak için giriş yapın veya kayıt olun.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/auth/giris"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/kayit"
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Anime Takibi</h3>
            <p className="text-gray-600">
              İzlediğiniz animeleri listeleyin ve takip edin.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Puanlama</h3>
            <p className="text-gray-600">
              Animeleri puanlayın ve değerlendirin.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Yorumlar</h3>
            <p className="text-gray-600">
              Diğer kullanıcılarla yorum yapın ve tartışın.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
