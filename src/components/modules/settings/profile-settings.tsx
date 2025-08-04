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
import { updateProfileAction } from '@/lib/actions/settings.actions';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { CLOUDINARY } from '@/lib/constants/cloudinary.constants';

export function ProfileSettings() {
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: '',
      bio: '',
      profilePicture: null,
      profileBanner: null,
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfileAction(data),
    onSuccess: () => {
      toast.success('Profil bilgileri başarıyla güncellendi!');
    },
    onError: (error) => {
      console.error('Update profile error:', error);
      toast.error('Güncelleme başarısız oldu');
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    updateMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Bilgileri</CardTitle>
        <CardDescription>
          Profil bilgilerinizi güncelleyin
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
                    <Input placeholder="Kullanıcı adınızı girin" {...field} />
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
                      placeholder="Kendinizden bahsedin..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profil Resmi */}
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil Resmi</FormLabel>
                  <FormControl>
                    <ImageUpload
                      id="profile-picture"
                      label="Profil Resmi"
                      accept="image/*"
                      maxSize={CLOUDINARY.CONFIGS.USER_AVATAR.maxSize}
                      value={field.value}
                      onChange={field.onChange}
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
                      id="profile-banner"
                      label="Profil Banner"
                      accept="image/*"
                      maxSize={CLOUDINARY.CONFIGS.USER_BANNER.maxSize}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kaydet Butonu */}
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 