'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth.schema';
import { registerUser } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes.constants';
import { useMutation } from '@tanstack/react-query';

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const result = await registerUser(data);

      if (!result.success) {
        throw new Error(result.error || 'Kayıt işlemi başarısız oldu');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Hesabınız oluşturuldu! Giriş yapabilirsiniz.');
      router.push(ROUTES.PAGES.AUTH.LOGIN);
    },
    onError: (error) => {
      console.error('Register error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Kullanıcı Adı */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kullanıcı Adı</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Kullanıcı adınızı girin"
                  disabled={registerMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  disabled={registerMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Şifre */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Şifrenizi girin"
                  disabled={registerMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Şifre Tekrarı */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre Tekrarı</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  disabled={registerMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kayıt Butonu */}
        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          Kayıt Ol
        </Button>
      </form>
    </Form>
  );
}