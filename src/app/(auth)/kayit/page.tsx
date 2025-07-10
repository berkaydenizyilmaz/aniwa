'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/constants/routes'
import { signupSchema, type SignupData } from '@/lib/schemas/auth.schemas'
import Link from 'next/link'
import { useState } from 'react'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { loginWithGoogle } = useAuth()

  // React Hook Form + Zod resolver
  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  // Form submit handler
  const handleSignup = async (data: SignupData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(ROUTES.API.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Kayıt işlemi başarısız')
      }

      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...')
      setTimeout(() => {
        router.push(ROUTES.PAGES.AUTH.SIGN_IN)
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
            <Link href={ROUTES.PAGES.AUTH.SIGN_IN} className="text-blue-600 hover:text-blue-500">
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

        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(handleSignup)}>
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
            <p className="mt-1 text-xs text-gray-500">
              Sadece küçük harf ve rakam kullanabilirsiniz. 3-20 karakter.
            </p>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Şifre</Label>
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
          <Link href={ROUTES.PAGES.HOME} className="text-sm text-gray-600 hover:text-gray-500">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
} 