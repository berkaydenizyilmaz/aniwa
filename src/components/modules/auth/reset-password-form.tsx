'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/schemas/auth.schema';
import { resetPassword } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes.constants';

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      password: '',
      confirmPassword: '',
    },
  });

  // URL'den token'ı al
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error('Geçersiz Link', {
        description: 'Şifre sıfırlama linki geçersiz.'
      });
      router.push(ROUTES.PAGES.AUTH.FORGOT_PASSWORD);
    }
  }, [searchParams, router]);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      // Token'ı form data'ya ekle
      const formData = {
        ...data,
        token: token
      };

      // Server Action ile şifre sıfırlama
      const result = await resetPassword(formData);

      if (!result.success) {
        toast.error('Şifre Sıfırlama Başarısız', {
          description: result.error || 'Şifre sıfırlama işlemi başarısız oldu'
        });
        return;
      }

      // Başarılı şifre sıfırlama
      toast.success('Şifre Sıfırlandı', {
        description: 'Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.'
      });
      
      router.push(ROUTES.PAGES.AUTH.LOGIN);

    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Hata', {
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Token yoksa form'u gösterme
  if (!token) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Şifre */}
      <div className="space-y-2">
        <Label htmlFor="password">Yeni Şifre</Label>
        <Input
          id="password"
          type="password"
          placeholder="Yeni şifrenizi girin"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Şifre Tekrarı */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Şifrenizi tekrar girin"
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Şifre Sıfırla Butonu */}
      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Şifreyi Sıfırla
      </Button>

    </form>
  );
} 