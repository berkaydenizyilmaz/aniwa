'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/constants/routes'
import { loginSchema, type LoginData } from '@/lib/schemas/auth.schemas'
import Link from 'next/link'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { loginWithGoogle } = useAuth()

  // React Hook Form + Zod resolver
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  })

  // Form submit handler
  const handleCredentialsLogin = async (data: LoginData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Diğer tüm durumlar için generic message (güvenlik için)
        setError('Geçersiz kullanıcı adı veya şifre. Lütfen tekrar deneyin.')
      } else {
          router.push(ROUTES.PAGES.HOME)
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Google ile giriş
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await loginWithGoogle()
    } catch (err) {
      setError('Google ile giriş yapılırken bir hata oluştu')
      console.error('Google login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Giriş Yap
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabın yok mu?{' '}
            <Link href={ROUTES.PAGES.AUTH.SIGN_UP} className="text-blue-600 hover:text-blue-500">
              Kayıt ol
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(handleCredentialsLogin)}>
          <div>
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              type="text"
              placeholder="kullaniciadi"
              {...form.register('username')}
            />
            {form.formState.errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Şifre</Label>
              <Link href={ROUTES.PAGES.AUTH.FORGOT_PASSWORD} className="text-sm text-blue-600 hover:text-blue-500">
                Şifremi unuttum
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
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
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Google ile Giriş Yap
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Link href={ROUTES.PAGES.HOME} className="text-sm text-gray-600 hover:text-gray-500">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
} 