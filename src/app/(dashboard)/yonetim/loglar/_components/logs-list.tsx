'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogLevel } from '@prisma/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginatedResponse, LogWithUser } from '@/types'

interface LogsListProps {
  data: PaginatedResponse<LogWithUser> | null
  onPageChange: (page: number) => void
  isLoading?: boolean
}

function getLevelColor(level: LogLevel) {
  switch (level) {
    case LogLevel.ERROR:
      return 'destructive'
    case LogLevel.WARN:
      return 'secondary'
    case LogLevel.INFO:
      return 'default'
    case LogLevel.DEBUG:
      return 'outline'
    default:
      return 'outline'
  }
}

function getLevelLabel(level: LogLevel) {
  switch (level) {
    case LogLevel.ERROR:
      return 'Hata'
    case LogLevel.WARN:
      return 'Uyarı'
    case LogLevel.INFO:
      return 'Bilgi'
    case LogLevel.DEBUG:
      return 'Debug'
    default:
      return level
  }
}

export function LogsList({ data, onPageChange, isLoading }: LogsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loglar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Loglar yükleniyor...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loglar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Log bulunamadı</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loglar ({data.pagination.total})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.data.map((log) => (
            <div
              key={log.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={getLevelColor(log.level)}>
                    {getLevelLabel(log.level)}
                  </Badge>
                  <span className="text-sm font-medium">{log.event}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString('tr-TR')}
                </span>
              </div>
              
              <p className="text-sm">{log.message}</p>
              
              {log.user && (
                <div className="text-xs text-muted-foreground">
                  Kullanıcı: {log.user.username} ({log.user.email})
                </div>
              )}
              
              {log.metadata && typeof log.metadata === 'object' && Object.keys(log.metadata).length > 0 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">Metadata</summary>
                  <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Sayfa {data.pagination.page} / {data.pagination.totalPages} ({data.pagination.total} toplam log)
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasPrev}
              onClick={() => onPageChange(data.pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasNext}
              onClick={() => onPageChange(data.pagination.page + 1)}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export type { LogsListProps } 