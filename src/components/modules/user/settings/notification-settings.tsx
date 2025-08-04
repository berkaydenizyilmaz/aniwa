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
import { updateNotificationSettingsAction, getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { updateNotificationSettingsSchema, type UpdateNotificationSettingsInput } from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';

export function NotificationSettings() {
  const queryClient = useQueryClient();

  const form = useForm<UpdateNotificationSettingsInput>({
    resolver: zodResolver(updateNotificationSettingsSchema),
    defaultValues: {
      receiveNotificationOnNewFollow: false,
      receiveNotificationOnEpisodeAiring: false,
      receiveNotificationOnNewMediaPart: false,
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
          receiveNotificationOnNewFollow: settings.receiveNotificationOnNewFollow,
          receiveNotificationOnEpisodeAiring: settings.receiveNotificationOnEpisodeAiring,
          receiveNotificationOnNewMediaPart: settings.receiveNotificationOnNewMediaPart,
        });
      }
    }
  }, [userData, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateNotificationSettingsInput) => updateNotificationSettingsAction(data),
    onSuccess: () => {
      toast.success('Bildirim ayarları başarıyla güncellendi!');
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Update notification settings error:', error);
      toast.error('Güncelleme başarısız oldu');
    },
  });

  const onSubmit = async (data: UpdateNotificationSettingsInput) => {
    updateMutation.mutate(data);
  };

  if (isLoadingUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bildirim Ayarları</CardTitle>
          <CardDescription>
            Bildirim tercihlerinizi yönetin
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
        <CardTitle>Bildirim Ayarları</CardTitle>
        <CardDescription>
          Bildirim tercihlerinizi yönetin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Yeni Takipçi Bildirimi */}
            <FormField
              control={form.control}
              name="receiveNotificationOnNewFollow"
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
                    Yeni takipçi bildirimleri al
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Bölüm Yayın Bildirimi */}
            <FormField
              control={form.control}
              name="receiveNotificationOnEpisodeAiring"
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
                    Takip ettiğim anime serilerinin yeni bölüm bildirimleri
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Yeni Medya Parçası Bildirimi */}
            <FormField
              control={form.control}
              name="receiveNotificationOnNewMediaPart"
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
                    Takip ettiğim anime serilerinin yeni medya parçası bildirimleri
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