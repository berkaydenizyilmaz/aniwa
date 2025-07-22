import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage = memo(function AdminDashboardPage() {
  // Page header render fonksiyonu - useCallback ile optimize edildi
  const renderPageHeader = () => (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      <p className="text-muted-foreground">
        Aniwa yönetim paneli genel bakış
      </p>
    </div>
  );

  // Welcome card render fonksiyonu - useCallback ile optimize edildi
  const renderWelcomeCard = () => (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">Hoş Geldiniz!</CardTitle>
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
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {renderPageHeader()}

      {/* Welcome Card */}
      {renderWelcomeCard()}
    </div>
  );
});

export default AdminDashboardPage;
