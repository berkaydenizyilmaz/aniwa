'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
        toast.error(result.error);
      } else {
        toast.success('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');
        router.push(ROUTES.PAGES.AUTH.LOGIN);
      }
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
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
              <FormLabel className="text-sm font-medium text-gray-700 font-geist-sans">
                Yeni Şifre
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Yeni şifrenizi girin"
                  disabled={isLoading}
                  className="h-11 bg-white/60 border-gray-300/50 focus:border-purple-500/70 focus:ring-purple-500/20 transition-all duration-200 font-geist-sans"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-geist-sans" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-geist-sans">
                Şifre Tekrar
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  disabled={isLoading}
                  className="h-11 bg-white/60 border-gray-300/50 focus:border-purple-500/70 focus:ring-purple-500/20 transition-all duration-200 font-geist-sans"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-geist-sans" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-geist-sans"
          disabled={isLoading}
        >
          {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </Button>
      </form>
    </Form>
  );
} 