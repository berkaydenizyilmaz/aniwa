'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogLevel } from '@prisma/client'
import type { LogFilters } from '@/types/logging'

// Component için string tarihleri kullanan local tip
type FilterState = Omit<LogFilters, 'startDate' | 'endDate' | 'limit' | 'offset' | 'sortBy' | 'sortOrder'> & {
  startDate?: string
  endDate?: string
}

interface LogsFilterProps {
  onFiltersChange: (filters: FilterState) => void
  isLoading?: boolean
}

export function LogsFilter({ onFiltersChange, isLoading }: LogsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    level: [],
    event: [],
    userId: undefined,
    startDate: undefined,
    endDate: undefined
  })

  const logLevels = [
    { value: LogLevel.ERROR, label: 'Hata' },
    { value: LogLevel.WARN, label: 'Uyarı' },
    { value: LogLevel.INFO, label: 'Bilgi' },
    { value: LogLevel.DEBUG, label: 'Debug' }
  ]

  const handleLevelChange = (level: LogLevel) => {
    const currentLevels = filters.level || []
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level]
    
    const newFilters = { ...filters, level: newLevels }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleInputChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [field]: value || undefined }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      level: [],
      event: [],
      userId: undefined,
      startDate: undefined,
      endDate: undefined
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtreler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Log Seviyeleri</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {logLevels.map(({ value, label }) => (
              <Button
                key={value}
                variant={filters.level?.includes(value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLevelChange(value)}
                disabled={isLoading}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="userId" className="text-sm font-medium">
            Kullanıcı ID
          </Label>
          <Input
            id="userId"
            placeholder="Kullanıcı ID'si girin"
            value={filters.userId || ''}
            onChange={(e) => handleInputChange('userId', e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-sm font-medium">
              Başlangıç Tarihi
            </Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={filters.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-sm font-medium">
              Bitiş Tarihi
            </Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={filters.endDate || ''}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={clearFilters} disabled={isLoading}>
            Filtreleri Temizle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export type { FilterState } 