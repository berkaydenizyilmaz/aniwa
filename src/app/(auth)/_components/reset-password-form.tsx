'use client';

import { useState, useCallback, memo } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/schemas/auth.schema';
import { resetPassword } from '../_actions/auth.actions';
import { ROUTES } from '@/lib/constants/routes.constants';

interface ResetPasswordFormProps {
  token?: string;
}

export const ResetPasswordForm = memo(function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
      confirmPassword: '',
    }
  });

  // Form submit handler - useCallback ile optimize edildi
  const onSubmit = useCallback(async (data: ResetPasswordInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      const result = await resetPassword(data);

      if (!result.success) {
        toastError('Hata', result.error);
      } else {
        toastSuccess('Başarılı', 'Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');
        router.push(ROUTES.PAGES.AUTH.LOGIN);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, router]);

  // Form field render fonksiyonları - useCallback ile optimize edildi
  const renderPasswordField = useCallback(({ field }: { field: ControllerRenderProps<ResetPasswordInput, 'password'> }) => (
    <FormItem className="space-y-1.5">
      <FormControl>
        <Input
          type="password"
          placeholder="Yeni Şifre"
          disabled={isLoading}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  ), [isLoading]);

  const renderConfirmPasswordField = useCallback(({ field }: { field: ControllerRenderProps<ResetPasswordInput, 'confirmPassword'> }) => (
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
  ), [isLoading]);

  // Error state handler - useCallback ile optimize edildi
  const handleRequestNewLink = useCallback(() => {
    router.push(ROUTES.PAGES.AUTH.FORGOT_PASSWORD);
  }, [router]);

  // Token yoksa uyarı göster
  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Geçersiz veya eksik şifre sıfırlama bağlantısı.
        </p>
        <Button 
          variant="outline" 
          onClick={handleRequestNewLink}
          className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/20 text-primary font-semibold shadow-md hover:shadow-lg transition-all duration-300"
        >
          Yeni Şifre Sıfırlama Bağlantısı İste
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="password"
          render={renderPasswordField}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={renderConfirmPasswordField}
        />

        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          loading={isLoading}
        >
          Şifreyi Güncelle
        </Button>
      </form>
    </Form>
  );
}); 