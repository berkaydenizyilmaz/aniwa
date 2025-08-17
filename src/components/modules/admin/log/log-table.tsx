'use client';

import { useState, useEffect } from 'react';
import { Log, LogLevel } from '@prisma/client';
import { getLogsAction } from '@/lib/actions/admin/log.action';
import { toast } from 'sonner';
import { GetLogsResponse } from '@/lib/types/api/log.api';
import { type LogFilters } from '@/lib/schemas/log.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { SHARED_SYSTEM } from '@/lib/constants/shared/system';

interface LogTableProps {
  searchTerm?: string;
  selectedLevel?: string;
  selectedStartDate?: string;
  selectedEndDate?: string;
}

export function LogTable({ searchTerm = '', selectedLevel = 'all', selectedStartDate = '', selectedEndDate = '' }: LogTableProps) {
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<(Log & { user?: { id: string; username: string; email: string } | null }) | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);

  // Filtreler değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedStartDate, selectedEndDate]);

  // Filtreleri hazırla
  const filters: LogFilters = {
    page: currentPage,
    limit: limit
  };
  if (selectedLevel !== 'all') {
    filters.level = selectedLevel as LogLevel;
  }
  if (selectedStartDate) {
    filters.startDate = selectedStartDate;
  }
  if (selectedEndDate) {
    filters.endDate = selectedEndDate;
  }
  if (searchTerm) {
    filters.search = searchTerm;
  }

  // Log'ları getir
  const { data, isLoading, error } = useQuery({
    queryKey: ['logs', filters],
    queryFn: async () => {
      const result = await getLogsAction(filters);
      if (!result.success) {
        throw new Error(result.error || 'Loglar yüklenirken bir hata oluştu');
      }
      return result.data as GetLogsResponse;
    },
    staleTime: 30000, // 30 saniye
  });

  // Hata durumu
  if (error) {
    toast.error(error.message || 'Loglar yüklenirken bir hata oluştu');
  }

  const logs = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalLogs = data?.total || 0;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('tr-TR');
  };

  const getLevelLabel = (level: LogLevel) => {
    return SHARED_SYSTEM.LOG.LEVEL_LABELS[level];
  };

  const getLevelColor = (level: LogLevel) => {
    return SHARED_SYSTEM.LOG.LEVEL_COLORS[level];
  };

  const handleViewMetadata = (log: Log & { user?: { id: string; username: string; email: string } | null }) => {
    setSelectedLog(log);
    setMetadataDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (isLoading) {
    return (
      <div className="glass-card">
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Seviye</TableHead>
              <TableHead className="w-32">Event</TableHead>
              <TableHead>Mesaj</TableHead>
              <TableHead className="w-32">Kullanıcı</TableHead>
              <TableHead className="w-40">Tarih</TableHead>
              <TableHead className="w-16">Detay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <span className={`font-mono text-sm ${getLevelColor(log.level)}`}>
                    {getLevelLabel(log.level)}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {log.event}
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {log.message}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.user?.username || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(log.timestamp)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewMetadata(log)}
                    className="h-8 w-8 p-0"
                    disabled={!log.metadata}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {logs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun log bulunamadı.' : 'Henüz log bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {totalLogs} log, {currentPage}. sayfa / {totalPages} sayfa
            </div>
            
            <div className="flex items-center gap-2">
              {/* İlk sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Önceki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Sayfa numaraları */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-2 py-1 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        disabled={isLoading}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Sonraki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Dialog */}
      <Dialog open={metadataDialogOpen} onOpenChange={setMetadataDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log Detayları</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Seviye:</span>
                  <span className={`ml-2 ${getLevelColor(selectedLog.level)}`}>
                    {getLevelLabel(selectedLog.level)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Event:</span>
                  <span className="ml-2 font-mono">{selectedLog.event}</span>
                </div>
                <div>
                  <span className="font-semibold">Kullanıcı:</span>
                  <span className="ml-2">{selectedLog.user?.username || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold">Tarih:</span>
                  <span className="ml-2">{formatDate(selectedLog.timestamp)}</span>
                </div>
              </div>
              <div>
                <span className="font-semibold">Mesaj:</span>
                <p className="mt-1 text-sm text-muted-foreground">{selectedLog.message}</p>
              </div>
              {selectedLog.metadata && (
                <div>
                  <span className="font-semibold">Metadata:</span>
                  <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-60">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 
