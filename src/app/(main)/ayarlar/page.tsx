'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings2, Shield, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfileSettings } from '@/components/modules/user/settings/profile-settings';
import { GeneralSettings } from '@/components/modules/user/settings/general-settings';
import { PrivacySettings } from '@/components/modules/user/settings/privacy-settings';
import { NotificationSettings } from '@/components/modules/user/settings/notification-settings';

export default function SettingsPage() {
  const [active, setActive] = useState<'profile' | 'general' | 'privacy' | 'notifications'>('profile');

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Hesap ve uygulama tercihleri</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        {/* Sidebar */}
        <aside className="rounded-lg border bg-card">
          <nav className="p-2 md:p-3 flex md:flex-col gap-2">
            {[
              { key: 'profile', label: 'Profil', icon: User },
              { key: 'general', label: 'Genel', icon: Settings2 },
              { key: 'privacy', label: 'Gizlilik', icon: Shield },
              { key: 'notifications', label: 'Bildirimler', icon: Bell },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = active === (item.key as typeof active);
              return (
                <Button
                  key={item.key}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'justify-start h-9 w-full',
                    isActive ? 'border-l-2 border-primary' : 'hover:bg-accent/40'
                  )}
                  onClick={() => setActive(item.key as typeof active)}
                >
                  <Icon className="h-4 w-4 mr-2 opacity-80" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Panel */}
        <section>
          <Card>
            <CardHeader className="pb-3">
              {active === 'profile' && (
                <>
                  <CardTitle>Profil Bilgileri</CardTitle>
                  <CardDescription>Kişisel bilgiler ve profil içerikleri</CardDescription>
                </>
              )}
              {active === 'general' && (
                <>
                  <CardTitle>Genel Tercihler</CardTitle>
                  <CardDescription>Uygulama genelinde geçerli ayarlar</CardDescription>
                </>
              )}
              {active === 'privacy' && (
                <>
                  <CardTitle>Gizlilik Ayarları</CardTitle>
                  <CardDescription>Görünürlük ve paylaşım tercihleri</CardDescription>
                </>
              )}
              {active === 'notifications' && (
                <>
                  <CardTitle>Bildirim Ayarları</CardTitle>
                  <CardDescription>Hangi bildirimleri almak istediğini seç</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="p-4 md:p-5">
              {active === 'profile' && <ProfileSettings />}
              {active === 'general' && <GeneralSettings />}
              {active === 'privacy' && <PrivacySettings />}
              {active === 'notifications' && <NotificationSettings />}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}