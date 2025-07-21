'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth.schema';
import { ROUTES } from '@/lib/constants/routes.constants';
import { registerUser } from '../_actions/auth.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      const result = await registerUser(data);

      if (!result.success) {
        // Field errors varsa form'a set et
        if (result.fieldErrors) {
          setFormFieldErrors<RegisterInput>(result.fieldErrors, form.setError);
        } else {
          // Genel hata mesajı
          toastError('Kayıt Hatası', result.error);
        }
      } else {
        toastSuccess('Kayıt Başarılı', 'Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.');
        // Başarılı kayıt sonrası giriş sayfasına yönlendir
        router.push(ROUTES.PAGES.AUTH.LOGIN);
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
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2 md:space-y-3">
              <FormControl>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="E-posta"
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
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-2 md:space-y-3">
              <FormControl>
                <div className="relative group">
                  <Input
                    placeholder="Kullanıcı Adı"
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
              <FormControl>
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder="Şifre"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2 md:space-y-3">
              <FormControl>
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder="Şifre Tekrar"
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
              <span>Kayıt yapılıyor...</span>
            </div>
          ) : (
            'Kayıt Ol'
          )}
        </Button>
      </form>
    </Form>
  );
} 