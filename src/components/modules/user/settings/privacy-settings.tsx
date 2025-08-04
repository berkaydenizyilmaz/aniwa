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
import { updatePrivacySettingsAction, getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { updatePrivacySettingsSchema, type UpdatePrivacySettingsInput } from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';
import { ProfileVisibility } from '@prisma/client';

export function PrivacySettings() {
  const queryClient = useQueryClient();

  const form = useForm<UpdatePrivacySettingsInput>({
    resolver: zodResolver(updatePrivacySettingsSchema),
    defaultValues: {
      profileVisibility: undefined,
      allowFollows: false,
      showAnimeList: false,
      showFavouriteAnimeSeries: false,
      showCustomLists: false,
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
          profileVisibility: settings.profileVisibility,
          allowFollows: settings.allowFollows,
          showAnimeList: settings.showAnimeList,
          showFavouriteAnimeSeries: settings.showFavouriteAnimeSeries,
          showCustomLists: settings.showCustomLists,
        });
      }
    }
  }, [userData, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdatePrivacySettingsInput) => updatePrivacySettingsAction(data),
    onSuccess: () => {
      toast.success('Gizlilik ayarları başarıyla güncellendi!');
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Update privacy settings error:', error);
      toast.error('Güncelleme başarısız oldu');
    },
  });

  const onSubmit = async (data: UpdatePrivacySettingsInput) => {
    updateMutation.mutate(data);
  };

  if (isLoadingUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gizlilik Ayarları</CardTitle>
          <CardDescription>
            Profil gizlilik ayarlarınızı yönetin
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
        <CardTitle>Gizlilik Ayarları</CardTitle>
        <CardDescription>
          Profil gizlilik ayarlarınızı yönetin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profil Görünürlüğü */}
            <FormField
              control={form.control}
              name="profileVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil Görünürlüğü</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Profil görünürlüğü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ProfileVisibility.PUBLIC}>Herkese Açık</SelectItem>
                      <SelectItem value={ProfileVisibility.FOLLOWERS_ONLY}>Sadece Takipçiler</SelectItem>
                      <SelectItem value={ProfileVisibility.PRIVATE}>Gizli</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Takip İzinleri */}
            <FormField
              control={form.control}
              name="allowFollows"
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
                    Takip edilmeye izin ver
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Anime Listesi */}
            <FormField
              control={form.control}
              name="showAnimeList"
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
                    Anime listemi göster
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Favori Anime Serileri */}
            <FormField
              control={form.control}
              name="showFavouriteAnimeSeries"
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
                    Favori anime serilerimi göster
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Özel Listeler */}
            <FormField
              control={form.control}
              name="showCustomLists"
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
                    Özel listelerimi göster
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