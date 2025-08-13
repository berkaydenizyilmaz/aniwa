'use client';

import { GeneralSettings } from '@/components/modules/user/settings/general-settings';
import { PrivacySettings } from '@/components/modules/user/settings/privacy-settings';
import { NotificationSettings } from '@/components/modules/user/settings/notification-settings';
import { ProfileSettings } from '@/components/modules/user/settings/profile-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 px-2 md:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Hesap ve uygulama tercihleri</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="privacy">Gizlilik</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}