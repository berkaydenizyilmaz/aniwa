'use client';

import { useState } from 'react';
import { StreamingPlatformFilters } from "@/components/modules/admin/streaming-platform/streaming-platform-filters";
import { StreamingPlatformTable } from "@/components/modules/admin/streaming-platform/streaming-platform-table";
import { StreamingPlatformFormDialog } from "@/components/modules/admin/streaming-platform/streaming-platform-form-dialog";
import { StreamingPlatform } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/constants/query-keys';

export default function StreamingPlatformsPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatform | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const handleAddNew = () => {
    setSelectedPlatform(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (platform: StreamingPlatform) => {
    setSelectedPlatform(platform);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    // Query'yi invalidate et
    queryClient.invalidateQueries({ queryKey: queryKeys.masterData.streamingPlatform.all });
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">İzleme Platformları</h1>
        <p className="text-muted-foreground">
          İzleme platformlarını yönetin
        </p>
      </div>

      {/* Filtreler */}
      <StreamingPlatformFilters onSearch={handleSearch} onAddNew={handleAddNew} />

      {/* Tablo */}
      <StreamingPlatformTable 
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