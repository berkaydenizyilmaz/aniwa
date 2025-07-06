'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { PUBLIC_ROUTES, AUTH_ROUTES, API_ROUTES } from '@/constants/routes'
import Link from 'next/link'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { loginWithGoogle } = useAuth()

  // Form değişikliklerini handle et
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Username için özel sanitization
    if (name === 'username') {
      const sanitizedValue = value.replace(/[^a-zA-Z0-9_]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Email/Password ile kayıt
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Basit validasyon
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Kayıt işlemi başarısız')
      }

      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...')
      setTimeout(() => {
        router.push(AUTH_ROUTES.SIGN_IN)
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt işlemi sırasında bir hata oluştu')
      console.error('Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Google ile kayıt
  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await loginWithGoogle()
    } catch (err) {
      setError('Google ile kayıt yapılırken bir hata oluştu')
      console.error('Google signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Kayıt Ol
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <Link href={AUTH_ROUTES.SIGN_IN} className="text-blue-600 hover:text-blue-500">
              Giriş yap
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="kullaniciadi"
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="Sadece harf, rakam ve alt çizgi kullanabilirsiniz"
            />
            <p className="mt-1 text-xs text-gray-500">
              Sadece harf, rakam ve alt çizgi (_) kullanabilirsiniz. 3-20 karakter.
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Veya</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Google ile Kayıt Ol
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Link href={PUBLIC_ROUTES.HOME} className="text-sm text-gray-600 hover:text-gray-500">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
} 