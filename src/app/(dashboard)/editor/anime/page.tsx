'use client';

import { useState } from 'react';
import { AnimeFilters } from "@/components/modules/editor/anime/anime-filters";
import { AnimeTable } from "@/components/modules/editor/anime/anime-table";
import { AnimeTypeSelectionDialog } from "@/components/modules/editor/anime/anime-type-selection-dialog";
import { AnimeFormDialog } from "@/components/modules/editor/anime/anime-form-dialog";
import { AnimeSeries, AnimeType } from '@prisma/client';

export default function AnimePage() {
  const [typeSelectionOpen, setTypeSelectionOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<AnimeSeries | null>(null);
  const [selectedType, setSelectedType] = useState<AnimeType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setSelectedAnime(null);
    setSelectedType(null);
    setTypeSelectionOpen(true);
  };

  const handleTypeSelect = (type: AnimeType) => {
    setSelectedType(type);
    setTypeSelectionOpen(false);
    setFormDialogOpen(true);
  };

  const handleEdit = (anime: AnimeSeries) => {
    setSelectedAnime(anime);
    setSelectedType(null);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setSelectedAnime(null);
    setSelectedType(null);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Anime Serileri</h1>
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

      {/* Type Selection Dialog */}
      <AnimeTypeSelectionDialog
        open={typeSelectionOpen}
        onOpenChange={setTypeSelectionOpen}
        onTypeSelect={handleTypeSelect}
      />

      {/* Form Dialog */}
      <AnimeFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormClose}
        anime={selectedAnime}
        selectedType={selectedType || undefined}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 