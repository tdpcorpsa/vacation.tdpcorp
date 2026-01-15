'use client'

import { VacationPeriodsActions } from './vacation-periods-actions'
import { useVacationPeriodsList } from '@/hooks/vacation-periods/use-vacation-periods-list'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Item } from '@/components/ui/item'
import { PaginationGroup } from '@/components/ui/pagination-group/pagination-group'
import { usePagination } from '@/components/ui/pagination-group/use-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tables } from '@/types/supabase.types'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { LayoutGrid, List, Table as TableIcon } from 'lucide-react'
import { useState } from 'react'

export function VacationPeriodsList() {
  const { page, pageSize } = usePagination()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table' | 'list' | 'card'>('table')

  const { data, isLoading } = useVacationPeriodsList({
    pagination: { page, pageSize },
    search,
  })

  const columns: ColumnDef<
    Tables<{ schema: 'vacation' }, 'vacation_periods'>
  >[] = [
    {
      accessorKey: 'period_label',
      header: 'Periodo',
    },
    {
      accessorKey: 'start_date',
      header: 'Inicio',
      cell: ({ row }) => (
        <span>{new Date(row.original.start_date).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: 'end_date',
      header: 'Fin',
      cell: ({ row }) => (
        <span>{new Date(row.original.end_date).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: 'total_days',
      header: 'Total',
    },
    {
      accessorKey: 'available_days',
      header: 'Disponibles',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <VacationPeriodsActions vacationPeriod={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.total || 0) / pageSize),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border p-1">
            <Button
              variant={view === 'table' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setView('table')}
              className="h-8 w-8"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setView('list')}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'card' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setView('card')}
              className="h-8 w-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <>
          {view === 'table' && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No hay resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {view === 'list' && (
            <div className="space-y-2">
              {data?.data.map((period) => (
                <Item
                  key={period.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{period.period_label}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(period.start_date).toLocaleDateString()} -{' '}
                      {new Date(period.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-bold">{period.available_days}</span>{' '}
                      / {period.total_days} días
                    </div>
                    <VacationPeriodsActions vacationPeriod={period} />
                  </div>
                </Item>
              ))}
              {data?.data.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay resultados.
                </div>
              )}
            </div>
          )}

          {view === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.data.map((period) => (
                <Card key={period.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{period.period_label}</h3>
                    <VacationPeriodsActions vacationPeriod={period} />
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {new Date(period.start_date).toLocaleDateString()} -{' '}
                    {new Date(period.end_date).toLocaleDateString()}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Días Totales: {period.total_days}</span>
                    <span className="font-bold text-green-600">
                      Disp: {period.available_days}
                    </span>
                  </div>
                </Card>
              ))}
              {data?.data.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No hay resultados.
                </div>
              )}
            </div>
          )}
        </>
      )}

      <PaginationGroup total={data?.total || 0} pageSize={pageSize} />
    </div>
  )
}
