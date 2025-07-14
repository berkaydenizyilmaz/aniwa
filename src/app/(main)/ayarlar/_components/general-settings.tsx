'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { UserWithSettings } from '@/types'

interface GeneralSettingsProps {
  user: UserWithSettings
}

export default function GeneralSettings({ user }: GeneralSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [themePreference, setThemePreference] = useState<string>(user.userSettings?.themePreference || 'SYSTEM')
  const [titleLanguagePreference, setTitleLanguagePreference] = useState<string>(user.userSettings?.titleLanguagePreference || 'ROMAJI')
  const [scoreFormat, setScoreFormat] = useState<string>(user.userSettings?.scoreFormat || 'POINT_10')
  const [autoTrackOnAniwaListAdd, setAutoTrackOnAniwaListAdd] = useState(user.userSettings?.autoTrackOnAniwaListAdd ?? true)

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themePreference,
          titleLanguagePreference,
          scoreFormat,
          autoTrackOnAniwaListAdd,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Genel ayarlar başarıyla güncellendi!')
        window.location.reload()
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (error) {
      alert('Bağlantı hatası!')
      console.error('General settings update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Tercihler</CardTitle>
        <CardDescription>
          Anime izleme ve site kullanım tercihlerinizi ayarlayın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tema Tercihi */}
        <div className="space-y-2">
          <Label>Tema Tercihi</Label>
          <select 
            value={themePreference} 
            onChange={(e) => setThemePreference(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="LIGHT">Açık Tema</option>
            <option value="DARK">Koyu Tema</option>
            <option value="SYSTEM">Sistem Ayarı</option>
          </select>
        </div>

        {/* Başlık Dili Tercihi */}
        <div className="space-y-2">
          <Label>Anime Başlık Dili</Label>
          <select 
            value={titleLanguagePreference} 
            onChange={(e) => setTitleLanguagePreference(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="ROMAJI">Romaji (Sosuke Aizen)</option>
            <option value="ENGLISH">İngilizce (Bleach)</option>
            <option value="JAPANESE">Japonca (ブリーチ)</option>
          </select>
        </div>

        {/* Puan Formatı */}
        <div className="space-y-2">
          <Label>Puan Formatı</Label>
          <select 
            value={scoreFormat} 
            onChange={(e) => setScoreFormat(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="POINT_100">100 Puan Sistemi (1-100)</option>
            <option value="POINT_10">10 Puan Sistemi (1-10)</option>
            <option value="POINT_5">5 Yıldız Sistemi (1-5)</option>
          </select>
        </div>

        {/* Otomatik Takip */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Otomatik Anime Takibi</Label>
            <p className="text-sm text-muted-foreground">
              Listeye eklenen animeler otomatik takip edilsin mi?
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoTrackOnAniwaListAdd}
            onChange={(e) => setAutoTrackOnAniwaListAdd(e.target.checked)}
          />
        </div>

        {/* Kaydet Butonu */}
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Kaydediliyor...' : 'Genel Ayarları Kaydet'}
        </Button>
      </CardContent>
    </Card>
  )
} 