'use client'

import { VacationRequestsActions } from './vacation-requests-actions'
import {
  useVacationRequestsList,
  VacationRequestWithProfiles,
} from '@/hooks/vacation-requests/use-vacation-requests-list'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusColor, getStatusLabel } from './utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { LayoutGrid, List, Table as TableIcon } from 'lucide-react'
import { useState } from 'react'
import { RequestDetailDialog } from '@/components/dashboard/request-detail-dialog'
import { useVacationPeriodsList } from '@/hooks/vacation-periods/use-vacation-periods-list'

export function VacationRequestsList() {
  const { page, pageSize } = usePagination()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table' | 'list' | 'card'>('table')
  const [viewRequest, setViewRequest] = useState<
    VacationRequestWithProfiles | undefined
  >(undefined)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const { data, isLoading } = useVacationRequestsList({
    pagination: { page, pageSize },
    search,
  })

  // Obtener periodos para el detalle
  const { data: periods } = useVacationPeriodsList({
    employeeId: viewRequest?.employee_id,
  })

  const columns: ColumnDef<VacationRequestWithProfiles>[] = [
    {
      id: 'employee',
      header: 'Empleado',
      cell: ({ row }) => {
        const profile = row.original.employee_profile
        return profile ? (
          <span>
            {profile.first_name} {profile.last_name}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
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
      accessorKey: 'request_note',
      header: 'Nota Solicitud',
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <span className="truncate max-w-[150px] block cursor-pointer hover:underline">
              {row.original.request_note || '-'}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Nota de Solicitud</h4>
              <p className="text-sm text-muted-foreground">
                {row.original.request_note || 'Sin nota'}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={cn('font-normal', getStatusColor(row.original.status))}
        >
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: 'approver',
      header: 'Decidido Por',
      cell: ({ row }) => {
        const profile = row.original.approver_profile
        return profile ? (
          <div className="flex flex-col text-sm">
            <span>
              {profile.first_name} {profile.last_name}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'decided_at',
      header: 'Fecha Aprob.',
      cell: ({ row }) =>
        row.original.decided_at ? (
          <span>{new Date(row.original.decided_at).toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      accessorKey: 'response_note',
      header: 'Nota Aprob.',
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <span
              className="truncate max-w-[150px] block cursor-pointer hover:underline"
            >
              {row.original.response_note || '-'}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Nota de Aprobación</h4>
              <p className="text-sm text-muted-foreground">
                {row.original.response_note || 'Sin nota'}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <VacationRequestsActions
            request={row.original}
            onViewDetail={() => {
              setViewRequest(row.original)
              setIsViewOpen(true)
            }}
          />
        </div>
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
            <div className="space-y-4">
              {data?.data.map((request) => (
                <Item
                  key={request.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setViewRequest(request)
                    setIsViewOpen(true)
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">
                      {request.employee_profile
                        ? `${request.employee_profile.first_name} ${request.employee_profile.last_name}`
                        : 'Empleado desconocido'}{' '}
                      - {request.total_days} días
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(request.start_date).toLocaleDateString()} -{' '}
                      {new Date(request.end_date).toLocaleDateString()}
                    </span>
                    {request.approver_profile && (
                      <span className="text-xs text-muted-foreground">
                        Aprobado por: {request.approver_profile.first_name}{' '}
                        {request.approver_profile.last_name}
                      </span>
                    )}
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
                    <div onClick={(e) => e.stopPropagation()}>
                      <VacationRequestsActions
                        request={request}
                        onViewDetail={() => {
                          setViewRequest(request)
                          setIsViewOpen(true)
                        }}
                      />
                    </div>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.data.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {request.employee_profile
                        ? `${request.employee_profile.first_name} ${request.employee_profile.last_name}`
                        : 'Empleado'}
                    </CardTitle>
                    <VacationRequestsActions
                      request={request}
                      onViewDetail={() => {
                        setViewRequest(request)
                        setIsViewOpen(true)
                      }}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {request.total_days} días
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.start_date).toLocaleDateString()} -{' '}
                      {new Date(request.end_date).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'font-normal',
                          getStatusColor(request.status)
                        )}
                      >
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                    {request.approver_profile && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Aprobado por: {request.approver_profile.first_name}{' '}
                        {request.approver_profile.last_name}
                      </p>
                    )}
                    {request.response_note && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Nota: {request.response_note}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {data?.data.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No hay resultados.
                </div>
              )}
            </div>
          )}

          <RequestDetailDialog
            open={isViewOpen}
            onOpenChange={setIsViewOpen}
            request={viewRequest || null}
            periods={periods?.data || []}
          />
        </>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {data?.data.length ? (page - 1) * pageSize + 1 : 0} a{' '}
          {Math.min(page * pageSize, data?.total || 0)} de {data?.total || 0}{' '}
          solicitudes
        </div>
        <PaginationGroup total={data?.total || 0} pageSize={pageSize} />
      </div>
    </div>
  )
}
