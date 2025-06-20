import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex justify-between items-center p-4 border-b border-border">
        <h1 className="text-2xl font-bold">Aniwa</h1>
        <ThemeToggle />
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Anime Takip Platformu</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Anime serileri ve sezonları tek başlık altında takip edin. 
              Karmaşık sezon listelerinden kurtulun, sadece sevdiğiniz animelere odaklanın.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-2">Tek Başlık</h3>
              <p className="text-muted-foreground">
                Tüm sezonlar ve filmler ana seri altında düzenli
              </p>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-2">Ayrı Puanlama</h3>
              <p className="text-muted-foreground">
                Seriye ve her sezona ayrı puan verebilme
              </p>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-2">Topluluk</h3>
              <p className="text-muted-foreground">
                Diğer anime severlerle etkileşim ve tartışma
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
