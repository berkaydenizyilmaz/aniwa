'use client'

import { useState, useEffect, useCallback } from 'react'
import { LogsFilter, type FilterState } from './_components/logs-filter'
import { LogsList } from './_components/logs-list'
import type { PaginatedResponse, LogWithUser } from '@/types'
import { ROUTES } from '@/constants'

export default function LogsPage() {
  const [data, setData] = useState<PaginatedResponse<LogWithUser> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    level: [],
    event: [],
    userId: undefined,
    startDate: undefined,
    endDate: undefined
  })

  const fetchLogs = useCallback(async (newFilters: FilterState, page = 1) => {
    setIsLoading(true)
    
    try {
      const params = new URLSearchParams()
      
      params.set('limit', '20')
      params.set('page', page.toString())
      
      if (newFilters.level && newFilters.level.length > 0) {
        newFilters.level.forEach(level => params.append('level', level))
      }
      
      if (newFilters.event && newFilters.event.length > 0) {
        newFilters.event.forEach(event => params.append('event', event))
      }
      
      if (newFilters.userId) {
        params.set('userId', newFilters.userId)
      }
      
      if (newFilters.startDate) {
        params.set('startDate', newFilters.startDate)
      }
      
      if (newFilters.endDate) {
        params.set('endDate', newFilters.endDate)
      }

      const response = await fetch(`${ROUTES.API.ADMIN.LOGS}?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result)
      }
    } catch (error) {
      console.error('Log getirme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // İlk yükleme
  useEffect(() => {
    fetchLogs(filters)
  }, [fetchLogs, filters])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    fetchLogs(newFilters, 1)
  }

  const handlePageChange = (page: number) => {
    fetchLogs(filters, page)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sistem Logları</h1>
        <p className="text-muted-foreground">
          Sistem aktivitelerini görüntüleyin ve filtreleyin
        </p>
      </div>

      <LogsFilter
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      <LogsList
        data={data}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  )
}