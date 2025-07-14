'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { UserWithSettings } from '@/types'

interface NotificationSettingsProps {
  user: UserWithSettings
}

export default function NotificationSettings({ user }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [receiveNotificationOnNewFollow, setReceiveNotificationOnNewFollow] = useState(
    user.userSettings?.receiveNotificationOnNewFollow ?? true
  )
  const [receiveNotificationOnEpisodeAiring, setReceiveNotificationOnEpisodeAiring] = useState(
    user.userSettings?.receiveNotificationOnEpisodeAiring ?? true
  )
  const [receiveNotificationOnNewMediaPart, setReceiveNotificationOnNewMediaPart] = useState(
    user.userSettings?.receiveNotificationOnNewMediaPart ?? true
  )

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiveNotificationOnNewFollow,
          receiveNotificationOnEpisodeAiring,
          receiveNotificationOnNewMediaPart,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Bildirim ayarları başarıyla güncellendi!')
        window.location.reload()
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (error) {
      alert('Bağlantı hatası!')
      console.error('Notification settings update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bildirim Ayarları</CardTitle>
        <CardDescription>
          Hangi bildirimleri almak istediğinizi seçin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Yeni Takipçi Bildirimleri */}
        <div className="flex items-center justify-between">
          <Label>Yeni Takipçi Bildirimleri</Label>
          <input
            type="checkbox"
            checked={receiveNotificationOnNewFollow}
            onChange={(e) => setReceiveNotificationOnNewFollow(e.target.checked)}
          />
        </div>

        {/* Bölüm Yayını Bildirimleri */}
        <div className="flex items-center justify-between">
          <Label>Bölüm Yayını Bildirimleri</Label>
          <input
            type="checkbox"
            checked={receiveNotificationOnEpisodeAiring}
            onChange={(e) => setReceiveNotificationOnEpisodeAiring(e.target.checked)}
          />
        </div>

        {/* Yeni Medya Parçası Bildirimleri */}
        <div className="flex items-center justify-between">
          <Label>Yeni Medya Parçası Bildirimleri</Label>
          <input
            type="checkbox"
            checked={receiveNotificationOnNewMediaPart}
            onChange={(e) => setReceiveNotificationOnNewMediaPart(e.target.checked)}
          />
        </div>

        {/* Kaydet Butonu */}
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
        </Button>
      </CardContent>
    </Card>
  )
} 