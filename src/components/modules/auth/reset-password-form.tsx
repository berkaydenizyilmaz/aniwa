'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/schemas/auth.schema';
import { resetPassword } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes.constants';
import { useMutation } from '@tanstack/react-query';

export function ResetPasswordForm() {
  const [token, setToken] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordInput>({
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
      toast.error('Şifre sıfırlama linki geçersiz.');
      router.push(ROUTES.PAGES.AUTH.FORGOT_PASSWORD);
    }
  }, [searchParams, router]);

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      // Token'ı form data'ya ekle
      const formData = {
        ...data,
        token: token
      };

      const result = await resetPassword(formData);

      if (!result.success) {
        throw new Error(result.error || 'Şifre sıfırlama işlemi başarısız oldu');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');
      router.push(ROUTES.PAGES.AUTH.LOGIN);
    },
    onError: (error) => {
      console.error('Reset password error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    resetPasswordMutation.mutate(data);
  };

  // Token yoksa form'u gösterme
  if (!token) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Şifre */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yeni Şifre</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Yeni şifrenizi girin"
                  disabled={resetPasswordMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Şifre Tekrarı */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre Tekrarı</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  disabled={resetPasswordMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Şifre Sıfırla Butonu */}
        <Button
          type="submit"
          className="w-full"
          disabled={resetPasswordMutation.isPending}
        >
          Şifreyi Sıfırla
        </Button>
      </form>
    </Form>
  );
}