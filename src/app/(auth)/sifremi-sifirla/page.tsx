import Link from 'next/link';
import { Suspense } from 'react';
import { AuthCard } from "@/components/modules/auth/auth-card";
import { ResetPasswordForm } from "@/components/modules/auth/reset-password-form";
import { ROUTES_DOMAIN } from '@/lib/constants';

export default function ResetPasswordPage() {
  const resetPasswordLinks = (
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
      title="Şifre Sıfırla"
      description="Yeni şifrenizi belirleyin"
      links={resetPasswordLinks}
    >
      <Suspense fallback={<div>Yükleniyor...</div>}>
      <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
} 