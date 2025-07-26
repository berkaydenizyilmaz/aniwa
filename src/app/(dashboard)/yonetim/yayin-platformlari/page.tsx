'use client';

import { useState } from 'react';
import { StreamingPlatformFilters } from "@/components/modules/admin/streaming-platform/streaming-platform-filters";
import { StreamingPlatformTable } from "@/components/modules/admin/streaming-platform/streaming-platform-table";
import { StreamingPlatformFormDialog } from "@/components/modules/admin/streaming-platform/streaming-platform-form-dialog";
import { StreamingPlatform } from '@prisma/client';

export default function StreamingPlatformsPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatform | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setSelectedPlatform(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (platform: StreamingPlatform) => {
    setSelectedPlatform(platform);
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
        <h1 className="text-3xl font-bold">Streaming Platformları</h1>
        <p className="text-muted-foreground">
          Streaming platformlarını yönetin
        </p>
      </div>

      {/* Filtreler */}
      <StreamingPlatformFilters onSearch={handleSearch} onAddNew={handleAddNew} />

      {/* Tablo */}
      <StreamingPlatformTable 
        key={refreshKey}
        onEdit={handleEdit}
        searchTerm={searchTerm}
      />

      {/* Form Dialog */}
      <StreamingPlatformFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        platform={selectedPlatform}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 