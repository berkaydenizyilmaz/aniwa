import { memo } from 'react';
import { TagTable } from './_components/tag-table';

const TagsPage = memo(function TagsPage() {
  // Page header render fonksiyonu - useCallback ile optimize edildi
  const renderPageHeader = () => (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Etiket Yönetimi</h1>
      <p className="text-muted-foreground">
        Anime etiketlerini yönetin, ekleyin, düzenleyin ve silin
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {renderPageHeader()}

      {/* Tag Table */}
      <TagTable />
    </div>
  );
});

export default TagsPage;