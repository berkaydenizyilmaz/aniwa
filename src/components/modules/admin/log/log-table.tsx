'use client';

import { useState, useEffect } from 'react';
import { Log } from '@prisma/client';
import { getLogsAction } from '@/lib/actions/log.action';
import { toast } from 'sonner';
import { GetLogsResponse } from '@/lib/types/api/log.api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface LogTableProps {
  searchTerm?: string;
}

export function LogTable({ searchTerm = '' }: LogTableProps) {
  const [logs, setLogs] = useState<(Log & { user?: { id: string; username: string; email: string } | null })[]>([]);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Log'ları getir
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.LOGS, true);
        const result = await getLogsAction();

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
  }, [setLoadingStore]);

  // Arama filtreleme
  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="glass-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Seviye</TableHead>
            <TableHead className="w-32">Event</TableHead>
            <TableHead>Mesaj</TableHead>
            <TableHead className="w-32">Kullanıcı</TableHead>
            <TableHead className="w-40">Tarih</TableHead>
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
  );
} 