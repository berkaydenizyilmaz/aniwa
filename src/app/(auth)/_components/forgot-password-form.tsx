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
              <FormLabel className="text-gray-500 text-sm font-semibold tracking-wide font-geist-sans">
                E-posta
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  disabled={isLoading}
                  className="bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-[#5bc0ff] focus:ring-[#5bc0ff]/10 transition-all duration-200 h-11 text-base"
                  {...field}
                />
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
              <span>Gönderiliyor...</span>
            </div>
          ) : (
            'Şifre Sıfırlama Bağlantısı Gönder'
          )}
        </Button>
      </form>
    </Form>
  );
} 