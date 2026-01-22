'use client'

import { LayoutGrid, List, Table } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export type ViewType = 'table' | 'list' | 'grid'

export function useView(defaultView: ViewType = 'table') {
  return useQueryState(
    'view',
    parseAsString.withDefault(defaultView).withOptions({
      shallow: true,
      history: 'replace',
    })
  )
}

export function SelectView() {
  const [view, setView] = useView()

  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => {
        if (value) setView(value as ViewType)
      }}
    >
      <ToggleGroupItem value="table" aria-label="Vista de tabla">
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Vista de lista">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Vista de tarjetas">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
