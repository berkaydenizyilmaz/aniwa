'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';
import { ROUTES } from '@/lib/constants/routes.constants';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toastError('Giriş Başarısız', 'Kullanıcı adı veya şifre yanlış');
      } else {
        toastSuccess('Giriş Başarılı', 'Başarıyla giriş yaptınız!');
        router.push(ROUTES.PAGES.HOME);
        router.refresh();
      }
    } catch {
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-2 md:space-y-3">
              <FormLabel>Kullanıcı Adı</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    placeholder="Kullanıcı adınızı girin"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs md:text-sm font-medium font-geist-sans" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2 md:space-y-3">
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder="Şifrenizi girin"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs md:text-sm font-medium font-geist-sans" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Giriş yapılıyor...</span>
            </div>
          ) : (
            'Giriş Yap'
          )}
        </Button>
      </form>
    </Form>
  );
} 