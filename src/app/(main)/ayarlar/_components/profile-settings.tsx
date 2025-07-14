'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { UserWithSettings } from '@/types'

interface ProfileSettingsProps {
  user: UserWithSettings
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [bio, setBio] = useState(user.bio || '')
  const [profilePicture, setProfilePicture] = useState('')
  const [profileBanner, setProfileBanner] = useState('')

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio,
          profilePicture: profilePicture || undefined,
          profileBanner: profileBanner || undefined,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Profil başarıyla güncellendi!')
        window.location.reload()
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (error) {
      alert('Bağlantı hatası!')
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Bilgileri</CardTitle>
        <CardDescription>
          Profilinizde görünecek bilgileri düzenleyin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio */}
        <div className="space-y-2">
          <Label>Hakkımda (Bio)</Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kendinizi tanıtın..."
            className="w-full p-2 border rounded h-24 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {bio.length}/500 karakter
          </p>
        </div>

        {/* Profil Fotoğrafı */}
        <div className="space-y-2">
          <Label>Profil Fotoğrafı URL</Label>
          <Input
            type="url"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs text-muted-foreground">
            Mevcut: {user.profilePicture || 'Yok'}
          </p>
        </div>

        {/* Profil Banner */}
        <div className="space-y-2">
          <Label>Profil Banner URL</Label>
          <Input
            type="url"
            value={profileBanner}
            onChange={(e) => setProfileBanner(e.target.value)}
            placeholder="https://example.com/banner.jpg"
          />
          <p className="text-xs text-muted-foreground">
            Mevcut: {user.profileBanner || 'Yok'}
          </p>
        </div>

        {/* Kaydet Butonu */}
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Kaydediliyor...' : 'Profili Güncelle'}
        </Button>
      </CardContent>
    </Card>
  )
} 