import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProfile } from '@/services/business/profile.service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Shield, Bell, Key } from 'lucide-react'
import { ROUTES } from '@/constants'

export const metadata: Metadata = {
  title: 'Ayarlar - Aniwa',
  description: 'Hesap ve profil ayarlarınızı yönetin',
}

// Ayarlar sayfası bileşeni
export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  // Kullanıcı profilini getir
  const result = await getUserProfile(session!.user.id)
  if (!result.success || !result.data) {
    redirect(ROUTES.PAGES.AUTH.SIGN_IN)
  }

  const user = result.data

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground mt-2">
          Hesabınızı ve profil ayarlarınızı yönetin
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Hesap</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Gizlilik</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Bildirimler</span>
          </TabsTrigger>
        </TabsList>

        {/* Hesap Ayarları */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
              <CardDescription>
                Giriş bilgilerinizi ve hesap güvenliğinizi yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Şifre Değiştirme */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Şifre Değiştir</h3>
                <p className="text-sm text-muted-foreground">
                  Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">Şifre değiştirme formu buraya gelecek</p>
                </div>
              </div>

              {/* Email Değiştirme */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">E-posta Adresi</h3>
                <p className="text-sm text-muted-foreground">
                  Mevcut e-posta: {user.email}
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">E-posta değiştirme formu buraya gelecek</p>
                </div>
              </div>

              {/* Username Değiştirme */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Kullanıcı Adı</h3>
                <p className="text-sm text-muted-foreground">
                  Mevcut kullanıcı adı: @{user.username}
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">Kullanıcı adı değiştirme formu buraya gelecek</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Kullanıcı adınızı ayda sadece 1 kez değiştirebilirsiniz
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profil Ayarları */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>
                Profilinizde görünecek bilgileri düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profil Fotoğrafı */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profil Fotoğrafı</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">Profil fotoğrafı yükleme formu buraya gelecek</p>
                </div>
              </div>

              {/* Banner */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profil Banner</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">Banner yükleme formu buraya gelecek</p>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Hakkımda</h3>
                <p className="text-sm text-muted-foreground">
                  Kendinizi tanıtın (maksimum 500 karakter)
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">Bio düzenleme formu buraya gelecek</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Mevcut bio: {user.bio || 'Henüz bio eklenmemiş'}
                  </p>
                </div>
              </div>

              {/* Diğer Bilgiler */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Diğer Bilgiler</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">Doğum tarihi, konum vb. formlar buraya gelecek</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gizlilik Ayarları */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gizlilik Ayarları</CardTitle>
              <CardDescription>
                Profilinizin ve bilgilerinizin görünürlüğünü kontrol edin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profil Görünürlüğü */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profil Görünürlüğü</h3>
                <p className="text-sm text-muted-foreground">
                  Profilinizi kimler görebilir?
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">
                    Mevcut ayar: {user.userSettings?.profileVisibility || 'PUBLIC'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Profil görünürlük ayarları buraya gelecek
                  </p>
                </div>
              </div>

              {/* Anime Listesi Gizliliği */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Anime Listesi Gizliliği</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">
                    Mevcut ayar: {user.userSettings?.showAnimeList ? 'Göster' : 'Gizle'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Anime listesi gizlilik ayarları buraya gelecek
                  </p>
                </div>
              </div>

              {/* Takipçi Listesi */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Takipçi/Takip Listesi</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">
                    Takip izni: {user.userSettings?.allowFollows ? 'Açık' : 'Kapalı'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Takipçi listesi gizlilik ayarları buraya gelecek
                  </p>
                </div>
              </div>

              {/* Yetişkin İçeriği */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Yetişkin İçeriği</h3>
                <p className="text-sm text-muted-foreground">
                  18+ içerikli animelerin görünürlüğü
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">
                    Mevcut ayar: {user.userSettings?.displayAdultContent ? 'Göster' : 'Gizle'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Yetişkin içeriği ayarları buraya gelecek
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bildirim Ayarları */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>
                Hangi bildirimleri almak istediğinizi seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* E-posta Bildirimleri */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">E-posta Bildirimleri</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">
                    Yeni takipçi: {user.userSettings?.receiveNotificationOnNewFollow ? 'Açık' : 'Kapalı'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    E-posta bildirim ayarları buraya gelecek
                  </p>
                </div>
              </div>

              {/* Site Bildirimleri */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Site Bildirimleri</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm">
                    Bölüm yayını: {user.userSettings?.receiveNotificationOnEpisodeAiring ? 'Açık' : 'Kapalı'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Site bildirim ayarları buraya gelecek
                  </p>
                </div>
              </div>

              {/* Bildirim Türleri */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Bildirim Türleri</h3>
                <div className="p-4 border rounded-lg space-y-2">
                  <p className="text-sm">• Yeni takipçi bildirimleri</p>
                  <p className="text-sm">• Yorum bildirimleri</p>
                  <p className="text-sm">• Beğeni bildirimleri</p>
                  <p className="text-sm">• Sistem bildirimleri</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Detaylı bildirim türü ayarları buraya gelecek
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 