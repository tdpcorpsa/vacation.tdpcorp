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
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  ChevronRight,
  CalendarDays,
  Plane,
  Users,
  UserCheck,
} from 'lucide-react'
import {
  mockPeriods,
  mockRequests,
  mockNextVacations,
  mockKPIs,
  mockTeamRequests,
  mockTeamAbsences,
  TeamVacationRequest,
} from './mock-data'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ManagerDashboard() {
  const [selectedPeriodId, setSelectedPeriodId] = React.useState(
    mockPeriods[0].id
  )
  const [selectedRequest, setSelectedRequest] = React.useState<
    (typeof mockRequests)[0] | null
  >(null)
  const [selectedTeamRequest, setSelectedTeamRequest] =
    React.useState<TeamVacationRequest | null>(null)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isTeamDialogOpen, setIsTeamDialogOpen] = React.useState(false)
  const [showAllRequests, setShowAllRequests] = React.useState(false)

  const currentPeriod =
    mockPeriods.find((p) => p.id === selectedPeriodId) || mockPeriods[0]

  const periodRequests = mockRequests.filter(
    (r) => r.vacation_period_id === selectedPeriodId
  )

  const displayedRequests = showAllRequests
    ? periodRequests
    : periodRequests.slice(0, 10)

  const handleViewRequest = (request: (typeof mockRequests)[0]) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const handleViewTeamRequest = (request: TeamVacationRequest) => {
    setSelectedTeamRequest(request)
    setIsTeamDialogOpen(true)
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

  return (
    <div className="max-w-[95%] mx-auto space-y-6 pb-10">
      <PageHeader
        title="Dashboard de Jefe Directo"
        description="Gestiona tu equipo y tus vacaciones."
        withSidebar={false}
      />

      {/* 1. Period Selection & Stats (Reordered to top) */}
      <Card className="overflow-hidden border-t-4 border-t-primary">
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
                <SelectTrigger className="w-[180px] border-0 shadow-none focus:ring-0 font-medium">
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
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
        <CardContent className="grid gap-4 p-4 pt-1">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-2 mb-1">
            <span>
              Desde:{' '}
              <span className="font-medium text-foreground">
                {new Date(currentPeriod.start_date).toLocaleDateString()}
              </span>
            </span>
            <span className="hidden md:inline text-muted-foreground/30 mx-2">
              |
            </span>
            <span>
              Hasta:{' '}
              <span className="font-medium text-foreground">
                {new Date(currentPeriod.end_date).toLocaleDateString()}
              </span>
            </span>
          </div>

          {/* Improved Days Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-muted/20 border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Días Totales
                </span>
                <Calendar className="h-4 w-4 text-muted-foreground opacity-70" />
              </div>
              <span className="text-3xl font-bold">
                {currentPeriod.total_days}
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
                {currentPeriod.available_days}
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
                {currentPeriod.total_days - currentPeriod.available_days}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout for Compact View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column: KPIs & Next Vacations (Compact) */}
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
              <div className="flex items-center justify-between p-2 rounded-md border bg-yellow-50/50 border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    Pendientes
                  </span>
                </div>
                <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  {mockKPIs.pending}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md border bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Aprobadas
                  </span>
                </div>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                  {mockKPIs.approved}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md border bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    Rechazadas
                  </span>
                </div>
                <span className="text-lg font-bold text-red-700 dark:text-red-400">
                  {mockKPIs.rejected}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Compact Next Vacations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Plane className="h-4 w-4 text-sky-500" />
                Próximas Vacaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockNextVacations.length > 0 ? (
                  mockNextVacations.map((vacation) => (
                    <div
                      key={vacation.id}
                      className="flex flex-col gap-1 rounded-md border p-3 shadow-sm text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1 bg-green-50 text-green-700 border-green-200"
                        >
                          Programado
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground">
                          {vacation.total_days} días
                        </span>
                      </div>
                      <p className="font-medium text-xs mt-1">
                        {new Date(vacation.start_date).toLocaleDateString()} -{' '}
                        {new Date(vacation.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No hay próximas vacaciones.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Requests Table (Expanded) */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Mis Solicitudes
              </CardTitle>
              <CardDescription>
                Historial de solicitudes del periodo seleccionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Días</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRequests.length > 0 ? (
                    displayedRequests.map((request) => (
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
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewRequest(request)}
                            title="Ver detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center h-24 text-muted-foreground"
                      >
                        No hay solicitudes para este periodo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {periodRequests.length > 10 && !showAllRequests && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex justify-center w-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-muted-foreground hover:text-primary"
                            onClick={() => setShowAllRequests(true)}
                          >
                            Ver más <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN DE EQUIPO (NUEVA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2a. Solicitudes Pendientes (2/3 width) */}
        <Card className="lg:col-span-2 border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Solicitudes Pendientes de mi Equipo
            </CardTitle>
            <CardDescription>
              Revisa y aprueba las solicitudes de vacaciones de tu equipo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
              {mockTeamRequests.length > 0 ? (
                mockTeamRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col gap-3 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={req.employee.avatar_url} />
                          <AvatarFallback>
                            {req.employee.first_name[0]}
                            {req.employee.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-sm">
                            {req.employee.first_name} {req.employee.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {req.employee.position}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
                        {req.total_days} días
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1 mt-1 bg-muted/30 p-2 rounded">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Desde:</span>
                        <span className="font-medium text-foreground">
                          {new Date(req.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Hasta:</span>
                        <span className="font-medium text-foreground">
                          {new Date(req.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => handleViewTeamRequest(req)}
                      >
                        Ver detalle
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                      >
                        Ir a Aprobar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  No hay solicitudes pendientes.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2b. Próximas Ausencias (1/3 width) */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              Próximas Ausencias
            </CardTitle>
            <CardDescription>Ausencias programadas del equipo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTeamAbsences.length > 0 ? (
                mockTeamAbsences.map((absence) => (
                  <div
                    key={absence.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="text-xs">
                        {absence.employee.first_name[0]}
                        {absence.employee.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {absence.employee.first_name}{' '}
                        {absence.employee.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(absence.start_date).toLocaleDateString()} -{' '}
                        {new Date(absence.end_date).toLocaleDateString()}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1 font-normal"
                      >
                        {absence.type === 'VACATION'
                          ? 'Vacaciones'
                          : 'Licencia'}{' '}
                        ({absence.total_days}d)
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay ausencias próximas.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Request Detail Dialog */}
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
                  {
                    mockPeriods.find(
                      (p) => p.id === selectedRequest.vacation_period_id
                    )?.start_date
                  }
                  {' - '}
                  {
                    mockPeriods.find(
                      (p) => p.id === selectedRequest.vacation_period_id
                    )?.end_date
                  }
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

      {/* Team Request Detail Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud de Equipo</DialogTitle>
            <DialogDescription>
              Revisar solicitud de {selectedTeamRequest?.employee.first_name}{' '}
              {selectedTeamRequest?.employee.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedTeamRequest && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedTeamRequest.employee.avatar_url} />
                  <AvatarFallback>
                    {selectedTeamRequest.employee.first_name[0]}
                    {selectedTeamRequest.employee.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    {selectedTeamRequest.employee.first_name}{' '}
                    {selectedTeamRequest.employee.last_name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTeamRequest.employee.position}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Desde
                  </h4>
                  <p className="font-medium">
                    {new Date(
                      selectedTeamRequest.start_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Hasta
                  </h4>
                  <p className="font-medium">
                    {new Date(
                      selectedTeamRequest.end_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Días Totales
                  </h4>
                  <p className="font-medium">
                    {selectedTeamRequest.total_days} días
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
                      getStatusColor(selectedTeamRequest.status)
                    )}
                  >
                    {getStatusLabel(selectedTeamRequest.status)}
                  </Badge>
                </div>
              </div>

              {selectedTeamRequest.request_note && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Motivo / Nota
                  </h4>
                  <p className="text-sm bg-muted p-3 rounded-md italic">
                    "{selectedTeamRequest.request_note}"
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsTeamDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
