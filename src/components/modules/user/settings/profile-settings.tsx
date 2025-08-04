'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { updateProfileAction, getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CLOUDINARY } from '@/lib/constants/cloudinary.constants';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';

export function ProfileSettings() {
  const queryClient = useQueryClient();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: '',
      bio: '',
      profilePicture: null,
      profileBanner: null,
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
      const { user } = userData.data as GetUserSettingsResponse;
      form.reset({
        username: user.username,
        bio: user.bio || '',
        profilePicture: null,
        profileBanner: null,
      });
    }
  }, [userData, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfileAction(data),
    onSuccess: () => {
      toast.success('Profil bilgileri başarıyla güncellendi!');
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Update profile error:', error);
      toast.error('Güncelleme başarısız oldu');
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    updateMutation.mutate(data);
  };

  if (isLoadingUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>
            Kişisel bilgilerinizi güncelleyin
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
        <CardTitle>Profil Bilgileri</CardTitle>
        <CardDescription>
          Kişisel bilgilerinizi güncelleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Kullanıcı Adı */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kullanıcı adınızı girin"
                      disabled={updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Biyografi */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biyografi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Kendiniz hakkında kısa bir açıklama yazın"
                      disabled={updateMutation.isPending}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profil Fotoğrafı */}
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil Fotoğrafı</FormLabel>
                  <FormControl>
                    <ImageUpload
                      id="profilePicture"
                      label="Profil fotoğrafı seçin"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={updateMutation.isPending}
                      accept="image/*"
                      maxSize={CLOUDINARY.CONFIGS.USER_AVATAR.maxSize}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profil Banner */}
            <FormField
              control={form.control}
              name="profileBanner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil Banner</FormLabel>
                  <FormControl>
                    <ImageUpload
                      id="profileBanner"
                      label="Profil banner seçin"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={updateMutation.isPending}
                      accept="image/*"
                      maxSize={CLOUDINARY.CONFIGS.USER_BANNER.maxSize}
                    />
                  </FormControl>
                  <FormMessage />
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