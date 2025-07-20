'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Kullanıcı adı veya şifre hatalı');
      } else {
        router.push('/'); // Ana sayfaya yönlendir
        router.refresh();
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Kullanıcı Adı
        </label>
        <Input
          id="username"
          type="text"
          {...register('username')}
          placeholder="Kullanıcı adınızı girin"
          disabled={isLoading}
        />
        {errors.username && (
          <p className="text-sm text-destructive mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Şifre
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="Şifrenizi girin"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="text-sm text-destructive text-center">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </Button>
    </form>
  );
} 