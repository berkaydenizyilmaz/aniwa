'use client';

import { useState, useCallback, memo } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
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

export const RegisterForm = memo(function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Form submit handler - useCallback ile optimize edildi
  const onSubmit = useCallback(async (data: RegisterInput) => {
    if (isLoading) return; // Prevent double submission
    
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
    } catch (error) {
      console.error('Register error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [router, form.setError, isLoading]);

  // Form field components
  const EmailField = ({ field }: { field: ControllerRenderProps<RegisterInput, 'email'> }) => (
    <FormItem className="space-y-1.5">
      <FormControl>
        <Input
          type="email"
          placeholder="E-posta"
          disabled={isLoading}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const UsernameField = ({ field }: { field: ControllerRenderProps<RegisterInput, 'username'> }) => (
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

  const PasswordField = ({ field }: { field: ControllerRenderProps<RegisterInput, 'password'> }) => (
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

  const ConfirmPasswordField = ({ field }: { field: ControllerRenderProps<RegisterInput, 'confirmPassword'> }) => (
    <FormItem className="space-y-1.5">
      <FormControl>
        <Input
          type="password"
          placeholder="Şifre Tekrar"
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
          name="email"
          render={EmailField}
        />

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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={ConfirmPasswordField}
        />

        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          loading={isLoading}
        >
          Kayıt Ol
        </Button>
      </form>
    </Form>
  );
}); 