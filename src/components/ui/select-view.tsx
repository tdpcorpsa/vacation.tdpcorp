'use client'

import { LayoutGrid, List, Table as TableIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ViewType = 'table' | 'list' | 'card'

interface SelectViewProps {
  view: ViewType
  onViewChange: (view: ViewType) => void
  className?: string
}

export function SelectView({ view, onViewChange, className }: SelectViewProps) {
  return (
    <div
      className={cn('flex items-center gap-1 rounded-md border p-1', className)}
    >
      <Button
        variant={view === 'table' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onViewChange('table')}
        title="Tabla"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onViewChange('list')}
        title="Lista"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'card' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onViewChange('card')}
        title="Tarjetas"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  )
}
