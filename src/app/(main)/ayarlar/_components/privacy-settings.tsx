'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { UserWithSettings } from '@/types'

interface PrivacySettingsProps {
  user: UserWithSettings
}

export default function PrivacySettings({ user }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profileVisibility, setProfileVisibility] = useState<string>(user.userSettings?.profileVisibility || 'PUBLIC')
  const [showAnimeList, setShowAnimeList] = useState(user.userSettings?.showAnimeList ?? true)
  const [allowFollows, setAllowFollows] = useState(user.userSettings?.allowFollows ?? true)
  const [displayAdultContent, setDisplayAdultContent] = useState(user.userSettings?.displayAdultContent ?? false)
  const [showFavouriteAnimeSeries, setShowFavouriteAnimeSeries] = useState(user.userSettings?.showFavouriteAnimeSeries ?? true)
  const [showCustomLists, setShowCustomLists] = useState(user.userSettings?.showCustomLists ?? true)

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileVisibility,
          showAnimeList,
          allowFollows,
          displayAdultContent,
          showFavouriteAnimeSeries,
          showCustomLists,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Ayarlar başarıyla güncellendi!')
        window.location.reload()
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (error) {
      alert('Bağlantı hatası!')
      console.error('Settings update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gizlilik Ayarları</CardTitle>
        <CardDescription>
          Profilinizin ve bilgilerinizin görünürlüğünü kontrol edin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profil Görünürlüğü */}
        <div className="space-y-2">
          <Label>Profil Görünürlüğü</Label>
          <select 
            value={profileVisibility} 
            onChange={(e) => setProfileVisibility(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="PUBLIC">Herkes</option>
            <option value="FOLLOWERS_ONLY">Sadece Takipçiler</option>
            <option value="PRIVATE">Kimse (Sadece Ben)</option>
          </select>
        </div>

        {/* Anime Listesi */}
        <div className="flex items-center justify-between">
          <Label>Anime Listesi Gösterimi</Label>
          <input
            type="checkbox"
            checked={showAnimeList}
            onChange={(e) => setShowAnimeList(e.target.checked)}
          />
        </div>

        {/* Takip İzni */}
        <div className="flex items-center justify-between">
          <Label>Takip İzni</Label>
          <input
            type="checkbox"
            checked={allowFollows}
            onChange={(e) => setAllowFollows(e.target.checked)}
          />
        </div>

        {/* Yetişkin İçeriği */}
        <div className="flex items-center justify-between">
          <Label>Yetişkin İçeriği</Label>
          <input
            type="checkbox"
            checked={displayAdultContent}
            onChange={(e) => setDisplayAdultContent(e.target.checked)}
          />
        </div>

        {/* Favori Animeler */}
        <div className="flex items-center justify-between">
          <Label>Favori Anime Listesi</Label>
          <input
            type="checkbox"
            checked={showFavouriteAnimeSeries}
            onChange={(e) => setShowFavouriteAnimeSeries(e.target.checked)}
          />
        </div>

        {/* Özel Listeler */}
        <div className="flex items-center justify-between">
          <Label>Özel Listeler</Label>
          <input
            type="checkbox"
            checked={showCustomLists}
            onChange={(e) => setShowCustomLists(e.target.checked)}
          />
        </div>

        {/* Kaydet Butonu */}
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </CardContent>
    </Card>
  )
} 