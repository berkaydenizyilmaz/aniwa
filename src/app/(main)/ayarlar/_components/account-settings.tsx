'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { UserWithSettings } from '@/types'

interface AccountSettingsProps {
  user: UserWithSettings
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  // Şifre değiştirme state'leri
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Email değiştirme state'leri
  const [newEmail, setNewEmail] = useState('')
  
  // Username değiştirme state'leri
  const [newUsername, setNewUsername] = useState('')

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      
      const result = await response.json()
      if (result.success) {
        alert('Şifre başarıyla değiştirildi!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (error) {
      alert('Bağlantı hatası!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail }),
      })
      
      const result = await response.json()
      if (result.success) {
        alert('Email değiştirme isteği gönderildi!')
        setNewEmail('')
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (error) {
      alert('Bağlantı hatası!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUsernameChange = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername }),
      })
      
      const result = await response.json()
      if (result.success) {
        alert('Username başarıyla değiştirildi!')
        window.location.reload()
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (error) {
      alert('Bağlantı hatası!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hesap Bilgileri</CardTitle>
        <CardDescription>
          Giriş bilgilerinizi ve hesap güvenliğinizi yönetin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Şifre Değiştirme */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Şifre Değiştir</h3>
          <div className="space-y-2">
            <Label>Mevcut Şifre</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mevcut şifrenizi girin"
            />
          </div>
          <div className="space-y-2">
            <Label>Yeni Şifre</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifrenizi girin"
            />
          </div>
          <div className="space-y-2">
            <Label>Yeni Şifre (Tekrar)</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifrenizi tekrar girin"
            />
          </div>
          <Button 
            onClick={handlePasswordChange} 
            disabled={isLoading || !currentPassword || !newPassword}
          >
            Şifreyi Değiştir
          </Button>
        </div>

        {/* Email Değiştirme */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">E-posta Değiştir</h3>
          <p className="text-sm text-muted-foreground">
            Mevcut: {user.email}
          </p>
          <div className="space-y-2">
            <Label>Yeni E-posta</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Yeni e-posta adresinizi girin"
            />
          </div>
          <Button 
            onClick={handleEmailChange} 
            disabled={isLoading || !newEmail}
          >
            E-posta Değiştir
          </Button>
        </div>

        {/* Username Değiştirme */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Kullanıcı Adı Değiştir</h3>
          <p className="text-sm text-muted-foreground">
            Mevcut: @{user.username}
          </p>
          <div className="space-y-2">
            <Label>Yeni Kullanıcı Adı</Label>
            <Input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Yeni kullanıcı adınızı girin"
            />
          </div>
          <Button 
            onClick={handleUsernameChange} 
            disabled={isLoading || !newUsername}
          >
            Kullanıcı Adını Değiştir
          </Button>
          <p className="text-xs text-muted-foreground">
            * Kullanıcı adınızı ayda sadece 1 kez değiştirebilirsiniz
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 