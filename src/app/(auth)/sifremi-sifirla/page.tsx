import Link from 'next/link';
import { AuthCard } from "@/components/modules/auth/auth-card";
import { ResetPasswordForm } from "@/components/modules/auth/reset-password-form";
import { ROUTES } from '@/lib/constants/routes.constants';

export default function ResetPasswordPage() {
  const resetPasswordLinks = (
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
      title="Şifre Sıfırla"
      description="Yeni şifrenizi belirleyin"
      links={resetPasswordLinks}
    >
      <ResetPasswordForm />
    </AuthCard>
  );
} 