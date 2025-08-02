'use client';

import { useState } from 'react';
import { LogFilters } from "@/components/modules/admin/log/log-filters";
import { LogTable } from "@/components/modules/admin/log/log-table";

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');

  const handleSearch = (search: string) => {
    setSearchTerm(search);
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
      <LogFilters 
        onSearch={handleSearch} 
        onLevelChange={handleLevelChange} 
        onStartDateChange={handleStartDateChange} 
        onEndDateChange={handleEndDateChange} 
      />

      {/* Tablo */}
      <LogTable 
        searchTerm={searchTerm}
        selectedLevel={selectedLevel}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
      />
    </div>
  );
} 