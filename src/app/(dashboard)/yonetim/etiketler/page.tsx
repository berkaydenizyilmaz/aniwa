import { TagTable } from './_components/tag-table';

export default function TagsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Etiket Yönetimi</h1>
        <p className="text-muted-foreground">
          Anime etiketlerini yönetin, ekleyin, düzenleyin ve silin
        </p>
      </div>

      {/* Tag Table */}
      <TagTable />
    </div>
  );
}