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
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { ANIME } from '@/lib/constants/anime.constants';
import { USER } from '@/lib/constants/user.constants';

export function GeneralSettings() {
  // Settings hook'u kullan
  const { data: userData } = useSettings();
  const { settings } = useSettingsStore();
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
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
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
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
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
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
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
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
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
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Auto track update error:', error);
      toast.error(error.message || 'Otomatik takip ayarı güncellenemedi');
    },
  });

  // Auto-save handlers
  const handleThemeChange = (value: string) => {
    updateThemeMutation.mutate({ themePreference: value as Theme });
  };

  const handleTitleLanguageChange = (value: string) => {
    updateTitleLanguageMutation.mutate({ titleLanguagePreference: value as TitleLanguage });
  };

  const handleScoreFormatChange = (value: string) => {
    updateScoreFormatMutation.mutate({ scoreFormat: value as ScoreFormat });
  };

  const handleDisplayAdultContentChange = (checked: boolean) => {
    updateDisplayAdultContentMutation.mutate({ displayAdultContent: checked });
  };

  const handleAutoTrackChange = (checked: boolean) => {
    updateAutoTrackMutation.mutate({ autoTrackOnAniwaListAdd: checked });
  };

  if (!settings) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Theme Preference */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Tema Tercihi</h3>
          <p className="text-sm text-muted-foreground">
            Uygulamanın görünüm temasını seçin
          </p>
        </div>
        <Form {...themeForm}>
          <FormField
            control={themeForm.control}
            name="themePreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tema</FormLabel>
                <Select
                  onValueChange={handleThemeChange}
                  defaultValue={field.value}
                  disabled={updateThemeMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tema seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Theme.LIGHT}>Açık</SelectItem>
                    <SelectItem value={Theme.DARK}>Koyu</SelectItem>
                    <SelectItem value={Theme.SYSTEM}>Sistem</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Title Language Preference */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Başlık Dili</h3>
          <p className="text-sm text-muted-foreground">
            Anime başlıklarının hangi dilde gösterileceğini seçin
          </p>
        </div>
        <Form {...titleLanguageForm}>
          <FormField
            control={titleLanguageForm.control}
            name="titleLanguagePreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Başlık Dili</FormLabel>
                <Select
                  onValueChange={handleTitleLanguageChange}
                  defaultValue={field.value}
                  disabled={updateTitleLanguageMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Başlık dili seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TitleLanguage.ROMAJI}>{ANIME.TITLE_LANGUAGE_LABELS[TitleLanguage.ROMAJI]}</SelectItem>
                    <SelectItem value={TitleLanguage.ENGLISH}>{ANIME.TITLE_LANGUAGE_LABELS[TitleLanguage.ENGLISH]}</SelectItem>
                    <SelectItem value={TitleLanguage.NATIVE}>{ANIME.TITLE_LANGUAGE_LABELS[TitleLanguage.NATIVE]}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Score Format */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Puanlama Formatı</h3>
          <p className="text-sm text-muted-foreground">
            Anime puanlarının hangi formatta gösterileceğini seçin
          </p>
        </div>
        <Form {...scoreFormatForm}>
          <FormField
            control={scoreFormatForm.control}
            name="scoreFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puanlama Formatı</FormLabel>
                <Select
                  onValueChange={handleScoreFormatChange}
                  defaultValue={field.value}
                  disabled={updateScoreFormatMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Puanlama formatı seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ScoreFormat.POINT_100}>{USER.SCORE_FORMAT_LABELS[ScoreFormat.POINT_100]}</SelectItem>
                    <SelectItem value={ScoreFormat.POINT_10}>{USER.SCORE_FORMAT_LABELS[ScoreFormat.POINT_10]}</SelectItem>
                    <SelectItem value={ScoreFormat.POINT_5}>{USER.SCORE_FORMAT_LABELS[ScoreFormat.POINT_5]}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Display Adult Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Yetişkin İçerik Gösterimi</h3>
          <p className="text-sm text-muted-foreground">
            Yetişkin içerikli animelerin gösterilip gösterilmeyeceğini belirleyin
          </p>
        </div>
        <Form {...displayAdultContentForm}>
          <FormField
            control={displayAdultContentForm.control}
            name="displayAdultContent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Yetişkin İçerik Göster
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Yetişkin içerikli animeleri göster
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleDisplayAdultContentChange}
                    disabled={updateDisplayAdultContentMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Auto Track */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Otomatik Takip</h3>
          <p className="text-sm text-muted-foreground">
            Anime listesine eklediğinizde otomatik olarak takip edilsin
          </p>
        </div>
        <Form {...autoTrackForm}>
          <FormField
            control={autoTrackForm.control}
            name="autoTrackOnAniwaListAdd"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Otomatik Takip Et
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Listeye eklediğinizde otomatik takip et
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleAutoTrackChange}
                    disabled={updateAutoTrackMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>
    </div>
  );
} 