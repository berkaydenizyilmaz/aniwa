'use client';

import { useState } from 'react';
import { LogFilters } from "@/components/modules/admin/log/log-filters";
import { LogTable } from "@/components/modules/admin/log/log-table";

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Loglar</h1>
        <p className="text-muted-foreground">
          Sistem loglarını görüntüleyin
        </p>
      </div>

      {/* Filtreler */}
      <LogFilters onSearch={handleSearch} onRefresh={handleRefresh} />

      {/* Tablo */}
      <LogTable 
        key={refreshKey}
        searchTerm={searchTerm}
      />
    </div>
  );
} 