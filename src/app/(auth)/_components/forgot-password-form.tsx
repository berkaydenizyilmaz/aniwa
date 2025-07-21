'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth.schema';
import { forgotPassword } from '../_actions/auth.actions';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);

    try {
      const result = await forgotPassword(data);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
        form.reset();
      }
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-geist-sans">
                E-posta
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
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
          {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
        </Button>
      </form>
    </Form>
  );
} 