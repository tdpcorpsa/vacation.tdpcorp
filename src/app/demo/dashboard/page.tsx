'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  CalendarDays,
  Plane,
  ArrowUpDown,
  ExternalLink,
  User,
  Mail,
  Phone,
  Briefcase,
  UserCheck,
} from 'lucide-react'
import { mockPeriods, mockRequests, mockEmployeeSummary } from './mock-data'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  PaginationGroup,
  usePagination,
} from '@/components/ui/pagination-group'

export default function DemoDashboard() {
  const [selectedPeriodId, setSelectedPeriodId] = React.useState<string>('ALL')
  const [selectedRequest, setSelectedRequest] = React.useState<
    (typeof mockRequests)[0] | null
  >(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL')

  const { page } = usePagination({ queryKey: 'my-requests-page' })
  const pageSize = 10
  const currentPage = page ?? 1

  const currentPeriod =
    selectedPeriodId === 'ALL'
      ? null
      : mockPeriods.find((p) => p.id === selectedPeriodId) || mockPeriods[0]

  const aggregatedPeriod = React.useMemo(() => {
    if (!mockPeriods.length) return null

    const totalDays = mockPeriods.reduce((acc, p) => acc + p.total_days, 0)
    const availableDays = mockPeriods.reduce(
      (acc, p) => acc + p.available_days,
      0
    )
    const usedDays = totalDays - availableDays

    const startDates = mockPeriods.map((p) => new Date(p.start_date))
    const endDates = mockPeriods.map((p) => new Date(p.end_date))

    const startDate = new Date(
      Math.min.apply(
        null,
        startDates.map((d) => d.getTime())
      )
    )
    const endDate = new Date(
      Math.max.apply(
        null,
        endDates.map((d) => d.getTime())
      )
    )

    return {
      totalDays,
      availableDays,
      usedDays,
      startDate,
      endDate,
    }
  }, [])

  const periodRequests = mockRequests.filter(
    (r) =>
      selectedPeriodId === 'ALL' || r.vacation_period_id === selectedPeriodId
  )

  const filteredRequests = React.useMemo(
    () =>
      periodRequests.filter(
        (r) => statusFilter === 'ALL' || r.status === statusFilter
      ),
    [periodRequests, statusFilter]
  )

  const [sortConfig, setSortConfig] = React.useState<{
    key: 'start_date' | 'end_date' | 'decided_at' | 'updated_at'
    direction: 'asc' | 'desc'
  } | null>(null)

  const sortedRequests = React.useMemo(() => {
    const requests = [...filteredRequests]

    if (!requests.length) return requests

    if (!sortConfig) {
      return requests.sort((a, b) => {
        const aDate = new Date(a.submitted_at).getTime()
        const bDate = new Date(b.submitted_at).getTime()
        return bDate - aDate
      })
    }

    return requests.sort((a, b) => {
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
  }, [periodRequests, sortConfig])

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleViewRequest = (request: (typeof mockRequests)[0]) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'REJECTED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprobado'
      case 'REJECTED':
        return 'Rechazado'
      case 'PENDING':
        return 'Pendiente'
      default:
        return status
    }
  }

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

  const totalRequests = periodRequests.length
  const pendingRequests = periodRequests.filter((r) => r.status === 'PENDING')
  const approvedRequests = periodRequests.filter((r) => r.status === 'APPROVED')
  const rejectedRequests = periodRequests.filter((r) => r.status === 'REJECTED')

  const averageDays =
    totalRequests === 0
      ? 0
      : Math.round(
          periodRequests.reduce((acc, r) => acc + r.total_days, 0) /
            totalRequests
        )

  const lastPending = pendingRequests.length
    ? pendingRequests.reduce((latest, current) => {
        const latestDate = new Date(latest.submitted_at).getTime()
        const currentDate = new Date(current.submitted_at).getTime()
        return currentDate > latestDate ? current : latest
      })
    : null

  const today = new Date()

  const upcomingVacations = approvedRequests
    .filter((r) => new Date(r.start_date) >= today)
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    .slice(0, 5)

  const getDaysUntil = (date: string) => {
    const start = new Date(date)
    const diffMs = start.getTime() - today.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600 dark:text-green-400'
    if (percentage < 80) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const periodTotals = React.useMemo(() => {
    if (selectedPeriodId === 'ALL' && aggregatedPeriod) {
      const percentage =
        aggregatedPeriod.totalDays === 0
          ? 0
          : Math.round(
              (aggregatedPeriod.usedDays / aggregatedPeriod.totalDays) * 100
            )

      return {
        totalDays: aggregatedPeriod.totalDays,
        availableDays: aggregatedPeriod.availableDays,
        usedDays: aggregatedPeriod.usedDays,
        percentage,
        startDate: aggregatedPeriod.startDate,
        endDate: aggregatedPeriod.endDate,
        label: 'Todos',
      }
    }

    if (!currentPeriod) return null

    const usedDays = currentPeriod.total_days - currentPeriod.available_days

    const percentage =
      currentPeriod.total_days === 0
        ? 0
        : Math.round((usedDays / currentPeriod.total_days) * 100)

    return {
      totalDays: currentPeriod.total_days,
      availableDays: currentPeriod.available_days,
      usedDays,
      percentage,
      startDate: new Date(currentPeriod.start_date),
      endDate: new Date(currentPeriod.end_date),
      label: currentPeriod.period_label,
    }
  }, [aggregatedPeriod, currentPeriod, selectedPeriodId])

  return (
    <div className="max-w-[95%] mx-auto space-y-4 pb-10">
      <PageHeader
        title="Dashboard de Vacaciones"
        description="Resumen de tus vacaciones, solicitudes y días disponibles."
        withSidebar={false}
      />

      {/* Primera fila: Información del Empleado (izquierda), Periodo Vacacional (centro), Próximas Vacaciones (derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Información del Empleado */}
        <Card className="lg:col-span-3 h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Información del Empleado
            </CardTitle>
            <CardDescription>
              Resumen de datos personales y laborales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs flex-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-semibold text-sm">
                  {mockEmployeeSummary.profile.first_name}{' '}
                  {mockEmployeeSummary.profile.last_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {mockEmployeeSummary.roleDescription}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Email:{' '}
                  <span className="text-foreground">
                    {mockEmployeeSummary.profile.email}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Teléfono:{' '}
                  <span className="text-foreground">
                    {mockEmployeeSummary.profile.phone}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Fecha de ingreso:{' '}
                  <span className="text-foreground">
                    {new Date(
                      mockEmployeeSummary.employee.hire_date || ''
                    ).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Régimen laboral:{' '}
                  <span className="text-foreground font-medium">
                    {mockEmployeeSummary.laborRegime.name}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Jefe directo:{' '}
                  <span className="text-foreground">
                    {mockEmployeeSummary.managerProfile
                      ? `${mockEmployeeSummary.managerProfile.first_name} ${mockEmployeeSummary.managerProfile.last_name}`
                      : '-'}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Periodo Vacacional - centro (más ancho) */}
        <Card className="lg:col-span-6 h-full flex flex-col overflow-hidden border-t-4 border-t-primary">
          <CardHeader className="bg-muted/30 py-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl">Periodo Vacacional</CardTitle>
                <CardDescription>
                  Resumen de días disponibles y usados.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
                <CalendarDays className="ml-2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedPeriodId}
                  onValueChange={setSelectedPeriodId}
                >
                  <SelectTrigger className="w-[200px] border-0 shadow-none focus:ring-0 font-medium">
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los periodos</SelectItem>
                    {mockPeriods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {new Date(period.start_date).getFullYear()} -{' '}
                        {new Date(period.end_date).getFullYear()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 pt-1 flex-1">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-2 mb-1">
              <span>
                Desde:{' '}
                <span className="font-medium text-foreground">
                  {periodTotals
                    ? periodTotals.startDate.toLocaleDateString()
                    : '-'}
                </span>
              </span>
              <span className="hidden md:inline text-muted-foreground/30 mx-2">
                |
              </span>
              <span>
                Hasta:{' '}
                <span className="font-medium text-foreground">
                  {periodTotals
                    ? periodTotals.endDate.toLocaleDateString()
                    : '-'}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center items-center">
              <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-muted/20 border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Días Totales
                  </span>
                  <Calendar className="h-4 w-4 text-muted-foreground opacity-70" />
                </div>
                <span className="text-3xl font-bold">
                  {periodTotals?.totalDays ?? 0}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-green-50/50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Días Disponibles
                  </span>
                  <CheckCircle className="h-4 w-4 text-green-500 opacity-70" />
                </div>
                <span className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {periodTotals?.availableDays ?? 0}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Días Usados
                  </span>
                  <Clock className="h-4 w-4 text-blue-500 opacity-70" />
                </div>
                <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                  {periodTotals?.usedDays ?? 0}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 p-4 rounded-lg border bg-background shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <span className="text-sm font-medium text-muted-foreground">
                  Consumo
                </span>
                <span
                  className={cn(
                    'text-4xl font-extrabold',
                    periodTotals
                      ? getPercentageColor(periodTotals.percentage)
                      : 'text-muted-foreground'
                  )}
                >
                  {periodTotals ? `${periodTotals.percentage}%` : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximas Vacaciones */}
        <Card className="lg:col-span-3 h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Plane className="h-4 w-4 text-sky-500" />
              Próximas Vacaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {upcomingVacations.length > 0 ? (
                upcomingVacations.slice(0, 1).map((vacation) => (
                  <div
                    key={vacation.id}
                    className="flex flex-col gap-1 rounded-md border p-3 shadow-sm text-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group"
                    title="Ver detalle de vacación"
                  >
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1 bg-green-50 text-green-700 border-green-200"
                      >
                        Programado
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {vacation.total_days} días
                        </span>
                        <p className="font-medium text-xs mt-1">
                          {new Date(vacation.start_date).toLocaleDateString()} -{' '}
                          {new Date(vacation.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          En {getDaysUntil(vacation.start_date)} días empiezan
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  No hay próximas vacaciones.
                </p>
              )}
            </div>
            <div className="mt-4">
              <Button
                className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-all hover:scale-[1.02] shadow-sm"
                size="sm"
              >
                Solicita tus próximas vacaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila: Resumen de solicitudes + tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          {/* Compact KPIs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resumen de Solicitudes
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <button
                type="button"
                onClick={() =>
                  setStatusFilter((prev) =>
                    prev === 'PENDING' ? 'ALL' : 'PENDING'
                  )
                }
                className={cn(
                  'flex items-center justify-between p-2 rounded-md border bg-yellow-50/50 border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20 text-left w-full transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md',
                  statusFilter === 'PENDING' &&
                    'ring-2 ring-yellow-300 border-yellow-400'
                )}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    Pendientes
                  </span>
                </div>
                <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  {pendingRequests.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setStatusFilter((prev) =>
                    prev === 'APPROVED' ? 'ALL' : 'APPROVED'
                  )
                }
                className={cn(
                  'flex items-center justify-between p-2 rounded-md border bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20 text-left w-full transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md',
                  statusFilter === 'APPROVED' &&
                    'ring-2 ring-green-300 border-green-400'
                )}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Aprobadas
                  </span>
                </div>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                  {approvedRequests.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setStatusFilter((prev) =>
                    prev === 'REJECTED' ? 'ALL' : 'REJECTED'
                  )
                }
                className={cn(
                  'flex items-center justify-between p-2 rounded-md border bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20 text-left w-full transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md',
                  statusFilter === 'REJECTED' &&
                    'ring-2 ring-red-300 border-red-400'
                )}
              >
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    Rechazadas
                  </span>
                </div>
                <span className="text-lg font-bold text-red-700 dark:text-red-400">
                  {rejectedRequests.length}
                </span>
              </button>
              <div className="flex items-center justify-between p-2 rounded-md border bg-muted/40">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    Total solicitudes
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Promedio de días por solicitud: {averageDays}
                  </span>
                </div>
                <span className="text-lg font-bold">{totalRequests}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md border bg-muted/30 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md  ">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    Última solicitud pendiente
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {lastPending
                      ? new Date(lastPending.submitted_at).toLocaleDateString()
                      : 'Sin pendientes'}
                  </span>
                </div>
                {lastPending && (
                  <Badge variant="outline" className="text-[10px]">
                    Pendiente
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Requests Table (Expanded) */}
        <div className="lg:col-span-3">
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
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewRequest(request)}
                              title="Ver detalle"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Ir a solicitud"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
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
                  total={sortedRequests.length}
                  pageSize={pageSize}
                  queryKey="my-requests-page"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Request Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
            <DialogDescription>
              Información detallada de la solicitud de vacaciones.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Periodo
                </h4>
                <p className="text-sm font-medium">
                  {mockPeriods.find(
                    (p) => p.id === selectedRequest.vacation_period_id
                  )?.period_label || 'Sin etiqueta'}{' '}
                  (
                  {mockPeriods.find(
                    (p) => p.id === selectedRequest.vacation_period_id
                  )
                    ? `${new Date(
                        mockPeriods.find(
                          (p) => p.id === selectedRequest.vacation_period_id
                        )!.start_date
                      ).toLocaleDateString()} - ${new Date(
                        mockPeriods.find(
                          (p) => p.id === selectedRequest.vacation_period_id
                        )!.end_date
                      ).toLocaleDateString()}`
                    : '-'}
                  )
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Desde
                  </h4>
                  <p className="text-sm font-medium">
                    {new Date(selectedRequest.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Hasta
                  </h4>
                  <p className="text-sm font-medium">
                    {new Date(selectedRequest.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Días Solicitados
                  </h4>
                  <p className="text-sm font-medium">
                    {selectedRequest.total_days}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Estado
                  </h4>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'font-normal',
                      getStatusColor(selectedRequest.status)
                    )}
                  >
                    {getStatusLabel(selectedRequest.status)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Tiempo de decisión
                  </h4>
                  <p className="text-sm">
                    {selectedRequest.decided_at
                      ? `${Math.max(
                          0,
                          Math.round(
                            (new Date(selectedRequest.decided_at).getTime() -
                              new Date(
                                selectedRequest.submitted_at
                              ).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )} días`
                      : 'Aún sin decisión'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Fecha de creación
                  </h4>
                  <p className="text-sm">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Última actualización
                  </h4>
                  <p className="text-sm">
                    {new Date(selectedRequest.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedRequest.request_note && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Nota de Solicitud
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                    {selectedRequest.request_note}
                  </p>
                </div>
              )}
              {selectedRequest.response_note && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Nota de Respuesta
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                    {selectedRequest.response_note}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
