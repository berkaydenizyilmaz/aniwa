import { RegisterForm } from '../_components/register-form';
import { AuthCard } from '../_components/auth-card';
import { ROUTES } from '@/lib/constants/routes.constants';

export default function RegisterPage() {
  const links = [
    {
      text: "Zaten hesabınız var mı?",
      href: ROUTES.PAGES.AUTH.LOGIN,
      label: "Giriş yapın"
    }
  ];

  return (
    <AuthCard 
      title="Kayıt Ol"
      description="Hesabınızı oluşturun"
      links={links}
    >
      <RegisterForm />
    </AuthCard>
  );
} 