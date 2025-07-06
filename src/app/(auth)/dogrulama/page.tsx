// Aniwa Projesi - Email Verification Page
// Bu sayfa email doğrulama token'ını işler

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

type VerificationState = 'loading' | 'success' | 'error' | 'invalid'

export default function EmailVerificationPage() {
  const [state, setState] = useState<VerificationState>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setState('invalid')
      setMessage('Geçersiz doğrulama bağlantısı')
      return
    }

    // Token'ı doğrula
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${ROUTES.API.AUTH.VERIFY_EMAIL}?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setState('success')
          setMessage(data.message)
          setEmail(data.data?.email || '')
          
          // 3 saniye sonra login sayfasına yönlendir
          setTimeout(() => {
            router.push(`${ROUTES.PAGES.AUTH.SIGN_IN}?verified=true`)
          }, 3000)
        } else {
          setState('error')
          setMessage(data.error || 'Doğrulama başarısız')
        }
      } catch (error) {
        setState('error')
        setMessage('Doğrulama sırasında bir hata oluştu')
        console.error('Email verification error:', error)
      }
    }

    verifyEmail()
  }, [token, router])

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'error':
      case 'invalid':
        return <XCircle className="h-16 w-16 text-red-500" />
      default:
        return <Mail className="h-16 w-16 text-gray-500" />
    }
  }

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Email Doğrulanıyor...'
      case 'success':
        return 'Email Başarıyla Doğrulandı!'
      case 'error':
        return 'Doğrulama Başarısız'
      case 'invalid':
        return 'Geçersiz Bağlantı'
      default:
        return 'Email Doğrulama'
    }
  }

  const getDescription = () => {
    switch (state) {
      case 'loading':
        return 'Lütfen bekleyin, email adresiniz doğrulanıyor...'
      case 'success':
        return `${email} adresiniz başarıyla doğrulandı. Artık Aniwa'ya giriş yapabilirsiniz.`
      case 'error':
        return message || 'Email doğrulama işlemi başarısız oldu.'
      case 'invalid':
        return 'Doğrulama bağlantısı geçersiz veya süresi dolmuş.'
      default:
        return 'Email doğrulama işlemi'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
          <CardDescription className="text-base">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {state === 'success' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                3 saniye içinde giriş sayfasına yönlendirileceksiniz...
              </p>
              <Button asChild className="w-full">
                <Link href={ROUTES.PAGES.AUTH.SIGN_IN}>
                  Hemen Giriş Yap
                </Link>
              </Button>
            </div>
          )}
          
          {(state === 'error' || state === 'invalid') && (
            <div className="space-y-4">
              <Button asChild className="w-full" variant="outline">
                <Link href={ROUTES.PAGES.AUTH.SIGN_UP}>
                  Yeni Hesap Oluştur
                </Link>
              </Button>
              <Button asChild className="w-full" variant="ghost">
                <Link href={ROUTES.PAGES.AUTH.SIGN_IN}>
                  Giriş Sayfasına Dön
                </Link>
              </Button>
            </div>
          )}
          
          {state === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Bu işlem birkaç saniye sürebilir...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 