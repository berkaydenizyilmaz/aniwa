'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Sayfa yüklendiğinde test toast'u
    toast('Sayfa yüklendi!', {
      description: 'Toast sistemi çalışıyor!'
    });
  }, []);

  const handleSuccessToast = () => {
    console.log('Success toast clicked');
    toast.success('Başarılı!', {
      description: 'İşlem başarıyla tamamlandı.'
    });
  };

  const handleErrorToast = () => {
    console.log('Error toast clicked');
    toast.error('Hata!', {
      description: 'Bir hata oluştu. Lütfen tekrar deneyin.'
    });
  };

  const handleWarningToast = () => {
    console.log('Warning toast clicked');
    toast.warning('Uyarı!', {
      description: 'Bu işlem geri alınamaz.'
    });
  };

  const handleInfoToast = () => {
    console.log('Info toast clicked');
    toast.info('Bilgi', {
      description: 'Bu bir bilgi mesajıdır.'
    });
  };

  const handleCustomToast = () => {
    console.log('Custom toast clicked');
    toast('Özel Mesaj', {
      description: 'Bu özel bir toast mesajıdır.',
    });
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <div className="text-4xl font-bold mb-8">
            Aniwa
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold mb-4">Toast Test Butonları</h2>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={handleSuccessToast} variant="default">
                Success Toast
              </Button>
              
              <Button onClick={handleErrorToast} variant="destructive">
                Error Toast
              </Button>
              
              <Button onClick={handleWarningToast} variant="outline">
                Warning Toast
              </Button>
              
              <Button onClick={handleInfoToast} variant="secondary">
                Info Toast
              </Button>
              
              <Button onClick={handleCustomToast} variant="ghost">
                Custom Toast
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}