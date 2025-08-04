'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateGeneralSettingsAction, getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { updateGeneralSettingsSchema, type UpdateGeneralSettingsInput } from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';
import { Theme, TitleLanguage, ScoreFormat } from '@prisma/client';

export function GeneralSettings() {
  const queryClient = useQueryClient();

  const form = useForm<UpdateGeneralSettingsInput>({
    resolver: zodResolver(updateGeneralSettingsSchema),
    defaultValues: {
      themePreference: undefined,
      titleLanguagePreference: undefined,
      displayAdultContent: false,
      scoreFormat: undefined,
      autoTrackOnAniwaListAdd: false,
    },
  });

  // Kullanıcı ayarlarını getir
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettingsAction,
  });

  // Form'u güncelle
  useEffect(() => {
    if (userData?.success && userData.data) {
      const { settings } = userData.data as GetUserSettingsResponse;
      if (settings) {
        form.reset({
          themePreference: settings.themePreference,
          titleLanguagePreference: settings.titleLanguagePreference,
          displayAdultContent: settings.displayAdultContent,
          scoreFormat: settings.scoreFormat,
          autoTrackOnAniwaListAdd: settings.autoTrackOnAniwaListAdd,
        });
      }
    }
  }, [userData, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateGeneralSettingsInput) => updateGeneralSettingsAction(data),
    onSuccess: () => {
      toast.success('Genel ayarlar başarıyla güncellendi!');
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Update general settings error:', error);
      toast.error('Güncelleme başarısız oldu');
    },
  });

  const onSubmit = async (data: UpdateGeneralSettingsInput) => {
    updateMutation.mutate(data);
  };

  if (isLoadingUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
          <CardDescription>
            Genel uygulama ayarlarınızı yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Ayarlar</CardTitle>
        <CardDescription>
          Genel uygulama ayarlarınızı yönetin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tema Tercihi */}
            <FormField
              control={form.control}
              name="themePreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema Tercihi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Başlık Dili */}
            <FormField
              control={form.control}
              name="titleLanguagePreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlık Dili</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Başlık dili seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TitleLanguage.ROMAJI}>Romaji</SelectItem>
                      <SelectItem value={TitleLanguage.ENGLISH}>İngilizce</SelectItem>
                      <SelectItem value={TitleLanguage.JAPANESE}>Japonca</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Yetişkin İçeriği */}
            <FormField
              control={form.control}
              name="displayAdultContent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateMutation.isPending}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    Yetişkin içeriği göster
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Puanlama Formatı */}
            <FormField
              control={form.control}
              name="scoreFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puanlama Formatı</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Puanlama formatı seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ScoreFormat.POINT_100}>100 Puanlık</SelectItem>
                      <SelectItem value={ScoreFormat.POINT_10}>10 Puanlık</SelectItem>
                      <SelectItem value={ScoreFormat.POINT_5}>5 Puanlık</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Otomatik Takip */}
            <FormField
              control={form.control}
              name="autoTrackOnAniwaListAdd"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateMutation.isPending}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    Listeye eklerken otomatik takip et
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Kaydet Butonu */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 