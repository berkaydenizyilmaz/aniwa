import { GenreTable } from './_components/genre-table';

export default function GenresPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Tür Yönetimi</h1>
        <p className="text-muted-foreground">
          Anime türlerini yönetin, ekleyin, düzenleyin ve silin
        </p>
      </div>

      {/* Genre Table */}
      <GenreTable />
    </div>
  );
} 