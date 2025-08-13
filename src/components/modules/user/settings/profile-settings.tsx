// Profile Settings Component

'use client';

import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsMutations } from '@/lib/hooks/use-settings-mutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { GetUserProfileResponse } from '@/lib/types/api/settings.api';
import { updateUsernameSchema, updateBioSchema, updatePasswordSchema, type UpdateUsernameInput, type UpdateBioInput, type UpdatePasswordInput } from '@/lib/schemas/settings.schema';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ProfileSettings() {
  const { profile, isLoading } = useSettings();
  const { 
    updateUsernameMutation,
    updateBioMutation,
    updatePasswordMutation
  } = useSettingsMutations();

  // Username form
  const usernameForm = useForm<UpdateUsernameInput>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: '',
    },
  });

  // Bio form
  const bioForm = useForm<UpdateBioInput>({
    resolver: zodResolver(updateBioSchema),
    defaultValues: {
      bio: '',
    },
  });

  // Password form
  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Form'ları güncelle
  useEffect(() => {
    if (profile) {
      usernameForm.reset({ username: (profile as GetUserProfileResponse).username });
      bioForm.reset({ bio: (profile as GetUserProfileResponse).bio || '' });
    }
  }, [profile, usernameForm, bioForm]);

  // Username submit
  const onUsernameSubmit = async (data: UpdateUsernameInput) => {
    if (data.username !== (profile as GetUserProfileResponse)?.username) {
      updateUsernameMutation.mutate(data);
    }
  };

  // Bio submit
  const onBioSubmit = async (data: UpdateBioInput) => {
    if (data.bio !== (profile as GetUserProfileResponse)?.bio) {
      updateBioMutation.mutate(data);
    }
  };

  // Password submit
  const onPasswordSubmit = async (data: UpdatePasswordInput) => {
    updatePasswordMutation.mutate(data);
    passwordForm.reset();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil Ayarları</CardTitle>
          <CardDescription>Kullanıcı adı, biyografi ve parola değişiklikleri</CardDescription>
        </CardHeader>
        <CardContent>
          <Loading variant="card" lines={6} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Ayarları</CardTitle>
        <CardDescription>Kullanıcı adı, biyografi ve parola değişiklikleri</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* E-posta (Salt Okunur) */}
        <div className="space-y-2">
          <Label>E-posta</Label>
          <Input
            value={(profile as GetUserProfileResponse)?.email || ''}
            disabled
            className="bg-muted"
          />
          <p className="text-sm text-muted-foreground">
            E-posta adresi güvenlik nedeniyle değiştirilemez
          </p>
        </div>

        {/* Kullanıcı Adı */}
        <Form {...usernameForm}>
          <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-2">
            <FormField
              control={usernameForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kullanıcı adınızı girin"
                      disabled={updateUsernameMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateUsernameMutation.isPending || usernameForm.watch('username') === (profile as GetUserProfileResponse)?.username}
              size="sm"
            >
              Güncelle
            </Button>
          </form>
        </Form>

        {/* Biyografi */}
        <Form {...bioForm}>
          <form onSubmit={bioForm.handleSubmit(onBioSubmit)} className="space-y-2">
            <FormField
              control={bioForm.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biyografi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Kendiniz hakkında kısa bir açıklama yazın"
                      rows={3}
                      maxLength={500}
                      disabled={updateBioMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {field.value?.length || 0}/500
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateBioMutation.isPending || bioForm.watch('bio') === (profile as GetUserProfileResponse)?.bio || !bioForm.watch('bio')?.trim()}
              size="sm"
            >
              Güncelle
            </Button>
          </form>
        </Form>

        {/* Parola Değiştirme */}
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-2">
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeni Parola</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Yeni parolanızı girin"
                      disabled={updatePasswordMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parola Tekrarı</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Yeni parolanızı tekrar girin"
                      disabled={updatePasswordMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              size="sm"
            >
              Parolayı Güncelle
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 
