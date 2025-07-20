import Link from 'next/link';
import { LoginForm } from './login-form';

export function LoginCard() {
  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Giriş Yap</h1>
        <p className="text-muted-foreground mt-2">
          Hesabınıza giriş yapın
        </p>
      </div>

      {/* Form */}
      <LoginForm />

      {/* Links */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-primary hover:underline">
            Kayıt olun
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          <Link href="/sifremi-unuttum" className="text-primary hover:underline">
            Şifremi unuttum
          </Link>
        </p>
      </div>
    </div>
  );
} 