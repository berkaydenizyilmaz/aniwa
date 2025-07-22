import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants/routes.constants';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-8xl font-bold text-foreground">404</h1>
              <h2 className="text-2xl font-bold text-foreground">Sayfa Bulunamadı</h2>
              <p className="text-muted-foreground">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir.
              </p>
            </div>
            
            <Button asChild className="w-full">
              <Link href={ROUTES.PAGES.HOME}>
                Ana Sayfaya Dön
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 