'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
          toast.error(result.error);
        }
      } else {
        toast.success('Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.');
        // Başarılı kayıt sonrası giriş sayfasına yönlendir
        router.push(ROUTES.PAGES.AUTH.LOGIN);
      }
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
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
              <FormLabel className="text-gray-500 text-sm font-semibold tracking-wide font-geist-sans">E-posta</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="E-posta adresinizi girin"
                    disabled={isLoading}
                    className="bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-[#5bc0ff] focus:ring-[#5bc0ff]/10 transition-all duration-200 h-11 text-base"
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
              <FormLabel className="text-gray-500 text-sm font-semibold tracking-wide font-geist-sans">Kullanıcı Adı</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    placeholder="Kullanıcı adınızı girin"
                    disabled={isLoading}
                    className="bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-[#5bc0ff] focus:ring-[#5bc0ff]/10 transition-all duration-200 h-11 text-base"
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
              <FormLabel className="text-gray-500 text-sm font-semibold tracking-wide font-geist-sans">Şifre</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder="Şifrenizi girin"
                    disabled={isLoading}
                    className="bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-[#5bc0ff] focus:ring-[#5bc0ff]/10 transition-all duration-200 h-11 text-base"
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
          className="w-full bg-[#5bc0ff] hover:bg-[#5bc0ff]/90 text-white font-bold py-3 md:py-4 text-base md:text-lg shadow-sm hover:shadow-md transition-all duration-300 font-geist-sans cursor-pointer"
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