import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from './register-form';
import { ROUTES } from '@/lib/constants/routes.constants';

export function RegisterCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Kayıt Ol</CardTitle>
        <CardDescription>
          Hesabınızı oluşturun
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RegisterForm />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Zaten hesabınız var mı?{' '}
            <Link href={ROUTES.PAGES.AUTH.LOGIN} className="text-primary hover:underline">
              Giriş yapın
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 