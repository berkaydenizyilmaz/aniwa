import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProfile } from '@/services/business/profile.service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, Bell, Key, Settings } from 'lucide-react'
import { ROUTES } from '@/constants'
import AccountSettings from './_components/account-settings'
import ProfileSettings from './_components/profile-settings'
import PrivacySettings from './_components/privacy-settings'
import NotificationSettings from './_components/notification-settings'
import GeneralSettings from './_components/general-settings'

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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Genel</span>
          </TabsTrigger>
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

        {/* Genel Ayarlar */}
        <TabsContent value="general" className="space-y-6">
          <GeneralSettings user={user} />
        </TabsContent>

        {/* Hesap Ayarları */}
        <TabsContent value="account" className="space-y-6">
          <AccountSettings user={user} />
        </TabsContent>

        {/* Profil Ayarları */}
        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings user={user} />
        </TabsContent>

        {/* Gizlilik Ayarları */}
        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings user={user} />
        </TabsContent>

        {/* Bildirim Ayarları */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 