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
import { useState } from 'react';

export function ProfileSettings() {
  const { profile, isLoading } = useSettings();
  const { 
    updateUsernameMutation,
    updateBioMutation,
    updatePasswordMutation
  } = useSettingsMutations();

  // Form states
  const [username, setUsername] = useState((profile as GetUserProfileResponse)?.username || '');
  const [bio, setBio] = useState((profile as GetUserProfileResponse)?.bio || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Update form when profile changes
  if (profile && (username !== (profile as GetUserProfileResponse).username || bio !== (profile as GetUserProfileResponse).bio)) {
    setUsername((profile as GetUserProfileResponse).username);
    setBio((profile as GetUserProfileResponse).bio || '');
  }

  // Handle username update
  const handleUsernameUpdate = () => {
    if (username.trim() && username !== (profile as GetUserProfileResponse)?.username) {
      updateUsernameMutation.mutate({ username: username.trim() });
    }
  };

  // Handle bio update
  const handleBioUpdate = () => {
    if (bio !== (profile as GetUserProfileResponse)?.bio) {
      updateBioMutation.mutate({ bio: bio.trim() || null });
    }
  };

  // Handle password update
  const handlePasswordUpdate = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      updatePasswordMutation.mutate({ 
        newPassword, 
        confirmPassword 
      });
      setNewPassword('');
      setConfirmPassword('');
    }
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
        {/* Kullanıcı Adı */}
        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adınızı girin"
            disabled={updateUsernameMutation.isPending}
          />
          <Button
            onClick={handleUsernameUpdate}
            disabled={updateUsernameMutation.isPending || !username.trim() || username === (profile as GetUserProfileResponse)?.username}
            size="sm"
          >
            {updateUsernameMutation.isPending ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </div>

        {/* Biyografi */}
        <div className="space-y-2">
          <Label htmlFor="bio">Biyografi</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kendiniz hakkında kısa bir açıklama yazın"
            rows={3}
            maxLength={500}
            disabled={updateBioMutation.isPending}
          />
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBioUpdate}
              disabled={updateBioMutation.isPending || bio === (profile as GetUserProfileResponse)?.bio}
              size="sm"
            >
              {updateBioMutation.isPending ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
            <span className="text-sm text-muted-foreground">
              {bio.length}/500
            </span>
          </div>
        </div>

        {/* Parola Değiştirme */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">Yeni Parola</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Yeni parolanızı girin"
            disabled={updatePasswordMutation.isPending}
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni parolanızı tekrar girin"
            disabled={updatePasswordMutation.isPending}
          />
          <Button
            onClick={handlePasswordUpdate}
            disabled={
              updatePasswordMutation.isPending || 
              !newPassword || 
              !confirmPassword || 
              newPassword !== confirmPassword ||
              newPassword.length < 6
            }
            size="sm"
          >
            {updatePasswordMutation.isPending ? 'Güncelleniyor...' : 'Parolayı Güncelle'}
          </Button>
          {newPassword && newPassword.length < 6 && (
            <p className="text-sm text-destructive">
              Parola en az 6 karakter olmalıdır
            </p>
          )}
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-destructive">
              Parolalar eşleşmiyor
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
