import { GenreTable } from './_components/genre-table';

export default function GenresPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/20 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Tür Yönetimi
        </h1>
        <p className="text-muted-foreground mt-2">
          Anime türlerini yönetin, ekleyin, düzenleyin ve silin
        </p>
      </div>

      {/* Genre Table */}
      <GenreTable />
    </div>
  );
} 