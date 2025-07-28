'use client';

import { useState } from 'react';
import { AnimeFilters } from "@/components/modules/editor/anime/anime-filters";
import { AnimeTable } from "@/components/modules/editor/anime/anime-table";
import { AnimeTypeSelectionDialog } from "@/components/modules/editor/anime/anime-type-selection-dialog";
import { AnimeMultiPartSelectionDialog } from "@/components/modules/editor/anime/anime-multi-part-selection-dialog";
import { AnimeFormDialog } from "@/components/modules/editor/anime/anime-form-dialog";
import { AnimeSeries, AnimeType } from '@prisma/client';

export default function AnimePage() {
  const [typeSelectionOpen, setTypeSelectionOpen] = useState(false);
  const [multiPartSelectionOpen, setMultiPartSelectionOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<AnimeSeries | null>(null);
  const [selectedType, setSelectedType] = useState<AnimeType | null>(null);
  const [selectedIsMultiPart, setSelectedIsMultiPart] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setSelectedAnime(null);
    setSelectedType(null);
    setSelectedIsMultiPart(null);
    setTypeSelectionOpen(true);
  };

  const handleTypeSelect = (type: AnimeType) => {
    setSelectedType(type);
    setTypeSelectionOpen(false);
    
    // MOVIE ve TV için direkt form açılır
    if (type === 'MOVIE' || type === 'TV') {
      const isMultiPart = type === 'TV';
      setSelectedIsMultiPart(isMultiPart);
      setFormDialogOpen(true);
    } else {
      // OVA, ONA, SPECIAL, TV_SHORT için multi-part seçimi
      setMultiPartSelectionOpen(true);
    }
  };

  const handleMultiPartSelect = (isMultiPart: boolean) => {
    setSelectedIsMultiPart(isMultiPart);
    setMultiPartSelectionOpen(false);
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
    setSelectedIsMultiPart(null);
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

      {/* Multi-Part Selection Dialog */}
      <AnimeMultiPartSelectionDialog
        open={multiPartSelectionOpen}
        onOpenChange={setMultiPartSelectionOpen}
        selectedType={selectedType!}
        onMultiPartSelect={handleMultiPartSelect}
      />

      {/* Form Dialog */}
      <AnimeFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormClose}
        anime={selectedAnime}
        selectedType={selectedType || undefined}
        selectedIsMultiPart={selectedIsMultiPart}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 