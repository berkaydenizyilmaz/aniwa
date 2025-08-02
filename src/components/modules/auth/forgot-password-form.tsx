'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth.schema';
import { forgotPassword } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

export function ForgotPasswordForm() {
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

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const result = await forgotPassword(data);

      if (!result.success) {
        throw new Error(result.error || 'Şifre sıfırlama isteği başarısız oldu');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Şifre sıfırlama linki e-posta adresinize gönderildi.');
    },
    onError: (error) => {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    forgotPasswordMutation.mutate(data);
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
          disabled={forgotPasswordMutation.isPending}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Gönder Butonu */}
      <Button
        type="submit"
        className="w-full"
        disabled={forgotPasswordMutation.isPending}
      >
        Gönder
      </Button>

    </form>
  );
}