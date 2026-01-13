'use client'

import { RequestsActions } from './requests-actions'
import { RequestsCreate } from './requests-create'
import { useRequestsList } from '@/hooks/requests/use-requests-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { LayoutGrid, List, Plus, Table as TableIcon } from 'lucide-react'
import { useState } from 'react'

export function RequestsList() {
  const { page, pageSize } = usePagination()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table' | 'list' | 'card'>('table')

  const { data, isLoading } = useRequestsList({
    pagination: { page, pageSize },
    search,
  })

  const columns: ColumnDef<Tables<{ schema: 'vacation' }, 'vacation_requests'>>[] = [
    {
      accessorKey: 'start_date',
      header: 'Fecha Inicio',
      cell: ({ row }) => (
        <span>{new Date(row.original.start_date).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: 'end_date',
      header: 'Fecha Fin',
      cell: ({ row }) => (
        <span>{new Date(row.original.end_date).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: 'total_days',
      header: 'Días',
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            row.original.status === 'APPROVED'
              ? 'bg-green-100 text-green-800'
              : row.original.status === 'REJECTED'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'request_note',
      header: 'Nota',
    },
    {
      id: 'actions',
      cell: ({ row }) => <RequestsActions request={row.original} />,
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
              {data?.data.map((request) => (
                <Item key={request.id} className="flex items-center justify-between p-4 border rounded-md">
                   <div className="flex flex-col">
                      <span className="font-medium">Solicitud de {request.total_days} días</span>
                      <span className="text-sm text-muted-foreground">{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            request.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {request.status}
                        </span>
                      <RequestsActions request={request} />
                   </div>
                </Item>
              ))}
              {data?.data.length === 0 && <div className="text-center py-8 text-muted-foreground">No hay resultados.</div>}
            </div>
          )}

          {view === 'card' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.data.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Solicitud
                    </CardTitle>
                    <RequestsActions request={request} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{request.total_days} días</div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            request.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {request.status}
                        </span>
                    </div>
                    {request.request_note && <p className="mt-2 text-sm text-muted-foreground">{request.request_note}</p>}
                  </CardContent>
                </Card>
              ))}
               {data?.data.length === 0 && <div className="col-span-full text-center py-8 text-muted-foreground">No hay resultados.</div>}
            </div>
          )}
        </>
      )}

      <PaginationGroup
        total={data?.total || 0}
        pageSize={pageSize}
      />
    </div>
  )
}
