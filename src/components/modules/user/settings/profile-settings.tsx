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
  updateProfileImagesSchema,
  type UpdateUsernameInput,
  type UpdateBioInput,
  type UpdatePasswordInput,
  type UpdateProfileImagesInput
} from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { CLOUDINARY } from '@/lib/constants/cloudinary.constants';

export function ProfileSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profileBanner, setProfileBanner] = useState<File | null>(null);

  // Settings hook'u kullan
  const { data: userData, refetch } = useSettings();
  const { user, settings } = useSettingsStore();
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

  // Profile images form
  const profileImagesForm = useForm<UpdateProfileImagesInput>({
    resolver: zodResolver(updateProfileImagesSchema),
    defaultValues: {
      profilePicture: null,
      profileBanner: null,
    },
  });

  // Form'ları user data yüklendikten sonra güncelle
  useEffect(() => {
    if (user) {
      usernameForm.reset({ username: user.username });
      bioForm.reset({ bio: user.bio || '' });
    }
  }, [user, usernameForm, bioForm]);

  // Mutations
  const updateUsernameMutation = useMutation({
    mutationFn: updateUsernameAction,
    onSuccess: () => {
      toast.success('Kullanıcı adı başarıyla güncellendi');
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Username update error:', error);
      toast.error('Kullanıcı adı güncellenemedi');
    },
  });

  const updateBioMutation = useMutation({
    mutationFn: updateBioAction,
    onSuccess: () => {
      toast.success('Biyografi başarıyla güncellendi');
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Bio update error:', error);
      toast.error('Biyografi güncellenemedi');
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
      toast.error('Parola güncellenemedi');
    },
  });

  const updateProfileImagesMutation = useMutation({
    mutationFn: updateProfileImagesAction,
    onSuccess: () => {
      toast.success('Profil görselleri başarıyla güncellendi');
      setProfilePicture(null);
      setProfileBanner(null);
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Profile images update error:', error);
      toast.error('Profil görselleri güncellenemedi');
    },
  });

  // Form submit handlers
  const onUsernameSubmit = async (data: UpdateUsernameInput) => {
    updateUsernameMutation.mutate(data);
  };

  const onBioSubmit = async (data: UpdateBioInput) => {
    updateBioMutation.mutate(data);
  };

  const onPasswordSubmit = async (data: UpdatePasswordInput) => {
    updatePasswordMutation.mutate(data);
  };

  const onProfileImagesSubmit = async (data: UpdateProfileImagesInput) => {
    updateProfileImagesMutation.mutate(data);
  };

  // File handlers
  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    profileImagesForm.setValue('profilePicture', file);
  };

  const handleProfileBannerChange = (file: File | null) => {
    setProfileBanner(file);
    profileImagesForm.setValue('profileBanner', file);
  };

  if (!user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Username Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Kullanıcı Adı</h3>
          <p className="text-sm text-muted-foreground">
            Kullanıcı adınızı değiştirin
          </p>
        </div>
        <Form {...usernameForm}>
          <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
            <FormField
              control={usernameForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
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
              disabled={updateUsernameMutation.isPending}
            >
              Kullanıcı Adını Güncelle
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Email Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">E-posta</h3>
          <p className="text-sm text-muted-foreground">
            E-posta adresiniz (değiştirilemez)
          </p>
        </div>
        <div className="space-y-2">
          <Label>E-posta</Label>
          <Input
            type="email"
            value={user.email}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <Separator />

      {/* Bio Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Biyografi</h3>
          <p className="text-sm text-muted-foreground">
            Kendiniz hakkında kısa bir açıklama ekleyin
          </p>
        </div>
        <Form {...bioForm}>
          <form onSubmit={bioForm.handleSubmit(onBioSubmit)} className="space-y-4">
            <FormField
              control={bioForm.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biyografi</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Biyografinizi girin"
                      disabled={updateBioMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateBioMutation.isPending}
            >
              Biyografiyi Güncelle
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Password Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Parola</h3>
          <p className="text-sm text-muted-foreground">
            Parolanızı güvenli bir şekilde değiştirin
          </p>
        </div>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeni Parola</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Yeni parolanızı girin"
                        disabled={updatePasswordMutation.isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
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
                  <FormLabel>Yeni Parola Tekrar</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
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
            >
              Parolayı Güncelle
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Profile Images Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Profil Görselleri</h3>
          <p className="text-sm text-muted-foreground">
            Profil fotoğrafınızı ve banner'ınızı güncelleyin
          </p>
        </div>
        <Form {...profileImagesForm}>
          <form onSubmit={profileImagesForm.handleSubmit(onProfileImagesSubmit)} className="space-y-4">
            {/* Profile Picture */}
            <div className="space-y-4">
              <Label>Profil Fotoğrafı</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profilePicture || ''} />
                  <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <ImageUpload
                    id="profile-picture"
                    label=""
                    accept="image/*"
                    maxSize={CLOUDINARY.CONFIGS.USER_AVATAR.maxSize}
                    value={profilePicture}
                    onChange={handleProfilePictureChange}
                    disabled={updateProfileImagesMutation.isPending}
                    loading={updateProfileImagesMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {/* Profile Banner */}
            <div className="space-y-4">
              <Label>Profil Banner</Label>
              <div className="flex items-center gap-4">
                {user.profileBanner && (
                  <div className="h-16 w-32 rounded border overflow-hidden">
                    <Image
                      src={user.profileBanner}
                      alt="Profile Banner"
                      width={128}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <ImageUpload
                    id="profile-banner"
                    label=""
                    accept="image/*"
                    maxSize={CLOUDINARY.CONFIGS.USER_BANNER.maxSize}
                    value={profileBanner}
                    onChange={handleProfileBannerChange}
                    disabled={updateProfileImagesMutation.isPending}
                    loading={updateProfileImagesMutation.isPending}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateProfileImagesMutation.isPending}
            >
              Görselleri Güncelle
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 