'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimeSeriesFilters } from "@/components/modules/editor/anime/anime-series-filters";
import { AnimeSeriesTable } from "@/components/modules/editor/anime/anime-series-table";
import { AnimeSeriesFormDialog } from "@/components/modules/editor/anime/anime-series-form-dialog";
import { AnimeSeries } from '@prisma/client';
import { ROUTES_DOMAIN } from '@/lib/constants';

export default function EditorAnimePage() {
  const router = useRouter();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedAnimeSeries, setSelectedAnimeSeries] = useState<AnimeSeries | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleAddNew = () => {
    setSelectedAnimeSeries(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (animeSeries: AnimeSeries) => {
    setSelectedAnimeSeries(animeSeries);
    setFormDialogOpen(true);
  };

  const handleMediaParts = (animeSeries: AnimeSeries) => {
    // Media parts sayfasına yönlendir
            router.push(ROUTES_DOMAIN.PAGES.EDITOR.MEDIA_PARTS.replace(':animeId', animeSeries.id));
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Anime Yönetimi</h1>
        <p className="text-muted-foreground">
          Anime serilerini ve medya parçalarını yönetin
        </p>
      </div>

      {/* Filtreler */}
      <AnimeSeriesFilters 
        onSearch={handleSearch} 
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
        onAddNew={handleAddNew} 
      />

      {/* Tablo */}
      <AnimeSeriesTable 
        refreshKey={refreshKey}
        onEdit={handleEdit}
        onMediaParts={handleMediaParts}
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
      />

      {/* Form Dialog */}
      <AnimeSeriesFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        animeSeries={selectedAnimeSeries}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 