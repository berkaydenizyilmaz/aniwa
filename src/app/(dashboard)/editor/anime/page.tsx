'use client';

import { useState } from 'react';
import { AnimeFilters } from "@/components/modules/editor/anime/anime-filters";
import { AnimeTable } from "@/components/modules/editor/anime/anime-table";
import { AnimeFormDialog } from "@/components/modules/editor/anime/anime-form-dialog";
import { AnimeSeries } from '@prisma/client';

export default function AnimePage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<AnimeSeries | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setSelectedAnime(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (anime: AnimeSeries) => {
    setSelectedAnime(anime);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Anime</h1>
        <p className="text-muted-foreground">
          Anime serilerini yönetin
        </p>
      </div>

      {/* Filtreler */}
      <AnimeFilters onSearch={handleSearch} onAddNew={handleAddNew} />

      {/* Tablo */}
      <AnimeTable 
        key={refreshKey}
        onEdit={handleEdit}
        searchTerm={searchTerm}
      />

      {/* Form Dialog */}
      <AnimeFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        anime={selectedAnime}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 