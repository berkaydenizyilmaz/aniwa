import { memo } from 'react';
import { GenreTable } from './_components/genre-table';

const GenresPage = memo(function GenresPage() {
  // Page header render fonksiyonu - useCallback ile optimize edildi
  const renderPageHeader = () => (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Tür Yönetimi</h1>
      <p className="text-muted-foreground">
        Anime türlerini yönetin, ekleyin, düzenleyin ve silin
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {renderPageHeader()}

      {/* Genre Table */}
      <GenreTable />
    </div>
  );
});

export default GenresPage; 