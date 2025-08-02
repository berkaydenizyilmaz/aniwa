'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '@/lib/constants/routes.constants';

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        throw new Error('Kullanıcı adı veya şifre yanlış');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Başarıyla giriş yaptınız!');
      router.push(ROUTES.PAGES.HOME);
      router.refresh();
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    },
  });

  const onSubmit = async (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Kullanıcı Adı */}
      <div className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <Input
          id="username"
          type="text"
          placeholder="Kullanıcı adınızı girin"
          {...register('username')}
          disabled={loginMutation.isPending}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      {/* Şifre */}
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          type="password"
          placeholder="Şifrenizi girin"
          {...register('password')}
          disabled={loginMutation.isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

       {/* Giriş Butonu */}
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          Giriş Yap
        </Button>

    </form>
  );
}