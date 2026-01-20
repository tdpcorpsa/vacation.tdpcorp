'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, ExternalLink, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PaginationGroup,
  usePagination,
} from '@/components/ui/pagination-group'
import { VacationRequest } from '@/hooks/dashboard/use-dashboard-data'
import { getStatusColor, getStatusLabel } from './utils'
import { RequestActions } from './request-actions'

interface RequestsListProps {
  requests: VacationRequest[]
  onViewRequest: (id: string) => void
  pageSize?: number
}

export function RequestsList({
  requests,
  onViewRequest,
  pageSize = 10,
}: RequestsListProps) {
  const { page } = usePagination({ queryKey: 'my-requests-page' })
  const currentPage = page ?? 1

  const [sortConfig, setSortConfig] = React.useState<{
    key: 'start_date' | 'end_date' | 'decided_at' | 'updated_at'
    direction: 'asc' | 'desc'
  } | null>(null)

  const handleSort = (
    key: 'start_date' | 'end_date' | 'decided_at' | 'updated_at'
  ) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' }
      }

      return {
        key,
        direction: prev.direction === 'asc' ? 'desc' : 'asc',
      }
    })
  }

  const sortedRequests = React.useMemo(() => {
    const requestsToSort = [...requests]

    if (!requestsToSort.length) return requestsToSort

    if (!sortConfig) {
      return requestsToSort.sort((a, b) => {
        const aDate = new Date(a.submitted_at).getTime()
        const bDate = new Date(b.submitted_at).getTime()
        return bDate - aDate
      })
    }

    return requestsToSort.sort((a, b) => {
      const key = sortConfig.key
      const aValue = a[key]
      const bValue = b[key]

      const aTime = aValue ? new Date(aValue).getTime() : 0
      const bTime = bValue ? new Date(bValue).getTime() : 0

      if (sortConfig.direction === 'asc') {
        return aTime - bTime
      }
      return bTime - aTime
    })
  }, [requests, sortConfig])

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <Card className="h-[420px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Mis Solicitudes
          </CardTitle>
          <CardDescription>
            Historial de solicitudes del periodo seleccionado.
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary transition-transform duration-200 hover:translate-x-1"
        >
          Ver todo <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('start_date')}
              >
                <span className="inline-flex items-center gap-1">
                  Fecha Inicio
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('end_date')}
              >
                <span className="inline-flex items-center gap-1">
                  Fecha Fin
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </span>
              </TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('decided_at')}
              >
                <span className="inline-flex items-center gap-1">
                  Fecha decisión
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('updated_at')}
              >
                <span className="inline-flex items-center gap-1">
                  Última actualización
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </span>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {new Date(request.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(request.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.total_days}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'font-normal',
                        getStatusColor(request.status)
                      )}
                    >
                      {getStatusLabel(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.decided_at
                      ? new Date(request.decided_at).toLocaleDateString()
                      : 'Pendiente'}
                  </TableCell>
                  <TableCell>
                    {new Date(request.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <RequestActions onView={() => onViewRequest(request.id)} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-24 text-muted-foreground"
                >
                  No hay solicitudes para este periodo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <div className="border-t px-4 py-3">
        <div className="flex justify-center">
          <PaginationGroup
            total={requests.length}
            pageSize={pageSize}
            queryKey="my-requests-page"
          />
        </div>
      </div>
    </Card>
  )
}
