'use client';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 px-2 md:px-0">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Hesap ve uygulama tercihleri</p>
      </div>
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ayarlar sistemi yeniden yapılandırılıyor...</p>
      </div>
    </div>
  );
}