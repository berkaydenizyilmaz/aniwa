import { ForgotPasswordForm } from '../_components/forgot-password-form';
import { AuthCard } from '../_components/auth-card';
import { ROUTES } from '@/lib/constants/routes.constants';

export default function ForgotPasswordPage() {
  const links = [
    {
      text: "Hesabınızı hatırladınız mı?",
      href: ROUTES.PAGES.AUTH.LOGIN,
      label: "Giriş yapın"
    }
  ];

  return (
    <AuthCard 
      title="Şifremi Unuttum"
      description="E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim"
      links={links}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
} 