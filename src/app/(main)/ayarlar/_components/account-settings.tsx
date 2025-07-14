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

// İlk şifre belirleme bileşeni (Google OAuth kullanıcıları için)
function SetInitialPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Şifreler eşleşmiyor!')
      return
    }
    
    if (newPassword.length < 8) {
      alert('Şifre en az 8 karakter olmalı!')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/set-initial-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })
      
      const result = await response.json()
      if (result.success) {
        alert('Şifre başarıyla belirlendi!')
        window.location.reload()
      } else {
        alert('Hata: ' + result.error)
      }
    } catch {
      alert('Bağlantı hatası!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900">İlk Şifre Belirleme</h4>
        <p className="text-sm text-blue-700 mt-1">
          Google ile giriş yaptığınız için henüz şifreniz yok. İsteğe bağlı olarak şifre belirleyebilirsiniz.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Yeni Şifre</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="En az 8 karakter"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Yeni Şifre (Tekrar)</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Şifrenizi tekrar girin"
        />
      </div>
      
      <Button 
        onClick={handleSetPassword} 
        disabled={isLoading || !newPassword || !confirmPassword}
        className="w-full"
      >
        {isLoading ? 'Belirleniyor...' : 'Şifre Belirle'}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        Şifre belirledikten sonra hem Google hem de email/şifre ile giriş yapabilirsiniz.
      </p>
    </div>
  )
}

// Normal şifre değiştirme bileşeni
function ChangePassword({ userEmail }: { userEmail: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotLoading, setIsForgotLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
    } catch {
      alert('Bağlantı hatası!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setIsForgotLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      })
      
      const result = await response.json()
      if (result.success) {
        alert('Şifre sıfırlama bağlantısı email adresinize gönderildi!')
      } else {
        alert('Hata: ' + result.error)
      }
    } catch {
      alert('Bağlantı hatası!')
    } finally {
      setIsForgotLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Mevcut Şifre</Label>
        <div className="flex gap-2">
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Mevcut şifrenizi girin"
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={handleForgotPassword}
            disabled={isForgotLoading}
            className="whitespace-nowrap"
          >
            {isForgotLoading ? 'Gönderiliyor...' : 'Şifremi Unuttum'}
          </Button>
        </div>
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
  )
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  // Email değiştirme state'leri
  const [newEmail, setNewEmail] = useState('')
  
  // Username değiştirme state'leri
  const [newUsername, setNewUsername] = useState('')

  // Google OAuth kullanıcısı mı kontrol et (passwordHash null ise)
  const isGoogleUser = !user.passwordHash

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
    } catch {
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
    } catch {
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
        {/* Şifre Yönetimi */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {isGoogleUser ? 'Şifre Belirle' : 'Şifre Değiştir'}
          </h3>
          
                     {isGoogleUser ? (
             <SetInitialPassword />
           ) : (
             <ChangePassword userEmail={user.email} />
           )}
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