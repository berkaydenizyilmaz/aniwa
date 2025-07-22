import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Aniwa yönetim paneli genel bakış
        </p>
      </div>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hoş Geldiniz!</CardTitle>
          <CardDescription>
            Admin paneli hazır. Sol menüden istediğiniz bölüme gidebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bu alan ileride istatistikler, hızlı işlemler ve son aktiviteler için kullanılacak.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
