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
      <div className="flex items-center justify-between">
        <SearchInput />
      </div>

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

      <PaginationGroup total={data?.total || 0} pageSize={pageSize} />
    </div>
  )
}
