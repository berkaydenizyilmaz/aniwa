import { LoginForm } from '../_components/login-form';
import { AuthCard } from '../_components/auth-card';
import { ROUTES } from '@/lib/constants/routes.constants';

export default function LoginPage() {
  const links = [
    {
      text: "Hesabınız yok mu?",
      href: ROUTES.PAGES.AUTH.REGISTER,
      label: "Kayıt olun"
    },
    {
      text: "",
      href: ROUTES.PAGES.AUTH.FORGOT_PASSWORD,
      label: "Şifremi unuttum"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 md:p-6 lg:p-8">
      <AuthCard 
        title="Giriş Yap"
        description="Hesabınıza giriş yapın"
        links={links}
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
} 