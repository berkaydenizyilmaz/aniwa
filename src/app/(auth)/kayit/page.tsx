import Link from 'next/link';
import { AuthCard } from "@/components/modules/auth/auth-card";
import { RegisterForm } from "@/components/modules/auth/register-form";
import { ROUTES_DOMAIN } from '@/lib/constants';

export default function RegisterPage() {
  const registerLinks = (
    <div className="text-sm text-muted-foreground">
      Zaten hesabınız var mı?{' '}
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
      title="Kayıt Ol"
      description="Yeni hesap oluşturun"
      links={registerLinks}
    >
      <RegisterForm />
    </AuthCard>
  );
} 