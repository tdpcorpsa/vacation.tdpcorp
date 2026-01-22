'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLaborRegimesList } from '@/hooks/labor-regimes/use-labor-regimes-list'
import { LaborRegimeActions } from './labor-regimes-actions'
import { Tables } from '@/types/supabase.types'
import { usePagination } from '@/components/ui/pagination-group'
import { useSearchQuery } from '@/components/ui/search-input'
import { PaginationGroup } from '@/components/ui/pagination-group'
import { SearchInput } from '@/components/ui/search-input'
import { SkeletonList } from '@/components/ui/skeleton-list'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { SelectView, useView } from '@/components/ui/select-view'
import { LaborRegimeCard } from './labor-regimes-card'
import { LaborRegimeItem } from './labor-regimes-item'

type LaborRegime = Tables<{ schema: 'vacation' }, 'labor_regime'>

const columns: ColumnDef<LaborRegime>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'days',
    header: 'Días',
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active')
      return (
        <span
          className={
            isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
          }
        >
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <LaborRegimeActions item={row.original} />,
  },
]

export function LaborRegimesList() {
  const { page, pageSize, setPage, setPageSize } = usePagination()
  const [search] = useSearchQuery()
  const [view] = useView()

  const { data, isPending, error } = useLaborRegimesList({
    pagination: { page, pageSize },
    search: search || undefined,
  })

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: data?.total,
  })

  if (isPending) {
    return <SkeletonList count={5} />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los regímenes laborales.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput className="flex-1" />
        <SelectView />
      </div>

      {view === 'table' && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
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
        <div className="space-y-4">
          {data?.data.map((item) => (
            <LaborRegimeItem key={item.id} item={item} />
          ))}
          {!data?.data.length && (
            <div className="text-center py-8 text-muted-foreground">
              No hay resultados.
            </div>
          )}
        </div>
      )}

      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.data.map((item) => (
            <LaborRegimeCard key={item.id} item={item} />
          ))}
          {!data?.data.length && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay resultados.
            </div>
          )}
        </div>
      )}

      <PaginationGroup total={data?.total || 0} pageSize={pageSize} />
    </div>
  )
}
