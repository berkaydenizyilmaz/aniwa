'use client';

import { useState, useCallback, memo } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';
import { ROUTES } from '@/lib/constants/routes.constants';

export const LoginForm = memo(function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Form submit handler - useCallback ile optimize edildi
  const onSubmit = useCallback(async (data: LoginInput) => {
    if (isLoading) return; // Prevent double submission
    
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
    } catch (error) {
      console.error('Login error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoading]);

  // Form field components
  const UsernameField = ({ field }: { field: ControllerRenderProps<LoginInput, 'username'> }) => (
    <FormItem className="space-y-1.5">
      <FormControl>
        <Input
          placeholder="Kullanıcı Adı"
          disabled={isLoading}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const PasswordField = ({ field }: { field: ControllerRenderProps<LoginInput, 'password'> }) => (
    <FormItem className="space-y-1.5">
      <FormControl>
        <Input
          type="password"
          placeholder="Şifre"
          disabled={isLoading}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="username"
          render={UsernameField}
        />

        <FormField
          control={form.control}
          name="password"
          render={PasswordField}
        />

        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          loading={isLoading}
        >
          Giriş Yap
        </Button>
      </form>
    </Form>
  );
}); 