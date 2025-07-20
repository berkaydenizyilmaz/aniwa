import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './login-form';
import { ROUTES } from '@/lib/constants/routes.constants';

export function LoginCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Giriş Yap</CardTitle>
        <CardDescription>
          Hesabınıza giriş yapın
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <LoginForm />
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Hesabınız yok mu?{' '}
            <Link href={ROUTES.PAGES.AUTH.REGISTER} className="text-primary hover:underline">
              Kayıt olun
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href={ROUTES.PAGES.AUTH.FORGOT_PASSWORD} className="text-primary hover:underline">
              Şifremi unuttum
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 