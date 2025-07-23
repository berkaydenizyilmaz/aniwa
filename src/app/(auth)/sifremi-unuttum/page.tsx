import Link from 'next/link';
import { AuthCard } from "@/components/modules/auth/auth-card";
import { ForgotPasswordForm } from "@/components/modules/auth/forgot-password-form";
import { ROUTES } from '@/lib/constants/routes.constants';

export default function ForgotPasswordPage() {
  const forgotPasswordLinks = (
    <div className="text-sm text-muted-foreground">
      Şifrenizi hatırladınız mı?{' '}
      <Link
        href={ROUTES.PAGES.AUTH.LOGIN}
        className="text-primary hover:underline"
      >
        Giriş yap
      </Link>
    </div>
  );

  return (
    <AuthCard
      title="Şifremi Unuttum"
      description="E-posta adresinizi girin, şifre sıfırlama linki gönderelim"
      links={forgotPasswordLinks}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
} 