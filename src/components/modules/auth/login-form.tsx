'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes.constants';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmit = async (data: LoginInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        toast.error('Kullanıcı adı veya şifre yanlış');
        return;
      }

      // Başarılı giriş
      toast.success('Başarıyla giriş yaptınız!');
      
      router.push(ROUTES.PAGES.HOME);
      router.refresh();

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

       {/* Giriş Butonu */}
        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          Giriş Yap
        </Button>

    </form>
  );
} 