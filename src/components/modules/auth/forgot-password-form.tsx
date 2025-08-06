'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth.schema';
import { forgotPassword } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const result = await forgotPassword(data);

      if (!result.success) {
        throw new Error(result.error || 'Şifre sıfırlama isteği başarısız oldu');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Şifre sıfırlama linki e-posta adresinize gönderildi.');
    },
    onError: (error) => {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="E-posta adresinizi girin"
                  disabled={forgotPasswordMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gönder Butonu */}
        <Button
          type="submit"
          className="w-full"
          disabled={forgotPasswordMutation.isPending}
        >
          Gönder
        </Button>
      </form>
    </Form>
  );
}