import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  Spinner, 
  ButtonSpinner, 
  InlineLoading, 
  AnimeCardSkeleton,
  ListSkeleton, 
  ProfileSkeleton,
  Progress,
  CircularProgress,
  PulseLoader,
  ContentSkeleton
} from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import AuthStatus from '@/components/modules/auth/auth-status'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex justify-between items-center p-4 border-b border-border">
        <h1 className="text-2xl font-bold">Aniwa</h1>
        <div className="flex items-center space-x-4">
          <AuthStatus />
          <ThemeToggle />
        </div>
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

          {/* Loading States Örnekleri */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Loading States Kütüphanesi</h2>
            
            {/* Spinner Örnekleri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Spinner&apos;lar</h3>
              <div className="flex items-center space-x-6 p-4 border border-border rounded-lg bg-card">
                <div className="text-center">
                  <Spinner size="sm" />
                  <p className="text-xs mt-2">Small</p>
                </div>
                <div className="text-center">
                  <Spinner size="md" />
                  <p className="text-xs mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="text-xs mt-2">Large</p>
                </div>
                <div className="text-center">
                  <Spinner size="xl" />
                  <p className="text-xs mt-2">Extra Large</p>
                </div>
              </div>
            </div>

            {/* Button States */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Button Loading States</h3>
              <div className="flex space-x-4 p-4 border border-border rounded-lg bg-card">
                <Button disabled>
                  <ButtonSpinner />
                  Yükleniyor...
                </Button>
                <Button variant="outline" disabled>
                  <ButtonSpinner />
                  Kaydediliyor...
                </Button>
              </div>
            </div>

            {/* Inline Loading */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Inline Loading</h3>
              <div className="p-4 border border-border rounded-lg bg-card">
                <InlineLoading message="Anime listesi yükleniyor..." />
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Progress Indicators</h3>
              <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
                <div>
                  <p className="text-sm mb-2">Linear Progress</p>
                  <Progress value={65} showLabel />
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm">Circular Progress</p>
                  <CircularProgress value={75} showLabel />
                  <CircularProgress value={45} size={60} showLabel />
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm">Pulse Loader</p>
                  <PulseLoader />
                </div>
              </div>
            </div>

            {/* Skeleton Örnekleri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skeleton Loaders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm mb-2 font-medium">Anime Card Skeleton</p>
                  <AnimeCardSkeleton />
                </div>
                <div>
                  <p className="text-sm mb-2 font-medium">Profile Skeleton</p>
                  <ProfileSkeleton />
                </div>
                <div>
                  <p className="text-sm mb-2 font-medium">Content Skeleton</p>
                  <div className="p-4 border border-border rounded-lg">
                    <ContentSkeleton lines={4} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm mb-2 font-medium">List Skeleton</p>
                  <div className="p-4 border border-border rounded-lg">
                    <ListSkeleton count={3} />
                  </div>
                </div>
    <div>
                  <p className="text-sm mb-2 font-medium">Özel Skeleton</p>
                  <div className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
