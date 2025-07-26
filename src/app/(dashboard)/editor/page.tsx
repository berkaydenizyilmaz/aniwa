
export default function EditorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editör Dashboard</h1>
        <p className="text-muted-foreground">
          Aniwa editör paneli
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold">Toplam Anime</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="font-semibold">Toplam Streaming Link</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="font-semibold">Bekleyen İşlemler</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  );
} 