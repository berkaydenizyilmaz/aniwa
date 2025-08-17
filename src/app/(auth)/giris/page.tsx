import Link from 'next/link';
import { AuthCard } from "@/components/modules/auth/auth-card";
import { LoginForm } from "@/components/modules/auth/login-form";
import { ROUTES_DOMAIN } from '@/lib/constants';

export default function LoginPage() {
  const loginLinks = (
    <>
      <Link
        href={ROUTES_DOMAIN.PAGES.AUTH.FORGOT_PASSWORD}
        className="text-sm text-primary hover:underline transition-colors"
      >
        Şifremi unuttum
      </Link>
      
      <div className="text-sm text-muted-foreground">
        Hesabınız yok mu?{' '}
        <Link
          href={ROUTES_DOMAIN.PAGES.AUTH.REGISTER}
          className="text-primary hover:underline"
        >
          Kayıt ol
        </Link>
      </div>
    </>
  );

  return (
    <AuthCard
      title="Giriş Yap"
      description="Hesabınıza giriş yapın"
      links={loginLinks}
    >
      <LoginForm />
    </AuthCard>
  );
} 