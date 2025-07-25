import { GenreFilters } from "@/components/modules/genre/genre-filters";
import { GenreTable } from "@/components/modules/genre/genre-table";

export default function GenresPage() {
  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Türler</h1>
        <p className="text-muted-foreground">
          Anime türlerini yönetin
        </p>
      </div>

      {/* Filtreler */}
      <GenreFilters />

      {/* Tablo */}
      <GenreTable />
    </div>
  );
} 