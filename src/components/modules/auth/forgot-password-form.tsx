'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth.schema';
import { forgotPassword } from '@/lib/actions/auth.action';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      // Server Action ile şifre sıfırlama isteği
      const result = await forgotPassword(data);

      if (!result.success) {
        toast.error('İstek Başarısız', {
          description: result.error || 'Şifre sıfırlama isteği başarısız oldu'
        });
        return;
      }

      // Başarılı istek
      toast.success('E-posta Gönderildi', {
        description: 'Şifre sıfırlama linki e-posta adresinize gönderildi.'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Hata', {
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          type="email"
          placeholder="E-posta adresinizi girin"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Gönder Butonu */}
      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Gönder
      </Button>

    </form>
  );
} 