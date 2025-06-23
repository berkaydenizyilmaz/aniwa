import { getLogStats } from '@/services/log/log.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, AlertTriangle, Info, Bug } from 'lucide-react'
import { LogLevel } from '@prisma/client'

// Log seviyesi ikonları
const LOG_LEVEL_ICONS = {
  ERROR: AlertCircle,
  WARN: AlertTriangle, 
  INFO: Info,
  DEBUG: Bug,
}

// Log seviyesi renkleri
const LOG_LEVEL_COLORS = {
  ERROR: 'text-red-600 dark:text-red-400',
  WARN: 'text-yellow-600 dark:text-yellow-400',
  INFO: 'text-blue-600 dark:text-blue-400', 
  DEBUG: 'text-gray-600 dark:text-gray-400',
}

export async function LogsStats() {
  // Son 7 günün istatistiklerini getir
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const statsResult = await getLogStats({
    startDate: sevenDaysAgo,
    endDate: new Date(),
  })

  if (!statsResult.success || !statsResult.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">İstatistikler yüklenemedi</p>
        </CardContent>
      </Card>
    )
  }

  const stats = statsResult.data
  const totalLogs = Object.values(stats).reduce((sum, count) => sum + count, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Toplam */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLogs}</div>
          <p className="text-xs text-muted-foreground">Son 7 gün</p>
        </CardContent>
      </Card>

      {/* Her seviye için kart */}
      {Object.entries(LOG_LEVEL_COLORS).map(([level, colorClass]) => {
        const count = stats[level as LogLevel] || 0
        const Icon = LOG_LEVEL_ICONS[level as LogLevel]
        
        return (
          <Card key={level}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{level}</CardTitle>
              <Icon className={`h-4 w-4 ${colorClass}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">
                {totalLogs > 0 ? `%${Math.round((count / totalLogs) * 100)}` : '0%'}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 