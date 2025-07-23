'use client';

import { useState, useCallback, memo } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth.schema';
import { forgotPassword } from '../_actions/auth.actions';

export const ForgotPasswordForm = memo(function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Form submit handler - useCallback ile optimize edildi
  const onSubmit = useCallback(async (data: ForgotPasswordInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      const result = await forgotPassword(data);

      if (!result.success) {
        toastError('Hata', result.error);
      } else {
        toastSuccess('Başarılı', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
        form.reset();
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, form]);

  // Form field component
  const EmailField = ({ field }: { field: ControllerRenderProps<ForgotPasswordInput, 'email'> }) => (
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={EmailField}
        />

        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          loading={isLoading}
        >
          Gönder
        </Button>
      </form>
    </Form>
  );
}); 