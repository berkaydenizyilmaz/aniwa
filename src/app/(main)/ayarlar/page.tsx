'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileSettings } from '@/components/modules/user/settings/profile-settings';
import { GeneralSettings } from '@/components/modules/user/settings/general-settings';
import { PrivacySettings } from '@/components/modules/user/settings/privacy-settings';
import { NotificationSettings } from '@/components/modules/user/settings/notification-settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">Hesap ayarlarınızı ve tercihlerinizi yönetin.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="privacy">Gizlilik</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi ve profil ayarlarınızı güncelleyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genel Tercihler</CardTitle>
              <CardDescription>
                Uygulama genelindeki tercihlerinizi ayarlayın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gizlilik Ayarları</CardTitle>
              <CardDescription>
                Profilinizin görünürlüğünü ve gizlilik tercihlerinizi yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>
                Bildirim tercihlerinizi ve ayarlarınızı yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}