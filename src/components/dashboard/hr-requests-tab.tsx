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
import { Search, Filter, Download, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusColor, getStatusLabel } from './utils'
import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'
import { RequestActions } from './request-actions'
import { DateRange } from 'react-day-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface HrRequestsTabProps {
  requestSearch: string
  setRequestSearch: (value: string) => void
  hrStatusFilter: string
  setHrStatusFilter: (value: string) => void
  dateRangeFilter: DateRange | undefined
  setDateRangeFilter: (range: DateRange | undefined) => void
  paginatedRequests: EnrichedVacationRequest[]
  totalFilteredRequests: number
  requestsPerPage: number
  onViewRequest: (id: string) => void
  currentPage?: number
}

export function HrRequestsTab({
  requestSearch,
  setRequestSearch,
  hrStatusFilter,
  setHrStatusFilter,
  dateRangeFilter,
  setDateRangeFilter,
  paginatedRequests,
  totalFilteredRequests,
  requestsPerPage,
  onViewRequest,
  currentPage = 1,
}: HrRequestsTabProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    // Ajustar zona horaria local
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr // Retornar valor original si no cumple formato

    const [y, m, d] = parts.map(Number)
    if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr

    try {
      return format(new Date(y, m - 1, d), 'dd MMM yyyy', { locale: es })
    } catch (e) {
      return dateStr
    }
  }

  const handleClearFilters = () => {
    setRequestSearch('')
    setHrStatusFilter('ALL')
    setDateRangeFilter(undefined)
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
          <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleado..."
                className="pl-8"
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !dateRangeFilter && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeFilter?.from ? (
                    dateRangeFilter.to ? (
                      <>
                        {format(dateRangeFilter.from, 'dd/MM/yy', {
                          locale: es,
                        })}{' '}
                        -{' '}
                        {format(dateRangeFilter.to, 'dd/MM/yy', { locale: es })}
                      </>
                    ) : (
                      format(dateRangeFilter.from, 'dd/MM/yy', { locale: es })
                    )
                  ) : (
                    <span>Filtrar por fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRangeFilter?.from}
                  selected={dateRangeFilter}
                  onSelect={setDateRangeFilter}
                  numberOfMonths={2}
                  captionLayout="dropdown"
                  fromYear={2020}
                  toYear={new Date().getFullYear() + 2}
                />
              </PopoverContent>
            </Popover>
            <Select value={hrStatusFilter} onValueChange={setHrStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Estado" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="approved">Aprobadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            {(requestSearch || hrStatusFilter !== 'ALL' || dateRangeFilter) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFilters}
                title="Limpiar filtros"
              >
                <div className="relative">
                  <Filter className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                  </span>
                </div>
              </Button>
            )}
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
      </CardContent>
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
            {totalFilteredRequests > 0 ? (
               `Mostrando ${((currentPage - 1) * requestsPerPage) + 1} a ${Math.min(currentPage * requestsPerPage, totalFilteredRequests)} de ${totalFilteredRequests} solicitudes`
            ) : (
                'No se encontraron solicitudes'
            )}
        </div>
        <PaginationGroup
          total={totalFilteredRequests}
          pageSize={requestsPerPage}
          queryKey="requestsPage"
        />
      </div>
    </Card>
  )
}
