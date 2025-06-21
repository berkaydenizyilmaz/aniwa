'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function SetupUsernamePage() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const { user, isLoading: authLoading, setupUsername } = useAuth()

  // Username kullanılabilirlik kontrolü (debounced)
  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true)
      try {
        const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`)
        const data = await response.json()
        setIsAvailable(data.available)
      } catch (err) {
        console.error('Username check error:', err)
        setIsAvailable(null)
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [username])

  // Username'i kaydet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalı')
      return
    }

    if (isAvailable === false) {
      setError('Bu kullanıcı adı kullanılıyor')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await setupUsername(username)
      // setupUsername hook'u zaten ana sayfaya yönlendirir
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      console.error('Setup username error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Username input değişikliği
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
    setUsername(value)
    setError('')
  }

  // Loading durumu
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Kullanıcı Adı Seç
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabını tamamlamak için bir kullanıcı adı seç
          </p>
          {user?.email && (
            <p className="mt-2 text-center text-sm text-gray-500">
              Email: {user.email}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Kullanıcı Adı
            </label>
            <div className="mt-1 relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={handleUsernameChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="kullaniciadi"
                minLength={3}
                maxLength={20}
              />
              {isChecking && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Kullanılabilirlik durumu */}
            {username.length >= 3 && !isChecking && (
              <div className="mt-2 text-sm">
                {isAvailable === true && (
                  <span className="text-green-600">✓ Bu kullanıcı adı kullanılabilir</span>
                )}
                {isAvailable === false && (
                  <span className="text-red-600">✗ Bu kullanıcı adı zaten alınmış</span>
                )}
              </div>
            )}
            
            <p className="mt-1 text-xs text-gray-500">
              Sadece harf, rakam ve alt çizgi (_) kullanabilirsin. 3-20 karakter.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !username || username.length < 3 || isAvailable === false || isChecking}
            className="w-full"
          >
            {isLoading ? 'Kaydediliyor...' : 'Devam Et'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Bu adımı atlayamazsın. Kullanıcı adın profilinde görünecek.
          </p>
        </div>
      </div>
    </div>
  )
} 