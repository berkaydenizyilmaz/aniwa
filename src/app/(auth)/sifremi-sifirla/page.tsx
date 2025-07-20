import { ResetPasswordForm } from '../_components/reset-password-form';
import { AuthCard } from '../_components/auth-card';
import { ROUTES } from '@/lib/constants/routes.constants';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  const links = [
    {
      text: "Hesabınızı hatırladınız mı?",
      href: ROUTES.PAGES.AUTH.LOGIN,
      label: "Giriş yapın"
    }
  ];

  return (
    <AuthCard 
      title="Şifre Sıfırlama"
      description="Yeni şifrenizi belirleyin"
      links={links}
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
} 