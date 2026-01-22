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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PaginationGroup } from '@/components/ui/pagination-group'
import { Search, Filter, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusColor, getStatusLabel } from './utils'
import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'
import { RequestActions } from './request-actions'

interface HrRequestsTabProps {
  requestSearch: string
  setRequestSearch: (value: string) => void
  hrStatusFilter: string
  setHrStatusFilter: (value: string) => void
  paginatedRequests: EnrichedVacationRequest[]
  totalFilteredRequests: number
  requestsPerPage: number
  onViewRequest: (id: string) => void
}

export function HrRequestsTab({
  requestSearch,
  setRequestSearch,
  hrStatusFilter,
  setHrStatusFilter,
  paginatedRequests,
  totalFilteredRequests,
  requestsPerPage,
  onViewRequest,
}: HrRequestsTabProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
          <div>
            <CardTitle>Bandeja de Solicitudes</CardTitle>
            <CardDescription>
              Gestión operativa de todas las solicitudes registradas.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleado..."
                className="pl-8"
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
              />
            </div>
            <Select value={hrStatusFilter} onValueChange={setHrStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Estado" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PENDING">Pendientes</SelectItem>
                <SelectItem value="APPROVED">Aprobadas</SelectItem>
                <SelectItem value="REJECTED">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead>Estado / Decisión</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {req.employeeProfile?.first_name}{' '}
                        {req.employeeProfile?.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {req.employeeProfile?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">
                        {formatDate(req.start_date)} -{' '}
                        {formatDate(req.end_date)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {req.total_days} días · Enviado:{' '}
                        {formatDate(req.submitted_at)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {req.createdByUser &&
                      req.employeeProfile &&
                      req.createdByUser.id === req.employeeProfile.id
                        ? 'Empleado'
                        : 'RRHH/Admin'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="outline"
                        className={cn('w-fit', getStatusColor(req.status))}
                      >
                        {getStatusLabel(req.status)}
                      </Badge>
                      {req.decidedByUser && (
                        <span className="text-[10px] text-muted-foreground">
                          Por: {req.decidedByUser.first_name} (
                          {formatDate(req.decided_at || '')})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-col gap-1">
                      {req.request_note && (
                        <p
                          className="text-xs truncate"
                          title={req.request_note}
                        >
                          <span className="font-semibold">Req:</span>{' '}
                          {req.request_note}
                        </p>
                      )}
                      {req.response_note && (
                        <p
                          className="text-xs truncate text-muted-foreground"
                          title={req.response_note}
                        >
                          <span className="font-semibold">Resp:</span>{' '}
                          {req.response_note}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RequestActions onView={() => onViewRequest(req.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center py-4">
          <PaginationGroup
            total={totalFilteredRequests}
            pageSize={requestsPerPage}
            queryKey="requestsPage"
          />
        </div>
      </CardContent>
    </Card>
  )
}
