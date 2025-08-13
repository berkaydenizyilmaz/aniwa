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
import { Card } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
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
import { useUserProfileStore } from '@/lib/stores/userProfile.store';

export function ProfileSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profileBanner, setProfileBanner] = useState<File | null>(null);
  const { profile: userProfile, setProfile } = useUserProfileStore();
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
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'profile'] });
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
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'profile'] });
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
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'profile'] });
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
        <div className="space-y-6">
          {/* Profil Fotoğrafı */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <Label className="text-sm font-medium mb-3 block">Profil Fotoğrafı</Label>
              {/* TODO: Image upload component will be added */}
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">Avatar</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mt-8">
                <p>Profil fotoğrafınız diğer kullanıcılar tarafından görülebilir.</p>
                <p className="text-xs mt-1">JPG, PNG veya WebP formatında, maksimum 2MB</p>
              </div>
            </div>
          </div>
          
          {/* Profil Banner */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Profil Banner</Label>
            {/* TODO: Image upload component will be added */}
            <div className="w-64 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Banner</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Banner görseliniz profilinizin üst kısmında görüntülenecektir. Maksimum 5MB
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 