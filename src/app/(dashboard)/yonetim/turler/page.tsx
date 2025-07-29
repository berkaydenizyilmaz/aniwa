'use client';

import { useState } from 'react';
import { GenreFilters } from "@/components/modules/admin/genre/genre-filters";
import { GenreTable } from "@/components/modules/admin/genre/genre-table";
import { GenreFormDialog } from "@/components/modules/admin/genre/genre-form-dialog";
import { Genre } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

export default function GenresPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const handleAddNew = () => {
    setSelectedGenre(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (genre: Genre) => {
    setSelectedGenre(genre);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    // Query'yi invalidate et
    queryClient.invalidateQueries({ queryKey: ['genres'] });
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
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
      <GenreFilters onSearch={handleSearch} onAddNew={handleAddNew} />

      {/* Tablo */}
      <GenreTable 
        onEdit={handleEdit}
        searchTerm={searchTerm}
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