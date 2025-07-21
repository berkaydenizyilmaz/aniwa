'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/schemas/auth.schema';
import { resetPassword } from '../_actions/auth.actions';
import { ROUTES } from '@/lib/constants/routes.constants';

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
    }
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);

    try {
      const result = await resetPassword(data);

      if (!result.success) {
        toastError('Hata', result.error);
      } else {
        toastSuccess('Başarılı', 'Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');
        router.push(ROUTES.PAGES.AUTH.LOGIN);
      }
    } catch {
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Token yoksa uyarı göster
  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Geçersiz veya eksik şifre sıfırlama bağlantısı.
        </p>
        <Button 
          variant="outline" 
          onClick={() => router.push(ROUTES.PAGES.AUTH.FORGOT_PASSWORD)}
        >
          Yeni Şifre Sıfırlama Bağlantısı İste
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Yeni Şifre
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Yeni şifrenizi girin"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs md:text-sm font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Şifre Tekrar
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs md:text-sm font-medium" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </Button>
      </form>
    </Form>
  );
} 