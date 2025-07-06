// Aniwa Projesi - Forgot Password Page
// Bu sayfa şifre sıfırlama talebi formunu içerir

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { forgotPasswordSchema, type ForgotPasswordData } from '@/lib/schemas/auth.schemas'
import { API_ROUTES, AUTH_ROUTES } from '@/constants/routes'
import { PASSWORD_RESET_TOKEN_EXPIRY_HOURS } from '@/constants/auth'
import type { ForgotPasswordResponse } from '@/types/auth'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(API_ROUTES.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: ForgotPasswordResponse = await response.json()

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || 'Bir hata oluştu')
      }
    } catch (error) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Email Gönderildi!
            </CardTitle>
            <CardDescription className="text-base">
              Eğer <strong>{getValues('email')}</strong> adresi sistemde kayıtlıysa, 
              şifre sıfırlama bağlantısı gönderildi.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Email gelmezse spam/junk klasörünüzü kontrol edin. 
                Bağlantı sadece {PASSWORD_RESET_TOKEN_EXPIRY_HOURS} saat boyunca geçerlidir.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={AUTH_ROUTES.SIGN_IN}>
                  Giriş Sayfasına Dön
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setIsSuccess(false)}
              >
                Başka Email Dene
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Mail className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Şifremi Unuttum
          </CardTitle>
          <CardDescription className="text-base">
            Email adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                'Sıfırlama Bağlantısı Gönder'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button variant="ghost" asChild>
              <Link href={AUTH_ROUTES.SIGN_IN} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Giriş Sayfasına Dön
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 