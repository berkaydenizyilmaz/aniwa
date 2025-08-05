'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  updateNotificationSettingsAction,
  getUserSettingsAction
} from '@/lib/actions/user/settings.actions';
import { 
  updateNotificationSettingsSchema,
  type UpdateNotificationSettingsInput
} from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';

export function NotificationSettings() {
  // Kullanıcı ayarlarını getir
  const { data: userData, refetch } = useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettingsAction,
  });

  const user = userData?.success ? (userData.data as GetUserSettingsResponse)?.user : null;
  const settings = userData?.success ? (userData.data as GetUserSettingsResponse)?.settings : null;

  // Notification settings form
  const notificationForm = useForm<UpdateNotificationSettingsInput>({
    resolver: zodResolver(updateNotificationSettingsSchema),
    defaultValues: {
      receiveNotificationOnNewFollow: true,
      receiveNotificationOnEpisodeAiring: true,
      receiveNotificationOnNewMediaPart: true,
    },
  });

  // Form'ları settings data yüklendikten sonra güncelle
  useEffect(() => {
    if (settings) {
      notificationForm.reset({
        receiveNotificationOnNewFollow: settings.receiveNotificationOnNewFollow ?? true,
        receiveNotificationOnEpisodeAiring: settings.receiveNotificationOnEpisodeAiring ?? true,
        receiveNotificationOnNewMediaPart: settings.receiveNotificationOnNewMediaPart ?? true,
      });
    }
  }, [settings, notificationForm]);

  // Update mutation
  const updateNotificationMutation = useMutation({
    mutationFn: updateNotificationSettingsAction,
    onSuccess: () => {
      toast.success('Bildirim ayarları güncellendi');
      refetch();
    },
    onError: (error) => {
      console.error('Notification settings update error:', error);
      toast.error('Bildirim ayarları güncellenemedi');
    },
  });

  // Form submit handler
  const onNotificationSubmit = async (data: UpdateNotificationSettingsInput) => {
    updateNotificationMutation.mutate(data);
  };

  if (!settings) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* New Follow Notifications */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Yeni Takipçi Bildirimleri</h3>
          <p className="text-sm text-muted-foreground">
            Yeni takipçileriniz olduğunda bildirim alın
          </p>
        </div>
        <Form {...notificationForm}>
          <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
            <FormField
              control={notificationForm.control}
              name="receiveNotificationOnNewFollow"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Yeni Takipçi Bildirimleri
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Yeni takipçileriniz olduğunda bildirim al
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateNotificationMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={notificationForm.control}
              name="receiveNotificationOnEpisodeAiring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Yeni Bölüm Bildirimleri
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Takip ettiğiniz animelerin yeni bölümleri yayınlandığında bildirim al
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateNotificationMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={notificationForm.control}
              name="receiveNotificationOnNewMediaPart"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Yeni Medya Parçası Bildirimleri
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Takip ettiğiniz animelerin yeni medya parçaları eklendiğinde bildirim al
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateNotificationMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={updateNotificationMutation.isPending}
            >
              Bildirim Ayarlarını Güncelle
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 