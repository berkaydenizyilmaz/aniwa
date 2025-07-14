import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProfileByUsername } from '@/services/business/profile.service'
import Image from 'next/image'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Profil sayfası bileşeni
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  
  // Giriş yapmış kullanıcı varsa ID'sini al
  const session = await getServerSession(authOptions)
  const viewerId = session?.user?.id

  // Profil bilgilerini getir
  const result = await getUserProfileByUsername(username, viewerId)
  
  // Kullanıcı bulunamadı veya gizli profil
  if (!result.success || !result.data) {
    notFound()
  }

  const user = result.data
  const isOwnProfile = viewerId === user.id

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profil Header */}
      <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Profil Resmi */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              {user.profilePicture ? (
                <Image 
                  src={user.profilePicture} 
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Profil Bilgileri */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              {isOwnProfile && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  Kendi Profilin
                </span>
              )}
            </div>
            
            {user.bio && (
              <p className="text-muted-foreground mb-4">{user.bio}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Katılma: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
              {user.lastLoginAt && (
                <span>Son giriş: {new Date(user.lastLoginAt).toLocaleDateString('tr-TR')}</span>
              )}
            </div>
          </div>

          {/* Profil Banner */}
          {user.profileBanner && (
            <div className="hidden md:block w-32 h-20 rounded-lg overflow-hidden">
              <Image 
                src={user.profileBanner} 
                alt="Profil banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Profil İçerikleri */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana İçerik */}
        <div className="lg:col-span-2 space-y-6">
          {/* Anime Listesi Önizleme */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Anime Listesi</h2>
            <div className="text-center text-muted-foreground py-8">
              <p>Anime listesi özelliği henüz eklenmedi</p>
            </div>
          </div>

          {/* Aktiviteler */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Son Aktiviteler</h2>
            <div className="text-center text-muted-foreground py-8">
              <p>Aktivite akışı henüz eklenmedi</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* İstatistikler */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">İstatistikler</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toplam Anime:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ortalama Puan:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">İzlenen Bölüm:</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </div>

          {/* Favori Animeler */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Favori Animeler</h3>
            <div className="text-center text-muted-foreground py-4">
              <p>Henüz favori anime eklenmemiş</p>
            </div>
          </div>

          {/* Takipçi/Takip Edilenler */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Sosyal</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Takipçiler:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Takip Ettikleri:</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Metadata oluşturma
export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params
  
  const result = await getUserProfileByUsername(username)
  
  if (!result.success || !result.data) {
    return {
      title: 'Kullanıcı Bulunamadı - Aniwa',
    }
  }

  const user = result.data
  
  return {
    title: `${user.username} - Aniwa`,
    description: user.bio || `${user.username} kullanıcısının Aniwa profili`,
  }
} 