'use client';

import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsMutations } from '@/lib/hooks/use-settings-mutations';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loading } from '@/components/ui/loading';
import { UserProfileSettings } from '@prisma/client';
import { useEffect, useState } from 'react';

export function NotificationSettings() {
  const { settings, isLoading } = useSettings();
  const { updateNotificationSettingsMutation } = useSettingsMutations();
  const { updateSetting } = useSettingsStore();

  // Local state for optimistic updates
  const [localSettings, setLocalSettings] = useState({
    receiveNotificationOnNewFollow: (settings as UserProfileSettings)?.receiveNotificationOnNewFollow ?? true,
    receiveNotificationOnEpisodeAiring: (settings as UserProfileSettings)?.receiveNotificationOnEpisodeAiring ?? true,
    receiveNotificationOnNewMediaPart: (settings as UserProfileSettings)?.receiveNotificationOnNewMediaPart ?? true,
  });

  // Update local state when settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        receiveNotificationOnNewFollow: (settings as UserProfileSettings).receiveNotificationOnNewFollow ?? true,
        receiveNotificationOnEpisodeAiring: (settings as UserProfileSettings).receiveNotificationOnEpisodeAiring ?? true,
        receiveNotificationOnNewMediaPart: (settings as UserProfileSettings).receiveNotificationOnNewMediaPart ?? true,
      });
    }
  }, [settings]);

  // Handle notification settings change
  const handleNotificationSettingsChange = (key: keyof typeof localSettings, checked: boolean) => {
    const newSettings = { ...localSettings, [key]: checked };
    setLocalSettings(newSettings);
    
    // Update store
    updateSetting('receiveNotificationOnNewFollow', newSettings.receiveNotificationOnNewFollow);
    updateSetting('receiveNotificationOnEpisodeAiring', newSettings.receiveNotificationOnEpisodeAiring);
    updateSetting('receiveNotificationOnNewMediaPart', newSettings.receiveNotificationOnNewMediaPart);
    
    // Send to server
    updateNotificationSettingsMutation.mutate(newSettings);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bildirim Ayarları</CardTitle>
          <CardDescription>Hangi durumlarda bildirim almak istediğinizi belirleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <Loading variant="card" lines={3} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bildirim Ayarları</CardTitle>
        <CardDescription>Hangi durumlarda bildirim almak istediğinizi belirleyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Yeni Takipçi Bildirimi */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="newFollowNotification">Yeni Takipçi Bildirimi</Label>
            <p className="text-sm text-muted-foreground">
              Biri sizi takip ettiğinde bildirim al
            </p>
          </div>
          <Switch
            id="newFollowNotification"
            checked={localSettings.receiveNotificationOnNewFollow}
            onCheckedChange={(checked) => handleNotificationSettingsChange('receiveNotificationOnNewFollow', checked)}
            disabled={updateNotificationSettingsMutation.isPending}
          />
        </div>

        {/* Bölüm Yayın Bildirimi */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="episodeAiringNotification">Bölüm Yayın Bildirimi</Label>
            <p className="text-sm text-muted-foreground">
              Takip ettiğiniz animelerin yeni bölümleri yayınlandığında bildirim al
            </p>
          </div>
          <Switch
            id="episodeAiringNotification"
            checked={localSettings.receiveNotificationOnEpisodeAiring}
            onCheckedChange={(checked) => handleNotificationSettingsChange('receiveNotificationOnEpisodeAiring', checked)}
            disabled={updateNotificationSettingsMutation.isPending}
          />
        </div>

        {/* Yeni Medya Parçası Bildirimi */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="newMediaPartNotification">Yeni Medya Parçası Bildirimi</Label>
            <p className="text-sm text-muted-foreground">
              Takip ettiğiniz animelerin yeni sezonları/filmleri eklendiğinde bildirim al
            </p>
          </div>
          <Switch
            id="newMediaPartNotification"
            checked={localSettings.receiveNotificationOnNewMediaPart}
            onCheckedChange={(checked) => handleNotificationSettingsChange('receiveNotificationOnNewMediaPart', checked)}
            disabled={updateNotificationSettingsMutation.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
