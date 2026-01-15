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
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertTriangle,
  History,
  UserCheck,
  Eye,
  TrendingUp,
} from 'lucide-react'
import {
  PaginationGroup,
  usePagination,
} from '@/components/ui/pagination-group'
import {
  mockHREmployees,
  mockHRRequests,
  mockHRPeriods,
  mockHRKPIs,
  mockRegimes,
  HREmployee,
  HRVacationRequest,
} from './mock-data'
import { cn } from '@/lib/utils'

export default function HRDashboard() {
  const [activeTab, setActiveTab] = React.useState<
    'requests' | 'employees' | 'balances' | 'planning' | 'audit'
  >('requests')

  // ------------------------------------------------------------------
  // REQUESTS VIEW STATE
  // ------------------------------------------------------------------
  const [requestSearch, setRequestSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL')
  const { page: requestPage } = usePagination({ queryKey: 'requestsPage' })
  const { page: employeesPage } = usePagination({ queryKey: 'employeesPage' })
  const { page: balancesPage } = usePagination({ queryKey: 'balancesPage' })
  const { page: auditPage } = usePagination({ queryKey: 'auditPage' })

  const REQUESTS_PER_PAGE = 10
  const EMPLOYEES_PER_PAGE = 10
  const BALANCES_PER_PAGE = 10
  const AUDIT_PER_PAGE = 10

  const filteredRequests = React.useMemo(() => {
    return mockHRRequests.filter((req) => {
      const matchesSearch =
        req.employee.profile.first_name
          ?.toLowerCase()
          .includes(requestSearch.toLowerCase()) ||
        req.employee.profile.last_name
          ?.toLowerCase()
          .includes(requestSearch.toLowerCase()) ||
        req.employee.profile.email
          ?.toLowerCase()
          .includes(requestSearch.toLowerCase())

      const matchesStatus =
        statusFilter === 'ALL' || req.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requestSearch, statusFilter])

  const paginatedRequests = filteredRequests.slice(
    (requestPage - 1) * REQUESTS_PER_PAGE,
    requestPage * REQUESTS_PER_PAGE
  )
  const totalRequestPages = Math.ceil(
    filteredRequests.length / REQUESTS_PER_PAGE
  )

  // ------------------------------------------------------------------
  // EMPLOYEES VIEW STATE
  // ------------------------------------------------------------------
  const [employeeSearch, setEmployeeSearch] = React.useState('')
  const [regimeFilter, setRegimeFilter] = React.useState<string>('ALL')

  const filteredEmployees = React.useMemo(() => {
    return mockHREmployees.filter((emp) => {
      const matchesSearch =
        emp.profile.first_name
          ?.toLowerCase()
          .includes(employeeSearch.toLowerCase()) ||
        emp.profile.last_name
          ?.toLowerCase()
          .includes(employeeSearch.toLowerCase())
      const matchesRegime =
        regimeFilter === 'ALL' || emp.labor_regime.id === regimeFilter
      return matchesSearch && matchesRegime
    })
  }, [employeeSearch, regimeFilter])

  const paginatedEmployees = filteredEmployees.slice(
    (employeesPage - 1) * EMPLOYEES_PER_PAGE,
    employeesPage * EMPLOYEES_PER_PAGE
  )

  // ------------------------------------------------------------------
  // BALANCES VIEW STATE
  // ------------------------------------------------------------------
  const paginatedPeriods = mockHRPeriods.slice(
    (balancesPage - 1) * BALANCES_PER_PAGE,
    balancesPage * BALANCES_PER_PAGE
  )

  // ------------------------------------------------------------------
  // AUDIT VIEW STATE
  // ------------------------------------------------------------------
  const sortedAuditRequests = React.useMemo(() => {
    return [...mockHRRequests].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }, [])

  const paginatedAuditRequests = sortedAuditRequests.slice(
    (auditPage - 1) * AUDIT_PER_PAGE,
    auditPage * AUDIT_PER_PAGE
  )

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'border-yellow-500 text-yellow-600 bg-yellow-50',
      APPROVED: 'border-green-500 text-green-600 bg-green-50',
      REJECTED: 'border-red-500 text-red-600 bg-red-50',
    }
    return colors[status] || 'border-gray-500 text-gray-600'
  }

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
    const activeRequest = mockHRRequests.find(
      (req) =>
        req.employee_id === employeeId &&
        req.status === 'APPROVED' &&
        new Date(req.start_date) <= now &&
        new Date(req.end_date) >= now
    )
    return activeRequest ? 'VACATION' : 'ACTIVE'
  }

  return (
    <div className="max-w-[98%] mx-auto space-y-6 pb-10">
      <PageHeader
        title="Dashboard de Recursos Humanos"
        description="Gestión integral de vacaciones, métricas y auditoría operativa."
        withSidebar={false}
      />

      {/* 1. PANEL DE MÉTRICAS GLOBALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch">
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockHRKPIs.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">Total registrados</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHRKPIs.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Histórico total</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockHRKPIs.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Tasa Aprob.</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                (mockHRKPIs.approvedRequests / mockHRKPIs.totalRequests) * 100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {mockHRKPIs.approvedRequests} aprobadas
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Tiempo Prom.</CardTitle>
            <History className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockHRKPIs.avgDecisionTimeHours}h
            </div>
            <p className="text-xs text-muted-foreground">SLA de decisión</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockHRKPIs.rejectedRequests}
            </div>
            <p className="text-xs text-muted-foreground">Total rechazadas</p>
          </CardContent>
        </Card>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        <Button
          variant={activeTab === 'requests' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('requests')}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Bandeja de Solicitudes
        </Button>
        <Button
          variant={activeTab === 'employees' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('employees')}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Empleados
        </Button>
        <Button
          variant={activeTab === 'balances' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('balances')}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Control de Saldos
        </Button>
        <Button
          variant={activeTab === 'planning' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('planning')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Planificación
        </Button>
        <Button
          variant={activeTab === 'audit' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('audit')}
          className="gap-2"
        >
          <History className="h-4 w-4" />
          Auditoría Operativa
        </Button>
      </div>

      {/* 2. BANDEJA RRHH (Requests) */}
      {activeTab === 'requests' && (
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {req.employee.profile.first_name}{' '}
                            {req.employee.profile.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {req.employee.profile.email}
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
                          {req.created_by_user?.id === req.employee.profile.id
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
                          {req.decided_by_user && (
                            <span className="text-[10px] text-muted-foreground">
                              Por: {req.decided_by_user.first_name} (
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
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center py-4">
              <PaginationGroup
                total={filteredRequests.length}
                pageSize={REQUESTS_PER_PAGE}
                queryKey="requestsPage"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. VISTA EMPLEADOS */}
      {activeTab === 'employees' && (
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
                <Select value={regimeFilter} onValueChange={setRegimeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar Régimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los regímenes</SelectItem>
                    {mockRegimes.map((r) => (
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
                    <TableHead className="text-right">Antigüedad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {emp.profile.first_name?.[0]}
                              {emp.profile.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {emp.profile.first_name} {emp.profile.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {emp.profile.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(emp.hire_date || '')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {emp.labor_regime.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getEmployeeStatus(emp.id) === 'VACATION' ? (
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
                        {emp.manager ? (
                          <div className="flex items-center gap-2 text-sm">
                            <UserCheck className="h-3 w-3 text-muted-foreground" />
                            {emp.manager.profile.first_name}{' '}
                            {emp.manager.profile.last_name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date().getFullYear() -
                          new Date(emp.hire_date || '').getFullYear()}{' '}
                        años
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center py-4">
              <PaginationGroup
                total={filteredEmployees.length}
                pageSize={EMPLOYEES_PER_PAGE}
                queryKey="employeesPage"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. CONTROL DE SALDOS */}
      {activeTab === 'balances' && (
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
                    {paginatedPeriods.map((period) => {
                      const percentage = Math.round(
                        ((period.total_days - period.available_days) /
                          period.total_days) *
                          100
                      )
                      return (
                        <TableRow key={period.id}>
                          <TableCell className="font-medium">
                            {period.employee.profile.first_name}{' '}
                            {period.employee.profile.last_name}
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
              {/* Pagination */}
              <div className="flex items-center justify-center py-4">
                <PaginationGroup
                  total={mockHRPeriods.length}
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
                {mockHRPeriods
                  .filter((p) => p.available_days > 20)
                  .slice(0, 5)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {p.employee.profile.first_name}{' '}
                          {p.employee.profile.last_name}
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

      {/* 5. PRÓXIMAS AUSENCIAS */}
      {activeTab === 'planning' && (
        <Card>
          <CardHeader>
            <CardTitle>Planificación de Ausencias</CardTitle>
            <CardDescription>
              Calendario de próximas vacaciones aprobadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockHRRequests
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
                        {new Date(req.start_date).toLocaleString('es-ES', {
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {req.employee.profile.first_name}{' '}
                        {req.employee.profile.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.total_days} días · Hasta {formatDate(req.end_date)}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        Reg. {req.employee.labor_regime.name}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {mockHRRequests.filter(
              (r) =>
                r.status === 'APPROVED' && new Date(r.start_date) > new Date()
            ).length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No hay vacaciones futuras programadas.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 6. AUDITORÍA OPERATIVA */}
      {activeTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimos cambios en solicitudes.</CardDescription>
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
                          {req.employee.profile.first_name}{' '}
                          {req.employee.profile.last_name}
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
              {/* Pagination */}
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
                {mockHRRequests
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
                            {req.employee.profile.first_name}{' '}
                            {req.employee.profile.last_name}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Creado por{' '}
                          {req.created_by_user?.id === req.employee.profile.id
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
    </div>
  )
}
