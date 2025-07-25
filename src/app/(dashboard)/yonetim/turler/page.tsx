'use client';

import { useState } from 'react';
import { GenreFilters } from "@/components/modules/genre/genre-filters";
import { GenreTable } from "@/components/modules/genre/genre-table";
import { GenreFormDialog } from "@/components/modules/genre/genre-form-dialog";
import { Genre } from '@prisma/client';

export default function GenresPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddNew = () => {
    setSelectedGenre(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (genre: Genre) => {
    setSelectedGenre(genre);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

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
      <GenreFilters onAddNew={handleAddNew} />

      {/* Tablo */}
      <GenreTable 
        key={refreshKey}
        onEdit={handleEdit} 
      />

      {/* Form Dialog */}
      <GenreFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        genre={selectedGenre}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 