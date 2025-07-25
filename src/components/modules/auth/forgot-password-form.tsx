'use client';


import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth.schema';
import { forgotPassword } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

export function ForgotPasswordForm() {
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

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
    if (isLoading(LOADING_KEYS.AUTH.FORGOT_PASSWORD)) return; // Prevent double submission
    
    setLoadingStore(LOADING_KEYS.AUTH.FORGOT_PASSWORD, true);

    try {
      // Server Action ile şifre sıfırlama isteği
      const result = await forgotPassword(data);

      if (!result.success) {
        toast.error(result.error || 'Şifre sıfırlama isteği başarısız oldu');
        return;
      }

      // Başarılı istek
      toast.success('Şifre sıfırlama linki e-posta adresinize gönderildi.');

    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.AUTH.FORGOT_PASSWORD, false);
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
          disabled={isLoading(LOADING_KEYS.AUTH.FORGOT_PASSWORD)}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Gönder Butonu */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading(LOADING_KEYS.AUTH.FORGOT_PASSWORD)}
      >
        Gönder
      </Button>

    </form>
  );
} 