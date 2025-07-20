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
    <AuthCard 
      title="Giriş Yap"
      description="Hesabınıza giriş yapın"
      links={links}
    >
      <LoginForm />
    </AuthCard>
  );
} 