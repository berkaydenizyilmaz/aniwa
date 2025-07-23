import { memo } from 'react';
import { TagTable } from './_components/tag-table';

export default function TagsPage() {
  // Page header
  const pageHeader = (
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
      {pageHeader}

      {/* Tag Table */}
      <TagTable />
    </div>
  );
}