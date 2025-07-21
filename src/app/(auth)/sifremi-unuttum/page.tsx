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
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 md:p-6 lg:p-8">
      <AuthCard 
        title="Şifremi Unuttum"
        description="E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim"
        links={links}
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
} 