'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUpload } from '@/components/ui/image-upload';
import Image from 'next/image';
import { 
  updateUsernameAction,
  updateBioAction,
  updatePasswordAction,
  updateProfileImagesAction,
} from '@/lib/actions/user/settings.actions';
import { 
  updateUsernameSchema,
  updateBioSchema,
  updatePasswordSchema,
  type UpdateUsernameInput,
  type UpdateBioInput,
  type UpdatePasswordInput,
} from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { IMAGE_TYPES } from '@/lib/constants/image.constants';

export function ProfileSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profileBanner, setProfileBanner] = useState<File | null>(null);

  // Settings hook'u kullan
  const { data: userData } = useSettings();
  const { settings, updateSetting, userProfile } = useSettingsStore();
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();

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

  // Form'ları user data yüklendikten sonra güncelle
  useEffect(() => {
    if (session?.user) {
      usernameForm.reset({ username: session.user.username });
      bioForm.reset({ bio: userProfile?.bio ?? '' });
    }
  }, [session?.user, userProfile, usernameForm, bioForm]);

  // Mutations
  const updateUsernameMutation = useMutation({
    mutationFn: updateUsernameAction,
      onSuccess: () => {
      toast.success('Kullanıcı adı başarıyla güncellendi');
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Username update error:', error);
      toast.error(error.message || 'Kullanıcı adı güncellenemedi');
    },
  });

  const updateBioMutation = useMutation({
    mutationFn: updateBioAction,
      onSuccess: () => {
      toast.success('Biyografi başarıyla güncellendi');
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Bio update error:', error);
      toast.error(error.message || 'Biyografi güncellenemedi');
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePasswordAction,
    onSuccess: () => {
      toast.success('Parola başarıyla güncellendi');
      passwordForm.reset();
    },
    onError: (error) => {
      console.error('Password update error:', error);
      toast.error(error.message || 'Parola güncellenemedi');
    },
  });

  const updateProfileImagesMutation = useMutation({
    mutationFn: (payload: { profilePicture: File | null; profileBanner: File | null }) => {
      const fd = new FormData();
      if (payload.profilePicture) fd.append('profilePicture', payload.profilePicture);
      if (payload.profileBanner) fd.append('profileBanner', payload.profileBanner);
      return updateProfileImagesAction(fd);
    },
      onSuccess: () => {
      toast.success('Profil görselleri başarıyla güncellendi');
      setProfilePicture(null);
      setProfileBanner(null);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Profile images update error:', error);
      toast.error(error.message || 'Profil görselleri güncellenemedi');
    },
  });

  // Form submit handlers
  const onUsernameSubmit = async (data: UpdateUsernameInput) => {
    updateUsernameMutation.mutate(data, {
      onSuccess: () => {
        // Session'ı da güncelle (NextAuth v4 update callback)
        updateSession({ user: { username: data.username } });
      }
    });
  };

  const onBioSubmit = async (data: UpdateBioInput) => {
    updateBioMutation.mutate(data, {
      onSuccess: () => {
        // Session update'ı dışında settings cache'ini de tazele
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
        updateSession({ user: { bio: data.bio } });
      }
    });
  };

  const onPasswordSubmit = async (data: UpdatePasswordInput) => {
    updatePasswordMutation.mutate(data);
  };

  // File handlers
  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    
    // Otomatik kaydet
    if (file) {
      updateProfileImagesMutation.mutate({
        profilePicture: file,
        profileBanner: profileBanner,
      });
    }
  };

  const handleProfileBannerChange = (file: File | null) => {
    setProfileBanner(file);
    
    // Otomatik kaydet
    if (file) {
      updateProfileImagesMutation.mutate({
        profilePicture: profilePicture,
        profileBanner: file,
      });
    }
  };

  if (!session?.user) return <Loading variant="card" lines={5} />;

  return (
    <div className="space-y-6">
      {/* Satır 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Kullanıcı Adı</h4>
          <Form {...usernameForm}>
            <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-3">
              <FormField
                control={usernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Kullanıcı Adı</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Kullanıcı adınız" disabled={updateUsernameMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={updateUsernameMutation.isPending || usernameForm.watch('username') === session.user.username}>Kaydet</Button>
              </div>
            </form>
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">E-posta</h4>
          <div className="space-y-2">
            <Label className="text-xs">E-posta</Label>
            <Input type="email" value={session.user.email} disabled className="bg-muted" />
          </div>
        </Card>
      </div>

      {/* Satır 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 md:col-span-2">
          <h4 className="text-sm font-medium mb-3">Biyografi</h4>
          <Form {...bioForm}>
            <form onSubmit={bioForm.handleSubmit(onBioSubmit)} className="space-y-3">
              <FormField
                control={bioForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Biyografi</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Kısa bir açıklama" disabled={updateBioMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={updateBioMutation.isPending || bioForm.watch('bio') === (userProfile?.bio ?? '')}>Kaydet</Button>
              </div>
            </form>
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Parola</h4>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Yeni Parola</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="Yeni parola" disabled={updatePasswordMutation.isPending} {...field} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
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
                    <FormLabel className="text-xs">Yeni Parola Tekrar</FormLabel>
                    <FormControl>
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Tekrar" disabled={updatePasswordMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    updatePasswordMutation.isPending ||
                    !passwordForm.watch('newPassword') ||
                    !passwordForm.watch('confirmPassword')
                  }
                >
                  Güncelle
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>

      {/* Satır 3 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Profil Görselleri</h4>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="text-xs">Profil Fotoğrafı</Label>
            <div className="mt-2 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile?.profilePicture || ''} />
                <AvatarFallback>{session.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <ImageUpload imageType={IMAGE_TYPES.USER_AVATAR} value={profilePicture} onChange={handleProfilePictureChange} disabled={updateProfileImagesMutation.isPending} loading={updateProfileImagesMutation.isPending} variant="avatar" />
              </div>
            </div>
          </div>
          <div>
            <Label className="text-xs">Profil Banner</Label>
            <div className="mt-2 flex items-center gap-4">
              {userProfile?.profileBanner && (
                <div className="h-16 w-32 rounded border overflow-hidden">
                  <Image src={userProfile.profileBanner} alt="Profile Banner" width={128} height={64} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <ImageUpload imageType={IMAGE_TYPES.USER_BANNER} value={profileBanner} onChange={handleProfileBannerChange} disabled={updateProfileImagesMutation.isPending} loading={updateProfileImagesMutation.isPending} variant="default" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 