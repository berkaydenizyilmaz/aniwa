'use client';

import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsMutations } from '@/lib/hooks/use-settings-mutations';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loading } from '@/components/ui/loading';
import { ProfileVisibility, UserProfileSettings } from '@prisma/client';
import { USER_DOMAIN } from '@/lib/constants';
import { useEffect, useState } from 'react';

export function PrivacySettings() {
  const { settings, isLoading } = useSettings();
  const {
    updateProfileVisibilityMutation,
    updateAllowFollowsMutation,
    updateShowAnimeListMutation,
    updateShowFavouriteAnimeMutation,
    updateShowCustomListsMutation
  } = useSettingsMutations();
  const { updateSetting } = useSettingsStore();

  // Local state for optimistic updates
  const [localSettings, setLocalSettings] = useState<{
    profileVisibility: ProfileVisibility;
    allowFollows: boolean;
    showAnimeList: boolean;
    showFavouriteAnimeSeries: boolean;
    showCustomLists: boolean;
  }>({
    profileVisibility: ProfileVisibility.PUBLIC,
    allowFollows: true,
    showAnimeList: true,
    showFavouriteAnimeSeries: true,
    showCustomLists: true,
  });

  // Update local state when settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        profileVisibility: (settings as UserProfileSettings).profileVisibility || ProfileVisibility.PUBLIC,
        allowFollows: (settings as UserProfileSettings).allowFollows ?? true,
        showAnimeList: (settings as UserProfileSettings).showAnimeList ?? true,
        showFavouriteAnimeSeries: (settings as UserProfileSettings).showFavouriteAnimeSeries ?? true,
        showCustomLists: (settings as UserProfileSettings).showCustomLists ?? true,
      });
    }
  }, [settings]);

  // Handle profile visibility change
  const handleProfileVisibilityChange = (visibility: ProfileVisibility) => {
    setLocalSettings(prev => ({ ...prev, profileVisibility: visibility }));
    updateSetting('profileVisibility', visibility);
    updateProfileVisibilityMutation.mutate({ profileVisibility: visibility });
  };

  // Handle allow follows change
  const handleAllowFollowsChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, allowFollows: checked }));
    updateSetting('allowFollows', checked);
    updateAllowFollowsMutation.mutate({ allowFollows: checked });
  };

  // Handle show anime list change
  const handleShowAnimeListChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, showAnimeList: checked }));
    updateSetting('showAnimeList', checked);
    updateShowAnimeListMutation.mutate({ showAnimeList: checked });
  };

  // Handle show favourite anime change
  const handleShowFavouriteAnimeChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, showFavouriteAnimeSeries: checked }));
    updateSetting('showFavouriteAnimeSeries', checked);
    updateShowFavouriteAnimeMutation.mutate({ showFavouriteAnimeSeries: checked });
  };

  // Handle show custom lists change
  const handleShowCustomListsChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, showCustomLists: checked }));
    updateSetting('showCustomLists', checked);
    updateShowCustomListsMutation.mutate({ showCustomLists: checked });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gizlilik Ayarları</CardTitle>
          <CardDescription>Profilinizin görünürlüğü ve paylaşım tercihleriniz</CardDescription>
        </CardHeader>
        <CardContent>
          <Loading variant="card" lines={5} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gizlilik Ayarları</CardTitle>
        <CardDescription>Profilinizin görünürlüğü ve paylaşım tercihleriniz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profil Görünürlüğü */}
        <div className="space-y-2">
          <Label htmlFor="profileVisibility">Profil Görünürlüğü</Label>
          <Select
            value={localSettings.profileVisibility}
            onValueChange={(value) => handleProfileVisibilityChange(value as ProfileVisibility)}
            disabled={updateProfileVisibilityMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Profil görünürlüğü seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProfileVisibility.PUBLIC}>{USER_DOMAIN.UI.PROFILE_VISIBILITY_LABELS.PUBLIC}</SelectItem>
              <SelectItem value={ProfileVisibility.FOLLOWERS_ONLY}>{USER_DOMAIN.UI.PROFILE_VISIBILITY_LABELS.FOLLOWERS_ONLY}</SelectItem>
              <SelectItem value={ProfileVisibility.PRIVATE}>{USER_DOMAIN.UI.PROFILE_VISIBILITY_LABELS.PRIVATE}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Takip İzinleri */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowFollows">Takip İzinleri</Label>
            <p className="text-sm text-muted-foreground">
              Diğer kullanıcıların sizi takip etmesine izin ver
            </p>
          </div>
          <Switch
            id="allowFollows"
            checked={localSettings.allowFollows}
            onCheckedChange={handleAllowFollowsChange}
            disabled={updateAllowFollowsMutation.isPending}
          />
        </div>

        {/* Anime Listesi Gösterimi */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showAnimeList">Anime Listesi Göster</Label>
            <p className="text-sm text-muted-foreground">
              Profilinizde anime listenizi göster veya gizle
            </p>
          </div>
          <Switch
            id="showAnimeList"
            checked={localSettings.showAnimeList}
            onCheckedChange={handleShowAnimeListChange}
            disabled={updateShowAnimeListMutation.isPending}
          />
        </div>

        {/* Favori Animeler Gösterimi */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showFavouriteAnime">Favori Animeler Göster</Label>
            <p className="text-sm text-muted-foreground">
              Profilinizde favori animelerinizi göster veya gizle
            </p>
          </div>
          <Switch
            id="showFavouriteAnime"
            checked={localSettings.showFavouriteAnimeSeries}
            onCheckedChange={handleShowFavouriteAnimeChange}
            disabled={updateShowFavouriteAnimeMutation.isPending}
          />
        </div>

        {/* Özel Listeler Gösterimi */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showCustomLists">Özel Listeler Göster</Label>
            <p className="text-sm text-muted-foreground">
              Profilinizde özel listelerinizi göster veya gizle
            </p>
          </div>
          <Switch
            id="showCustomLists"
            checked={localSettings.showCustomLists}
            onCheckedChange={handleShowCustomListsChange}
            disabled={updateShowCustomListsMutation.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
