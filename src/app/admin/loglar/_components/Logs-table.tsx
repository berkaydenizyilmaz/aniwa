'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import type { LogWithUser, PaginationInfo } from '@/types/logging'
import { LogLevel } from '@prisma/client'

interface LogsTableProps {
  logs: LogWithUser[]
  pagination: PaginationInfo
}

// Log seviyesi renkleri
const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  WARN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  DEBUG: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

export function LogsTable({ logs, pagination }: LogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<LogWithUser | null>(null)

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1
  const totalPages = Math.ceil(pagination.total / pagination.limit)

  // Sayfa değiştirme fonksiyonu
  const changePage = (page: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', page.toString())
    window.location.href = url.toString()
  }

  return (
    <div className="space-y-4">
      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Zaman</th>
              <th className="text-left p-3 font-medium">Seviye</th>
              <th className="text-left p-3 font-medium">Olay</th>
              <th className="text-left p-3 font-medium">Mesaj</th>
              <th className="text-left p-3 font-medium">Kullanıcı</th>
              <th className="text-left p-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-muted/50">
                <td className="p-3 text-sm">
                  {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm:ss', { locale: tr })}
                </td>
                <td className="p-3">
                  <Badge className={LOG_LEVEL_COLORS[log.level]}>
                    {log.level}
                  </Badge>
                </td>
                <td className="p-3 text-sm font-mono">{log.event}</td>
                <td className="p-3 text-sm max-w-md truncate" title={log.message}>
                  {log.message}
                </td>
                <td className="p-3 text-sm">
                  {log.user ? (
                    <div>
                      <div className="font-medium">{log.user.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.user.roles.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Sistem</span>
                  )}
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLog(log)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} / {pagination.total} kayıt
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <span className="text-sm">
              Sayfa {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Log Detayları Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Log Detayları</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ID:</label>
                <div className="text-sm font-mono bg-muted p-2 rounded">{selectedLog.id}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Zaman:</label>
                <div className="text-sm">
                  {format(new Date(selectedLog.timestamp), 'dd MMMM yyyy HH:mm:ss', { locale: tr })}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Seviye:</label>
                <div>
                  <Badge className={LOG_LEVEL_COLORS[selectedLog.level]}>
                    {selectedLog.level}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Olay:</label>
                <div className="text-sm font-mono">{selectedLog.event}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Mesaj:</label>
                <div className="text-sm bg-muted p-2 rounded">{selectedLog.message}</div>
              </div>
              
              {selectedLog.user && (
                <div>
                  <label className="text-sm font-medium">Kullanıcı:</label>
                  <div className="text-sm">
                    <div><strong>Kullanıcı Adı:</strong> {selectedLog.user.username}</div>
                    <div><strong>Email:</strong> {selectedLog.user.email}</div>
                    <div><strong>Roller:</strong> {selectedLog.user.roles.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {selectedLog.metadata && (
                <div>
                  <label className="text-sm font-medium">Metadata:</label>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 