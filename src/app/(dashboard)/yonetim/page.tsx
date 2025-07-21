import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Film, 
  Tag, 
  Building, 
  Tv, 
  TrendingUp, 
  Activity,
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  // Örnek istatistikler (ileride API'den gelecek)
  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: '1,234',
      icon: Users,
      description: 'Kayıtlı kullanıcı sayısı',
      href: '/yonetim/kullanicilar'
    },
    {
      title: 'Anime Serisi',
      value: '567',
      icon: Film,
      description: 'Toplam anime serisi',
      href: '/yonetim/anime'
    },
    {
      title: 'Türler',
      value: '45',
      icon: Tag,
      description: 'Aktif tür sayısı',
      href: '/yonetim/genres'
    },
    {
      title: 'Stüdyolar',
      value: '89',
      icon: Building,
      description: 'Kayıtlı stüdyo',
      href: '/yonetim/studios'
    },
    {
      title: 'Platformlar',
      value: '12',
      icon: Tv,
      description: 'Streaming platformu',
      href: '/yonetim/streaming-platforms'
    },
    {
      title: 'Aktif Kullanıcı',
      value: '234',
      icon: Activity,
      description: 'Son 24 saat',
      href: '/yonetim/users'
    }
  ];

  const quickActions = [
    {
      title: 'Yeni Anime Ekle',
      description: 'Yeni anime serisi oluştur',
      icon: Plus,
      href: '/yonetim/anime/new',
      variant: 'default' as const
    },
    {
      title: 'Kullanıcıları Görüntüle',
      description: 'Tüm kullanıcıları listele',
      icon: Eye,
      href: '/yonetim/users',
      variant: 'outline' as const
    },
    {
      title: 'Tür Ekle',
      description: 'Yeni tür kategorisi oluştur',
      icon: Tag,
      href: '/yonetim/genres/new',
      variant: 'outline' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Aniwa yönetim paneli genel bakış
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Link 
                  href={stat.href}
                  className="text-xs text-primary hover:text-primary/80 transition-colors duration-200 mt-2 inline-block"
                >
                  Detayları görüntüle →
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Hızlı İşlemler</span>
          </CardTitle>
          <CardDescription>
            Sık kullanılan yönetim işlemleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.title}
                  variant={action.variant}
                  asChild
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <Link href={action.href}>
                    <IconComponent className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>
            Sistemdeki son işlemler ve loglar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Yeni kullanıcı kaydı</p>
                <p className="text-xs text-muted-foreground">2 dakika önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Anime serisi güncellendi</p>
                <p className="text-xs text-muted-foreground">15 dakika önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Yeni tür eklendi</p>
                <p className="text-xs text-muted-foreground">1 saat önce</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
