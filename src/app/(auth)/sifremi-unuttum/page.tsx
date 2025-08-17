import Link from 'next/link';
import { AuthCard } from "@/components/modules/auth/auth-card";
import { ForgotPasswordForm } from "@/components/modules/auth/forgot-password-form";
import { ROUTES_DOMAIN } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const forgotPasswordLinks = (
    <div className="text-sm text-muted-foreground">
      Şifrenizi hatırladınız mı?{' '}
      <Link
        href={ROUTES_DOMAIN.PAGES.AUTH.LOGIN}
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