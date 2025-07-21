import { RegisterForm } from '../_components/register-form';
import { AuthCard } from '../_components/auth-card';
import { ROUTES } from '@/lib/constants/routes.constants';
import Image from 'next/image';

export default function RegisterPage() {
  const links = [
    {
      text: "Zaten hesabınız var mı?",
      href: ROUTES.PAGES.AUTH.LOGIN,
      label: "Giriş yapın"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 md:p-6 lg:p-8">
      <AuthCard 
        title="Kayıt Ol"
        description="Hesabınızı oluşturun"
        links={links}
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
} 