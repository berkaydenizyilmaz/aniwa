"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Numarası */}
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Açıklama */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Sayfa Bulunamadı</h2>
          <p className="text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        {/* Animasyon için basit bir emoji */}
        <div className="text-4xl animate-bounce">
          🔍
        </div>

        {/* Eylem Butonları */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Git
          </Button>
        </div>

        {/* Yardımcı Linkler */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Yardıma mı ihtiyacınız var?
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link 
              href="/contact" 
              className="text-primary hover:underline"
            >
              İletişim
            </Link>
            <Link 
              href="/help" 
              className="text-primary hover:underline"
            >
              Yardım
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 