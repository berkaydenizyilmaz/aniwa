'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogLevel } from '@prisma/client'

export function LogsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [level, setLevel] = useState(searchParams.get('level') || '')
  const [event, setEvent] = useState(searchParams.get('event') || '')
  const [userId, setUserId] = useState(searchParams.get('userId') || '')

  // Filtreleri uygula
  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (level) params.set('level', level)
    if (event) params.set('event', event)
    if (userId) params.set('userId', userId)
    
    // Sayfa numarasını sıfırla
    params.delete('page')
    
    router.push(`/admin/loglar?${params.toString()}`)
  }

  // Filtreleri temizle
  const clearFilters = () => {
    setLevel('')
    setEvent('')
    setUserId('')
    router.push('/admin/loglar')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Log Seviyesi */}
      <div className="space-y-2">
        <Label htmlFor="level">Log Seviyesi</Label>
        <select 
          id="level"
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-2 border rounded-md bg-background"
        >
          <option value="">Tümü</option>
          <option value={LogLevel.ERROR}>ERROR</option>
          <option value={LogLevel.WARN}>WARN</option>
          <option value={LogLevel.INFO}>INFO</option>
          <option value={LogLevel.DEBUG}>DEBUG</option>
        </select>
      </div>

      {/* Olay */}
      <div className="space-y-2">
        <Label htmlFor="event">Olay</Label>
        <Input
          id="event"
          placeholder="Olay ara..."
          value={event}
          onChange={(e) => setEvent(e.target.value)}
        />
      </div>

      {/* Kullanıcı ID */}
      <div className="space-y-2">
        <Label htmlFor="userId">Kullanıcı ID</Label>
        <Input
          id="userId"
          placeholder="Kullanıcı ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      {/* Butonlar */}
      <div className="space-y-2">
        <Label>&nbsp;</Label>
        <div className="flex gap-2">
          <Button onClick={applyFilters} className="flex-1">
            Filtrele
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Temizle
          </Button>
        </div>
      </div>
    </div>
  )
} 