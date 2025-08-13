'use client';

import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsMutations } from '@/lib/hooks/use-settings-mutations';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loading } from '@/components/ui/loading';
import { Theme, TitleLanguage, ScoreFormat, UserProfileSettings } from '@prisma/client';
import { ANIME } from '@/lib/constants/anime.constants';
import { USER } from '@/lib/constants/user.constants';
import { useEffect, useState } from 'react';

export function GeneralSettings() {
  const { settings, isLoading } = useSettings();
  const { 
    updateThemeMutation,
    updateTitleLanguageMutation,
    updateScoreFormatMutation,
    updateDisplayAdultContentMutation,
    updateAutoTrackMutation
  } = useSettingsMutations();
  const { updateSetting } = useSettingsStore();

  // Local state for optimistic updates
  const [localSettings, setLocalSettings] = useState({
    themePreference: (settings as UserProfileSettings)?.themePreference || Theme.SYSTEM,
    titleLanguagePreference: (settings as UserProfileSettings)?.titleLanguagePreference || TitleLanguage.ROMAJI,
    scoreFormat: (settings as UserProfileSettings)?.scoreFormat || ScoreFormat.POINT_10,
    displayAdultContent: (settings as UserProfileSettings)?.displayAdultContent ?? true,
    autoTrackOnAniwaListAdd: (settings as UserProfileSettings)?.autoTrackOnAniwaListAdd ?? false,
  });

  // Update local state when settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        themePreference: (settings as UserProfileSettings).themePreference || Theme.SYSTEM,
        titleLanguagePreference: (settings as UserProfileSettings).titleLanguagePreference || TitleLanguage.ROMAJI,
        scoreFormat: (settings as UserProfileSettings).scoreFormat || ScoreFormat.POINT_10,
        displayAdultContent: (settings as UserProfileSettings).displayAdultContent ?? true,
        autoTrackOnAniwaListAdd: (settings as UserProfileSettings).autoTrackOnAniwaListAdd ?? false,
      });
    }
  }, [settings]);

  // Handle theme change
  const handleThemeChange = (theme: Theme) => {
    setLocalSettings(prev => ({ ...prev, themePreference: theme }));
    updateSetting('themePreference', theme);
    updateThemeMutation.mutate({ themePreference: theme });
  };

  // Handle title language change
  const handleTitleLanguageChange = (language: TitleLanguage) => {
    setLocalSettings(prev => ({ ...prev, titleLanguagePreference: language }));
    updateSetting('titleLanguagePreference', language);
    updateTitleLanguageMutation.mutate({ titleLanguagePreference: language });
  };

  // Handle score format change
  const handleScoreFormatChange = (format: ScoreFormat) => {
    setLocalSettings(prev => ({ ...prev, scoreFormat: format }));
    updateSetting('scoreFormat', format);
    updateScoreFormatMutation.mutate({ scoreFormat: format });
  };

  // Handle display adult content change
  const handleDisplayAdultContentChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, displayAdultContent: checked }));
    updateSetting('displayAdultContent', checked);
    updateDisplayAdultContentMutation.mutate({ displayAdultContent: checked });
  };

  // Handle auto track change
  const handleAutoTrackChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, autoTrackOnAniwaListAdd: checked }));
    updateSetting('autoTrackOnAniwaListAdd', checked);
    updateAutoTrackMutation.mutate({ autoTrackOnAniwaListAdd: checked });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
          <CardDescription>Uygulama genelinde geçerli olan tercihleriniz</CardDescription>
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
        <CardTitle>Genel Ayarlar</CardTitle>
        <CardDescription>Uygulama genelinde geçerli olan tercihleriniz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tema Tercihi */}
        <div className="space-y-2">
          <Label htmlFor="theme">Tema</Label>
          <Select
            value={localSettings.themePreference}
            onValueChange={(value) => handleThemeChange(value as Theme)}
            disabled={updateThemeMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tema seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Theme.SYSTEM}>Sistem</SelectItem>
              <SelectItem value={Theme.LIGHT}>Açık</SelectItem>
              <SelectItem value={Theme.DARK}>Koyu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Başlık Dili */}
        <div className="space-y-2">
          <Label htmlFor="titleLanguage">Başlık Dili</Label>
          <Select
            value={localSettings.titleLanguagePreference}
            onValueChange={(value) => handleTitleLanguageChange(value as TitleLanguage)}
            disabled={updateTitleLanguageMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Başlık dili seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TitleLanguage.ROMAJI}>{ANIME.TITLE_LANGUAGE_LABELS.ROMAJI}</SelectItem>
              <SelectItem value={TitleLanguage.ENGLISH}>{ANIME.TITLE_LANGUAGE_LABELS.ENGLISH}</SelectItem>
              <SelectItem value={TitleLanguage.NATIVE}>{ANIME.TITLE_LANGUAGE_LABELS.NATIVE}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Puanlama Formatı */}
        <div className="space-y-2">
          <Label htmlFor="scoreFormat">Puanlama Formatı</Label>
          <Select
            value={localSettings.scoreFormat}
            onValueChange={(value) => handleScoreFormatChange(value as ScoreFormat)}
            disabled={updateScoreFormatMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Puanlama formatı seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ScoreFormat.POINT_100}>{USER.SCORE_FORMAT_LABELS.POINT_100} puanlık sistem</SelectItem>
              <SelectItem value={ScoreFormat.POINT_10}>{USER.SCORE_FORMAT_LABELS.POINT_10} puanlık sistem</SelectItem>
              <SelectItem value={ScoreFormat.POINT_5}>{USER.SCORE_FORMAT_LABELS.POINT_5} puanlık sistem</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Yetişkin İçerik Gösterimi */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="displayAdultContent">Yetişkin İçerik Göster</Label>
            <p className="text-sm text-muted-foreground">
              Yetişkin içerikli animeleri göster veya gizle
            </p>
          </div>
          <Switch
            id="displayAdultContent"
            checked={localSettings.displayAdultContent}
            onCheckedChange={handleDisplayAdultContentChange}
            disabled={updateDisplayAdultContentMutation.isPending}
          />
        </div>

        {/* Otomatik Takip */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoTrack">Otomatik Takip</Label>
            <p className="text-sm text-muted-foreground">
              Anime listesine eklediğimde otomatik olarak takip etmeye başla
            </p>
          </div>
          <Switch
            id="autoTrack"
            checked={localSettings.autoTrackOnAniwaListAdd}
            onCheckedChange={handleAutoTrackChange}
            disabled={updateAutoTrackMutation.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
