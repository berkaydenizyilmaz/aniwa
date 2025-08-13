'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { 
  updateThemePreferenceAction,
  updateTitleLanguagePreferenceAction,
  updateScoreFormatAction,
  updateDisplayAdultContentAction,
  updateAutoTrackOnAniwaListAddAction,
} from '@/lib/actions/user/settings.actions';
import { 
  updateThemePreferenceSchema,
  updateTitleLanguagePreferenceSchema,
  updateScoreFormatSchema,
  updateDisplayAdultContentSchema,
  updateAutoTrackOnAniwaListAddSchema,
  type UpdateThemePreferenceInput,
  type UpdateTitleLanguagePreferenceInput,
  type UpdateScoreFormatInput,
  type UpdateDisplayAdultContentInput,
  type UpdateAutoTrackOnAniwaListAddInput
} from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Theme, TitleLanguage, ScoreFormat } from '@prisma/client';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { useSession } from 'next-auth/react';
import { ANIME } from '@/lib/constants/anime.constants';
import { USER } from '@/lib/constants/user.constants';

export function GeneralSettings() {
  const { settings, updateSetting } = useSettingsStore();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Theme preference form
  const themeForm = useForm<UpdateThemePreferenceInput>({
    resolver: zodResolver(updateThemePreferenceSchema),
    defaultValues: {
      themePreference: Theme.LIGHT,
    },
  });

  // Title language preference form
  const titleLanguageForm = useForm<UpdateTitleLanguagePreferenceInput>({
    resolver: zodResolver(updateTitleLanguagePreferenceSchema),
    defaultValues: {
      titleLanguagePreference: TitleLanguage.ROMAJI,
    },
  });

  // Score format form
  const scoreFormatForm = useForm<UpdateScoreFormatInput>({
    resolver: zodResolver(updateScoreFormatSchema),
    defaultValues: {
      scoreFormat: ScoreFormat.POINT_100,
    },
  });

  // Display adult content form
  const displayAdultContentForm = useForm<UpdateDisplayAdultContentInput>({
    resolver: zodResolver(updateDisplayAdultContentSchema),
    defaultValues: {
      displayAdultContent: true,
    },
  });

  // Auto track form
  const autoTrackForm = useForm<UpdateAutoTrackOnAniwaListAddInput>({
    resolver: zodResolver(updateAutoTrackOnAniwaListAddSchema),
    defaultValues: {
      autoTrackOnAniwaListAdd: false,
    },
  });

  // Form'ları settings data yüklendikten sonra güncelle
  useEffect(() => {
    if (settings) {
      themeForm.reset({ themePreference: settings.themePreference || Theme.LIGHT });
      titleLanguageForm.reset({ titleLanguagePreference: settings.titleLanguagePreference || TitleLanguage.ROMAJI });
      scoreFormatForm.reset({ scoreFormat: settings.scoreFormat || ScoreFormat.POINT_100 });
      displayAdultContentForm.reset({ displayAdultContent: settings.displayAdultContent ?? true });
      autoTrackForm.reset({ autoTrackOnAniwaListAdd: settings.autoTrackOnAniwaListAdd ?? false });
    }
  }, [settings, themeForm, titleLanguageForm, scoreFormatForm, displayAdultContentForm, autoTrackForm]);

  // Mutations
  const updateThemeMutation = useMutation({
    mutationFn: updateThemePreferenceAction,
    onSuccess: () => {
      toast.success('Tema tercihi güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Theme update error:', error);
      toast.error(error.message || 'Tema tercihi güncellenemedi');
    },
  });

  const updateTitleLanguageMutation = useMutation({
    mutationFn: updateTitleLanguagePreferenceAction,
    onSuccess: () => {
      toast.success('Başlık dili tercihi güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Title language update error:', error);
      toast.error(error.message || 'Başlık dili tercihi güncellenemedi');
    },
  });

  const updateScoreFormatMutation = useMutation({
    mutationFn: updateScoreFormatAction,
    onSuccess: () => {
      toast.success('Puanlama formatı güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Score format update error:', error);
      toast.error(error.message || 'Puanlama formatı güncellenemedi');
    },
  });

  const updateDisplayAdultContentMutation = useMutation({
    mutationFn: updateDisplayAdultContentAction,
    onSuccess: () => {
      toast.success('Yetişkin içerik ayarı güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Display adult content update error:', error);
      toast.error(error.message || 'Yetişkin içerik ayarı güncellenemedi');
    },
  });

  const updateAutoTrackMutation = useMutation({
    mutationFn: updateAutoTrackOnAniwaListAddAction,
    onSuccess: () => {
      toast.success('Otomatik takip ayarı güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Auto track update error:', error);
      toast.error(error.message || 'Otomatik takip ayarı güncellenemedi');
    },
  });

  // Auto-save handlers
  const handleThemeChange = (value: string) => {
    updateThemeMutation.mutate(
      { themePreference: value as Theme },
      {
        onSuccess: () => {
          updateSetting('themePreference', value as Theme);
        }
      }
    );
  };

  const handleTitleLanguageChange = (value: string) => {
    updateTitleLanguageMutation.mutate(
      { titleLanguagePreference: value as TitleLanguage },
      {
        onSuccess: () => {
          updateSetting('titleLanguagePreference', value as TitleLanguage);
        }
      }
    );
  };

  const handleScoreFormatChange = (value: string) => {
    updateScoreFormatMutation.mutate(
      { scoreFormat: value as ScoreFormat },
      {
        onSuccess: () => {
          updateSetting('scoreFormat', value as ScoreFormat);
        }
      }
    );
  };

  const handleDisplayAdultContentChange = (checked: boolean) => {
    updateDisplayAdultContentMutation.mutate(
      { displayAdultContent: checked },
      {
        onSuccess: () => {
          updateSetting('displayAdultContent', checked);
        }
      }
    );
  };

  const handleAutoTrackChange = (checked: boolean) => {
    updateAutoTrackMutation.mutate(
      { autoTrackOnAniwaListAdd: checked },
      {
        onSuccess: () => {
          updateSetting('autoTrackOnAniwaListAdd', checked);
        }
      }
    );
  };

  if (!settings) return <Loading variant="card" lines={4} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Tema</h4>
          <p className="text-xs text-muted-foreground mb-3">Uygulama görünümü</p>
          <Form {...themeForm}>
            <FormField
              control={themeForm.control}
              name="themePreference"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={handleThemeChange} defaultValue={field.value} disabled={updateThemeMutation.isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Theme.LIGHT}>Açık</SelectItem>
                        <SelectItem value={Theme.DARK}>Koyu</SelectItem>
                        <SelectItem value={Theme.SYSTEM}>Sistem</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Başlık Dili</h4>
          <p className="text-xs text-muted-foreground mb-3">Anime başlık gösterimi</p>
          <Form {...titleLanguageForm}>
            <FormField
              control={titleLanguageForm.control}
              name="titleLanguagePreference"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={handleTitleLanguageChange} defaultValue={field.value} disabled={updateTitleLanguageMutation.isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Dil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TitleLanguage.ROMAJI}>{ANIME.TITLE_LANGUAGE_LABELS[TitleLanguage.ROMAJI]}</SelectItem>
                        <SelectItem value={TitleLanguage.ENGLISH}>{ANIME.TITLE_LANGUAGE_LABELS[TitleLanguage.ENGLISH]}</SelectItem>
                        <SelectItem value={TitleLanguage.NATIVE}>{ANIME.TITLE_LANGUAGE_LABELS[TitleLanguage.NATIVE]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Puanlama</h4>
          <p className="text-xs text-muted-foreground mb-3">Skor formatı</p>
          <Form {...scoreFormatForm}>
            <FormField
              control={scoreFormatForm.control}
              name="scoreFormat"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={handleScoreFormatChange} defaultValue={field.value} disabled={updateScoreFormatMutation.isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ScoreFormat.POINT_100}>{USER.SCORE_FORMAT_LABELS[ScoreFormat.POINT_100]}</SelectItem>
                        <SelectItem value={ScoreFormat.POINT_10}>{USER.SCORE_FORMAT_LABELS[ScoreFormat.POINT_10]}</SelectItem>
                        <SelectItem value={ScoreFormat.POINT_5}>{USER.SCORE_FORMAT_LABELS[ScoreFormat.POINT_5]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Yetişkin İçerik</h4>
          <p className="text-xs text-muted-foreground mb-3">Uygunsuz içerikleri filtrele</p>
          <Form {...displayAdultContentForm}>
            <FormField
              control={displayAdultContentForm.control}
              name="displayAdultContent"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Göster</FormLabel>
                      <div className="text-xs text-muted-foreground">Yetişkin içerikleri göster</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={handleDisplayAdultContentChange} disabled={updateDisplayAdultContentMutation.isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="text-sm font-medium mb-2">Otomatik Takip</h4>
        <p className="text-xs text-muted-foreground mb-3">Listeye eklediğinde otomatik takip et</p>
        <Form {...autoTrackForm}>
          <FormField
            control={autoTrackForm.control}
            name="autoTrackOnAniwaListAdd"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Aktif</FormLabel>
                    <div className="text-xs text-muted-foreground">Listelere hızlı takip</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={handleAutoTrackChange} disabled={updateAutoTrackMutation.isPending} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </Card>
    </div>
  );
} 