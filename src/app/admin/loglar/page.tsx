import { Suspense } from 'react'
import { getLogs } from '@/services/log/log.service'
import { LogsTable } from './_components/Logs-table'
import { LogsFilters } from './_components/Logs-filters'
import { LogsStats } from './_components/Logs-stats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/loading'
import type { LogLevel } from '@prisma/client'

interface AdminLogsPageProps {
  searchParams: {
    level?: string
    event?: string
    userId?: string
    page?: string
    limit?: string
  }
}

export default async function AdminLogsPage({ searchParams }: AdminLogsPageProps) {
  // Sayfa parametrelerini parse et
  const page = parseInt(searchParams.page || '1')
  const limit = parseInt(searchParams.limit || '50')
  const offset = (page - 1) * limit

  // Log verilerini getir
  const logsResult = await getLogs({
    level: searchParams.level as LogLevel | undefined,
    event: searchParams.event,
    userId: searchParams.userId,
    limit,
    offset,
  })

  if (!logsResult.success || !logsResult.data) {
    throw new Error(logsResult.error || 'Loglar yüklenemedi')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistem Logları</h1>
          <p className="text-muted-foreground">
            Sistem olaylarını ve kullanıcı aktivitelerini görüntüle
          </p>
        </div>
      </div>

      {/* İstatistikler */}
      <Suspense fallback={<Spinner size="lg" />}>
        <LogsStats />
      </Suspense>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
          <CardDescription>
            Logları filtrelemek için aşağıdaki seçenekleri kullanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogsFilters />
        </CardContent>
      </Card>

      {/* Loglar Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Log Kayıtları</CardTitle>
          <CardDescription>
            Toplam {logsResult.data?.pagination.total} kayıt bulundu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogsTable 
            logs={logsResult.data.logs}
            pagination={logsResult.data.pagination}
          />
        </CardContent>
      </Card>
    </div>
  )
}