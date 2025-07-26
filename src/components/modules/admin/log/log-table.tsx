'use client';

import { useState, useEffect } from 'react';
import { Log, LogLevel } from '@prisma/client';
import { getLogsAction } from '@/lib/actions/log.action';
import { toast } from 'sonner';
import { GetLogsResponse } from '@/lib/types/api/log.api';
import { type LogFilters } from '@/lib/schemas/log.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
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
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface LogTableProps {
  searchTerm?: string;
  selectedLevel?: string;
  selectedStartDate?: string;
  selectedEndDate?: string;
}

export function LogTable({ searchTerm = '', selectedLevel = 'all', selectedStartDate = '', selectedEndDate = '' }: LogTableProps) {
  const [logs, setLogs] = useState<(Log & { user?: { id: string; username: string; email: string } | null })[]>([]);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<(Log & { user?: { id: string; username: string; email: string } | null }) | null>(null);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Log'ları getir
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.LOGS, true);
        
        // Filtreleri hazırla
        const filters: LogFilters = {
          page: 1,
          limit: 50
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
        
        const result = await getLogsAction(filters);

        if (!result.success) {
          toast.error(result.error || 'Loglar yüklenirken bir hata oluştu');
          return;
        }

        const data = result.data as GetLogsResponse;
        setLogs(data.logs);
      } catch (error) {
        console.error('Fetch logs error:', error);
        toast.error('Loglar yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.LOGS, false);
      }
    };

    fetchLogs();
  }, [setLoadingStore, searchTerm, selectedLevel, selectedStartDate, selectedEndDate]);

    // Server-side filtreleme kullanıldığı için client-side filtreleme gerekmez
  const filteredLogs = logs;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('tr-TR');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-500';
      case 'WARN':
        return 'text-yellow-500';
      case 'INFO':
        return 'text-blue-500';
      case 'DEBUG':
        return 'text-purple-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleViewMetadata = (log: Log & { user?: { id: string; username: string; email: string } | null }) => {
    setSelectedLog(log);
    setMetadataDialogOpen(true);
  };

  if (isLoading(LOADING_KEYS.PAGES.LOGS)) {
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
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <span className={`font-mono text-sm ${getLevelColor(log.level)}`}>
                    {log.level}
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

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun log bulunamadı.' : 'Henüz log bulunmuyor.'}
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
                    {selectedLog.level}
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