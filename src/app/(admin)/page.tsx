export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Aniwa yönetim paneli
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* İstatistik kartları buraya gelecek */}
        <div className="glass-card p-6">
          <h3 className="font-semibold">Toplam Anime</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="font-semibold">Toplam Kullanıcı</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="font-semibold">Toplam Tür</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="font-semibold">Toplam Stüdyo</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  );
} 