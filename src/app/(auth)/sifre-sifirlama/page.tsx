// Aniwa Projesi - Reset Password Page
// Bu sayfa şifre sıfırlama token'ını kullanarak yeni şifre belirler

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { resetPasswordSchema, type ResetPasswordData } from '@/lib/schemas/auth.schemas'
import { ROUTES } from '@/constants/routes'

type PageState = 'loading' | 'form' | 'success' | 'error'

export default function ResetPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  // Token'ı doğrula
  useEffect(() => {
    if (!token) {
      setPageState('error')
      setError('Geçersiz sıfırlama bağlantısı')
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(ROUTES.API.AUTH.RESET_PASSWORD + '?token=' + token)
        const data = await response.json()

        if (data.success) {
          setPageState('form')
          setEmail(data.data?.email || '')
        } else {
          setPageState('error')
          setError(data.error || 'Token geçersiz')
        }
      } catch (error) {
        setPageState('error')
        setError('Bağlantı hatası')
        console.error('Token verification error:', error)
      }
    }

    verifyToken()
  }, [token])

  const onSubmit = async (data: ResetPasswordData) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(ROUTES.API.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPageState('success')
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push(ROUTES.PAGES.AUTH.SIGN_IN + '?password-reset=true')
        }, 3000)
      } else {
        setError(result.error || 'Şifre sıfırlama başarısız')
      }
    } catch (error) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
      console.error('Reset password error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Doğrulanıyor...
            </CardTitle>
            <CardDescription>
              Şifre sıfırlama bağlantınız kontrol ediliyor...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Success state
  if (pageState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Şifre Başarıyla Güncellendi!
            </CardTitle>
            <CardDescription>
              Yeni şifrenizle artık Aniwa&apos;ya giriş yapabilirsiniz.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              3 saniye içinde giriş sayfasına yönlendirileceksiniz...
            </p>
            <Button asChild className="w-full">
              <Link href={ROUTES.PAGES.AUTH.SIGN_IN}>
                Hemen Giriş Yap
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (pageState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Bağlantı Geçersiz
            </CardTitle>
            <CardDescription>
              {error || 'Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href={ROUTES.PAGES.AUTH.FORGOT_PASSWORD}>
                Yeni Sıfırlama Bağlantısı İste
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href={ROUTES.PAGES.AUTH.SIGN_IN}>
                Giriş Sayfasına Dön
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Lock className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Yeni Şifre Belirle
          </CardTitle>
          <CardDescription>
            {email && `${email} için yeni şifrenizi belirleyin.`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Yeni Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="En az 8 karakter"
                  {...register('password')}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi tekrar girin"
                  {...register('confirmPassword')}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Şifreniz en az 8 karakter olmalı ve bir küçük harf, bir büyük harf, bir rakam içermelidir.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                'Şifremi Güncelle'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 