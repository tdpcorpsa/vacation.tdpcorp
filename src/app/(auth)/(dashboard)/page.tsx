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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useDashboardData } from '@/hooks/dashboard/use-dashboard-data'
import { useHrDashboardData } from '@/hooks/dashboard/use-hr-dashboard-data'
import { EmployeeInfoCard } from '@/components/dashboard/employee-info-card'
import {
  PeriodSummaryCard,
  PeriodTotals,
} from '@/components/dashboard/period-summary-card'
import { UpcomingVacationsCard } from '@/components/dashboard/upcoming-vacations-card'
import {
  RequestsSummaryCard,
  StatusFilter,
} from '@/components/dashboard/requests-summary-card'
import { RequestsList } from '@/components/dashboard/requests-list'
import { getStatusColor, getStatusLabel } from '@/components/dashboard/utils'
import {
  PaginationGroup,
  usePagination,
} from '@/components/ui/pagination-group'
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  Download,
  History,
  UserCheck,
  Eye,
  TrendingUp,
  Building2,
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'employee' | 'hr'>(
    'employee'
  )
  const [selectedPeriodId, setSelectedPeriodId] = React.useState<string>('ALL')
  const [selectedRequestId, setSelectedRequestId] = React.useState<
    string | null
  >(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [employeeStatusFilter, setEmployeeStatusFilter] =
    React.useState<StatusFilter>('ALL')

  const [hrActiveTab, setHrActiveTab] = React.useState<
    'requests' | 'employees' | 'balances' | 'planning' | 'audit'
  >('requests')

  const [requestSearch, setRequestSearch] = React.useState('')
  const [hrStatusFilter, setHrStatusFilter] = React.useState<string>('ALL')
  const [employeeSearch, setEmployeeSearch] = React.useState('')
  const [regimeFilter, setRegimeFilter] = React.useState<string>('ALL')

  const { page: requestPage } = usePagination({ queryKey: 'requestsPage' })
  const { page: employeesPage } = usePagination({ queryKey: 'employeesPage' })
  const { page: balancesPage } = usePagination({ queryKey: 'balancesPage' })
  const { page: auditPage } = usePagination({ queryKey: 'auditPage' })

  const REQUESTS_PER_PAGE = 10
  const EMPLOYEES_PER_PAGE = 10
  const BALANCES_PER_PAGE = 10
  const AUDIT_PER_PAGE = 10

  const { data, isLoading, isError } = useDashboardData()
  const {
    data: hrData,
    isLoading: isHrLoading,
    isError: isHrError,
  } = useHrDashboardData()

  const periods = data?.periods ?? []
  const requests = data?.requests ?? []
  const employeeSummary = data?.employeeSummary ?? null

  const currentPeriod =
    selectedPeriodId === 'ALL'
      ? null
      : periods.find((p) => p.id === selectedPeriodId) || periods[0]

  const aggregatedPeriod = React.useMemo(() => {
    if (!periods.length) return null

    const totalDays = periods.reduce((acc, p) => acc + p.total_days, 0)
    const availableDays = periods.reduce((acc, p) => acc + p.available_days, 0)
    const usedDays = totalDays - availableDays

    const startDates = periods.map((p) => new Date(p.start_date))
    const endDates = periods.map((p) => new Date(p.end_date))

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
  }, [periods])

  const periodRequests = requests.filter(
    (r) =>
      selectedPeriodId === 'ALL' || r.vacation_period_id === selectedPeriodId
  )

  const filteredRequests = React.useMemo(
    () =>
      periodRequests.filter(
        (r) =>
          employeeStatusFilter === 'ALL' || r.status === employeeStatusFilter
      ),
    [periodRequests, employeeStatusFilter]
  )

  const handleViewRequest = (id: string) => {
    setSelectedRequestId(id)
    setIsDialogOpen(true)
  }

  const selectedRequest = React.useMemo(
    () => requests.find((r) => r.id === selectedRequestId) || null,
    [requests, selectedRequestId]
  )

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

  const periodTotals: PeriodTotals | null = React.useMemo(() => {
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

  const hrEmployees = hrData?.employees ?? []
  const hrPeriods = hrData?.periods ?? []
  const hrRequests = hrData?.requests ?? []
  const hrProfilesById = hrData?.profilesById ?? {}
  const hrLaborRegimesById = hrData?.laborRegimesById ?? {}

  const hrLaborRegimes = React.useMemo(
    () => Object.values(hrLaborRegimesById),
    [hrLaborRegimesById]
  )

  const hrEmployeesById = React.useMemo(() => {
    const map: Record<string, (typeof hrEmployees)[number]> = {}
    for (const emp of hrEmployees) {
      map[emp.employee.id] = emp
    }
    return map
  }, [hrEmployees])

  const hrEnrichedRequests = React.useMemo(
    () =>
      hrRequests.map((req) => {
        const empWrapper = hrEmployeesById[req.employee_id]
        const employeeProfile = empWrapper?.profile ?? null
        const employeeLaborRegime = empWrapper?.laborRegime ?? null
        const createdByUser = req.created_by
          ? (hrProfilesById[req.created_by] ?? null)
          : null
        const decidedByUser = req.decided_by
          ? (hrProfilesById[req.decided_by] ?? null)
          : null

        return {
          ...req,
          employeeProfile,
          employeeLaborRegime,
          createdByUser,
          decidedByUser,
        }
      }),
    [hrRequests, hrEmployeesById, hrProfilesById]
  )

  const hrEnrichedPeriods = React.useMemo(
    () =>
      hrPeriods.map((period) => {
        const empWrapper = hrEmployeesById[period.employee_id]
        const employeeProfile = empWrapper?.profile ?? null
        const employeeLaborRegime = empWrapper?.laborRegime ?? null
        return {
          ...period,
          employeeProfile,
          employeeLaborRegime,
        }
      }),
    [hrPeriods, hrEmployeesById]
  )

  const hrTotalEmployees = hrEmployees.length
  const hrTotalRequests = hrRequests.length
  const hrPendingRequests = hrRequests.filter((r) => r.status === 'PENDING')
  const hrApprovedRequests = hrRequests.filter((r) => r.status === 'APPROVED')
  const hrRejectedRequests = hrRequests.filter((r) => r.status === 'REJECTED')

  const hrAvgDecisionTimeHours = React.useMemo(() => {
    const decided = hrRequests.filter((r) => r.decided_at && r.submitted_at)
    if (!decided.length) return 0
    const totalHours = decided.reduce((acc, r) => {
      const start = new Date(r.submitted_at).getTime()
      const end = new Date(r.decided_at!).getTime()
      return acc + (end - start) / (1000 * 60 * 60)
    }, 0)
    return Math.round(totalHours / decided.length)
  }, [hrRequests])

  const filteredHrRequests = React.useMemo(() => {
    const search = requestSearch.toLowerCase()
    return hrEnrichedRequests.filter((req) => {
      const profile = req.employeeProfile
      const matchesSearch =
        !search ||
        profile?.first_name?.toLowerCase().includes(search) ||
        profile?.last_name?.toLowerCase().includes(search) ||
        profile?.email?.toLowerCase().includes(search)

      const matchesStatus =
        hrStatusFilter === 'ALL' || req.status === hrStatusFilter

      return matchesSearch && matchesStatus
    })
  }, [hrEnrichedRequests, requestSearch, hrStatusFilter])

  const paginatedHrRequests = filteredHrRequests.slice(
    (requestPage - 1) * REQUESTS_PER_PAGE,
    requestPage * REQUESTS_PER_PAGE
  )

  const filteredHrEmployees = React.useMemo(() => {
    const search = employeeSearch.toLowerCase()
    return hrEmployees.filter((emp) => {
      const profile = emp.profile
      const matchesSearch =
        !search ||
        profile?.first_name?.toLowerCase().includes(search) ||
        profile?.last_name?.toLowerCase().includes(search)
      const matchesRegime =
        regimeFilter === 'ALL' || emp.laborRegime?.id === regimeFilter
      return matchesSearch && matchesRegime
    })
  }, [hrEmployees, employeeSearch, regimeFilter])

  const paginatedHrEmployees = filteredHrEmployees.slice(
    (employeesPage - 1) * EMPLOYEES_PER_PAGE,
    employeesPage * EMPLOYEES_PER_PAGE
  )

  const paginatedHrPeriods = hrEnrichedPeriods.slice(
    (balancesPage - 1) * BALANCES_PER_PAGE,
    balancesPage * BALANCES_PER_PAGE
  )

  const sortedAuditRequests = React.useMemo(
    () =>
      [...hrEnrichedRequests].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
    [hrEnrichedRequests]
  )

  const paginatedAuditRequests = sortedAuditRequests.slice(
    (auditPage - 1) * AUDIT_PER_PAGE,
    auditPage * AUDIT_PER_PAGE
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getEmployeeStatus = (employeeId: string) => {
    const now = new Date()
    const activeRequest = hrRequests.find(
      (req) =>
        req.employee_id === employeeId &&
        req.status === 'APPROVED' &&
        new Date(req.start_date) <= now &&
        new Date(req.end_date) >= now
    )
    return activeRequest ? 'VACATION' : 'ACTIVE'
  }

  return (
    <div className="max-w-[95%] mx-auto space-y-4 pb-10">
      <PageHeader
        title={
          activeTab === 'employee'
            ? 'Dashboard de Vacaciones'
            : 'Dashboard de Recursos Humanos'
        }
        description={
          activeTab === 'employee'
            ? 'Resumen de tus vacaciones, solicitudes y días disponibles.'
            : 'Gestión integral de vacaciones, métricas y auditoría operativa.'
        }
      />

      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        <Button
          variant={activeTab === 'employee' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('employee')}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Dashboard Empleado
        </Button>
        <Button
          variant={activeTab === 'hr' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('hr')}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Dashboard RRHH
        </Button>
      </div>

      {activeTab === 'employee' && (
        <>
          {isLoading && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cargando información de tus vacaciones</CardTitle>
                  <CardDescription>
                    Obteniendo tu información desde el servidor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
                </CardContent>
              </Card>
            </div>
          )}

          {(isError || !data) && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>No se pudo cargar la información</CardTitle>
                <CardDescription>
                  Ocurrió un problema al cargar tus datos de vacaciones.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isLoading && !isError && data && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <EmployeeInfoCard employeeSummary={employeeSummary} />
                <PeriodSummaryCard
                  selectedPeriodId={selectedPeriodId}
                  setSelectedPeriodId={setSelectedPeriodId}
                  periods={periods}
                  periodTotals={periodTotals}
                />
                <UpcomingVacationsCard upcomingVacations={upcomingVacations} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <RequestsSummaryCard
                  statusFilter={employeeStatusFilter}
                  setStatusFilter={setEmployeeStatusFilter}
                  pendingCount={pendingRequests.length}
                  approvedCount={approvedRequests.length}
                  rejectedCount={rejectedRequests.length}
                  totalRequests={totalRequests}
                  averageDays={averageDays}
                  lastPending={lastPending}
                />

                <div className="lg:col-span-3">
                  <RequestsList
                    requests={filteredRequests}
                    onViewRequest={handleViewRequest}
                  />
                </div>
              </div>

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
                          {periods.find(
                            (p) => p.id === selectedRequest.vacation_period_id
                          )?.period_label || 'Sin etiqueta'}{' '}
                          (
                          {periods.find(
                            (p) => p.id === selectedRequest.vacation_period_id
                          )
                            ? `${new Date(
                                periods.find(
                                  (p) =>
                                    p.id === selectedRequest.vacation_period_id
                                )!.start_date
                              ).toLocaleDateString()} - ${new Date(
                                periods.find(
                                  (p) =>
                                    p.id === selectedRequest.vacation_period_id
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
                            {new Date(
                              selectedRequest.start_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Hasta
                          </h4>
                          <p className="text-sm font-medium">
                            {new Date(
                              selectedRequest.end_date
                            ).toLocaleDateString()}
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
                                    (new Date(
                                      selectedRequest.decided_at
                                    ).getTime() -
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
                            {new Date(
                              selectedRequest.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Última actualización
                          </h4>
                          <p className="text-sm">
                            {new Date(
                              selectedRequest.updated_at
                            ).toLocaleString()}
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
            </>
          )}
        </>
      )}

      {activeTab === 'hr' && (
        <>
          {isHrLoading && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cargando información de RRHH</CardTitle>
                  <CardDescription>
                    Obteniendo datos globales de vacaciones.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
                </CardContent>
              </Card>
            </div>
          )}

          {(isHrError || !hrData) && !isHrLoading && (
            <Card>
              <CardHeader>
                <CardTitle>No se pudo cargar la información</CardTitle>
                <CardDescription>
                  Ocurrió un problema al cargar los datos de RRHH.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isHrLoading && !isHrError && hrData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch">
                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Empleados
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hrTotalEmployees}</div>
                    <p className="text-xs text-muted-foreground">
                      Total registrados
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Solicitudes
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hrTotalRequests}</div>
                    <p className="text-xs text-muted-foreground">
                      Histórico total
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Pendientes
                    </CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {hrPendingRequests.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requieren atención
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Tasa Aprob.
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {hrTotalRequests
                        ? Math.round(
                            (hrApprovedRequests.length / hrTotalRequests) * 100
                          )
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {hrApprovedRequests.length} aprobadas
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Tiempo Prom.
                    </CardTitle>
                    <History className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {hrAvgDecisionTimeHours}h
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SLA de decisión
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Rechazadas
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {hrRejectedRequests.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total rechazadas
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b pb-2">
                <Button
                  variant={hrActiveTab === 'requests' ? 'default' : 'ghost'}
                  onClick={() => setHrActiveTab('requests')}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Bandeja de Solicitudes
                </Button>
                <Button
                  variant={hrActiveTab === 'employees' ? 'default' : 'ghost'}
                  onClick={() => setHrActiveTab('employees')}
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Empleados
                </Button>
                <Button
                  variant={hrActiveTab === 'balances' ? 'default' : 'ghost'}
                  onClick={() => setHrActiveTab('balances')}
                  className="gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Control de Saldos
                </Button>
                <Button
                  variant={hrActiveTab === 'planning' ? 'default' : 'ghost'}
                  onClick={() => setHrActiveTab('planning')}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Planificación
                </Button>
                <Button
                  variant={hrActiveTab === 'audit' ? 'default' : 'ghost'}
                  onClick={() => setHrActiveTab('audit')}
                  className="gap-2"
                >
                  <History className="h-4 w-4" />
                  Auditoría Operativa
                </Button>
              </div>

              {hrActiveTab === 'requests' && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
                      <div>
                        <CardTitle>Bandeja de Solicitudes</CardTitle>
                        <CardDescription>
                          Gestión operativa de todas las solicitudes
                          registradas.
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
                        <Select
                          value={hrStatusFilter}
                          onValueChange={setHrStatusFilter}
                        >
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
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
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
                            <TableHead className="text-right">
                              Acciones
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedHrRequests.map((req) => (
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
                                  req.createdByUser.id ===
                                    req.employeeProfile.id
                                    ? 'Empleado'
                                    : 'RRHH/Admin'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'w-fit',
                                      getStatusColor(req.status)
                                    )}
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
                                      <span className="font-semibold">
                                        Req:
                                      </span>{' '}
                                      {req.request_note}
                                    </p>
                                  )}
                                  {req.response_note && (
                                    <p
                                      className="text-xs truncate text-muted-foreground"
                                      title={req.response_note}
                                    >
                                      <span className="font-semibold">
                                        Resp:
                                      </span>{' '}
                                      {req.response_note}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex items-center justify-center py-4">
                      <PaginationGroup
                        total={filteredHrRequests.length}
                        pageSize={REQUESTS_PER_PAGE}
                        queryKey="requestsPage"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {hrActiveTab === 'employees' && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Directorio de Empleados</CardTitle>
                        <CardDescription>
                          Información contractual y jerárquica del personal.
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar empleado..."
                            className="pl-8"
                            value={employeeSearch}
                            onChange={(e) => setEmployeeSearch(e.target.value)}
                          />
                        </div>
                        <Select
                          value={regimeFilter}
                          onValueChange={setRegimeFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar Régimen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">
                              Todos los regímenes
                            </SelectItem>
                            {hrLaborRegimes.map((r) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Empleado</TableHead>
                            <TableHead>Fecha Ingreso</TableHead>
                            <TableHead>Régimen Laboral</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Jefe Directo</TableHead>
                            <TableHead className="text-right">
                              Antigüedad
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedHrEmployees.map((emp) => (
                            <TableRow key={emp.employee.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {emp.profile?.first_name?.[0]}
                                      {emp.profile?.last_name?.[0]}
                                    </AvatarFallback>
                                    {emp.profile?.avatar_url && (
                                      <AvatarImage
                                        src={emp.profile.avatar_url}
                                        alt={`${emp.profile.first_name} ${emp.profile.last_name}`}
                                      />
                                    )}
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {emp.profile?.first_name}{' '}
                                      {emp.profile?.last_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {emp.profile?.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDate(emp.employee.hire_date || '')}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {emp.laborRegime?.name}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {getEmployeeStatus(emp.employee.id) ===
                                'VACATION' ? (
                                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                    De Vacaciones
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-200 bg-green-50"
                                  >
                                    Activo
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {emp.managerProfile ? (
                                  <div className="flex items-center gap-2 text-sm">
                                    <UserCheck className="h-3 w-3 text-muted-foreground" />
                                    {emp.managerProfile.first_name}{' '}
                                    {emp.managerProfile.last_name}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-xs">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {new Date().getFullYear() -
                                  new Date(
                                    emp.employee.hire_date || ''
                                  ).getFullYear()}{' '}
                                años
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex items-center justify-center py-4">
                      <PaginationGroup
                        total={filteredHrEmployees.length}
                        pageSize={EMPLOYEES_PER_PAGE}
                        queryKey="employeesPage"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {hrActiveTab === 'balances' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Periodos Vacacionales</CardTitle>
                      <CardDescription>
                        Detalle de saldos por periodo y empleado.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Empleado</TableHead>
                              <TableHead>Periodo</TableHead>
                              <TableHead>Total Días</TableHead>
                              <TableHead>Disponible</TableHead>
                              <TableHead>Consumo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedHrPeriods.map((period) => {
                              const percentage = Math.round(
                                ((period.total_days - period.available_days) /
                                  period.total_days) *
                                  100
                              )
                              return (
                                <TableRow key={period.id}>
                                  <TableCell className="font-medium">
                                    {period.employeeProfile?.first_name}{' '}
                                    {period.employeeProfile?.last_name}
                                  </TableCell>
                                  <TableCell>{period.period_label}</TableCell>
                                  <TableCell>{period.total_days}</TableCell>
                                  <TableCell className="font-bold text-green-600">
                                    {period.available_days}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-20 bg-secondary rounded-full overflow-hidden">
                                        <div
                                          className={cn(
                                            'h-full',
                                            percentage > 80
                                              ? 'bg-red-500'
                                              : percentage > 50
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                          )}
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {percentage}%
                                      </span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex items-center justify-center py-4">
                        <PaginationGroup
                          total={hrEnrichedPeriods.length}
                          pageSize={BALANCES_PER_PAGE}
                          queryKey="balancesPage"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Alertas de Saldos</CardTitle>
                      <CardDescription>
                        Empleados con acumulación excesiva.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hrEnrichedPeriods
                          .filter((p) => p.available_days > 20)
                          .slice(0, 5)
                          .map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between border-b pb-2 last:border-0"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {p.employeeProfile?.first_name}{' '}
                                  {p.employeeProfile?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {p.period_label}
                                </p>
                              </div>
                              <Badge variant="destructive">
                                {p.available_days} días
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {hrActiveTab === 'planning' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Planificación de Ausencias</CardTitle>
                    <CardDescription>
                      Calendario de próximas vacaciones aprobadas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {hrEnrichedRequests
                        .filter(
                          (r) =>
                            r.status === 'APPROVED' &&
                            new Date(r.start_date) > new Date()
                        )
                        .slice(0, 9)
                        .map((req) => (
                          <div
                            key={req.id}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center h-12 w-12 rounded bg-primary/10 text-primary font-bold text-xs">
                              <span>{new Date(req.start_date).getDate()}</span>
                              <span className="uppercase text-[10px]">
                                {new Date(req.start_date).toLocaleString(
                                  'es-ES',
                                  {
                                    month: 'short',
                                  }
                                )}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-sm">
                                {req.employeeProfile?.first_name}{' '}
                                {req.employeeProfile?.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {req.total_days} días · Hasta{' '}
                                {formatDate(req.end_date)}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                Reg. {req.employeeLaborRegime?.name}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {hrEnrichedRequests.filter(
                      (r) =>
                        r.status === 'APPROVED' &&
                        new Date(r.start_date) > new Date()
                    ).length === 0 && (
                      <div className="text-center py-10 text-muted-foreground">
                        No hay vacaciones futuras programadas.
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {hrActiveTab === 'audit' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actividad Reciente</CardTitle>
                      <CardDescription>
                        Últimos cambios en solicitudes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {paginatedAuditRequests.map((req) => (
                          <div
                            key={req.id}
                            className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0"
                          >
                            <div className="mt-1">
                              {req.status === 'APPROVED' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : req.status === 'REJECTED' ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm">
                                Solicitud de{' '}
                                <span className="font-medium">
                                  {req.employeeProfile?.first_name}{' '}
                                  {req.employeeProfile?.last_name}
                                </span>{' '}
                                actualizada a{' '}
                                <span className="font-medium">
                                  {getStatusLabel(req.status)}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(req.updated_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center py-4">
                        <PaginationGroup
                          total={sortedAuditRequests.length}
                          pageSize={AUDIT_PER_PAGE}
                          queryKey="auditPage"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Nuevas Solicitudes</CardTitle>
                      <CardDescription>
                        Creadas recientemente (Volumen).
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hrEnrichedRequests
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                          )
                          .slice(0, 10)
                          .map((req) => (
                            <div
                              key={req.id}
                              className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0"
                            >
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <FileText className="h-3 w-3 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm">
                                  Nueva solicitud de{' '}
                                  <span className="font-medium">
                                    {req.employeeProfile?.first_name}{' '}
                                    {req.employeeProfile?.last_name}
                                  </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Creado por{' '}
                                  {req.createdByUser &&
                                  req.employeeProfile &&
                                  req.createdByUser.id ===
                                    req.employeeProfile.id
                                    ? 'el empleado'
                                    : 'RRHH'}{' '}
                                  · {formatDateTime(req.created_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
