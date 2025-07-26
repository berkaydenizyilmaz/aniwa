'use client';

import { useState } from 'react';
import { LogFilters } from "@/components/modules/admin/log/log-filters";
import { LogTable } from "@/components/modules/admin/log/log-table";

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
  };

  const handleStartDateChange = (date: string) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    setSelectedEndDate(date);
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
      <LogFilters onSearch={handleSearch} onLevelChange={handleLevelChange} onStartDateChange={handleStartDateChange} onEndDateChange={handleEndDateChange} onRefresh={handleRefresh} />

      {/* Tablo */}
      <LogTable 
        key={refreshKey}
        searchTerm={searchTerm}
        selectedLevel={selectedLevel}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
      />
    </div>
  );
} 