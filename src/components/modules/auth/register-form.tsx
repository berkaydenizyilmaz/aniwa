'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth.schema';
import { registerUser } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes.constants';
import { useMutation } from '@tanstack/react-query';

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>({
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
      toast.error(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    registerMutation.mutate(data);
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
          disabled={registerMutation.isPending}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          type="email"
          placeholder="E-posta adresinizi girin"
          {...register('email')}
          disabled={registerMutation.isPending}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
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
          disabled={registerMutation.isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Şifre Tekrarı */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Şifrenizi tekrar girin"
          {...register('confirmPassword')}
          disabled={registerMutation.isPending}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

        {/* Kayıt Butonu */}
        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          Kayıt Ol
        </Button>

    </form>
  );
}