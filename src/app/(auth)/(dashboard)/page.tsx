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
import { Button } from '@/components/ui/button'
import { useDashboardData } from '@/hooks/dashboard/use-dashboard-data'
import { useHrDashboardData } from '@/hooks/dashboard/use-hr-dashboard-data'
import { useHrSelectors } from '@/hooks/dashboard/use-hr-selectors'
import { HrLoading } from '@/components/dashboard/hr-loading'
import { HrError } from '@/components/dashboard/hr-error'
import { HrStatsGrid } from '@/components/dashboard/hr-stats-grid'
import { HrRequestsTab } from '@/components/dashboard/hr-requests-tab'
import { HrPlanningTab } from '@/components/dashboard/hr-planning-tab'
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
  Calendar,
} from 'lucide-react'
import { RequestDetailDialog } from '@/components/dashboard/request-detail-dialog'

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
    'requests' | 'planning'
  >('requests')

  const [requestSearch, setRequestSearch] = React.useState('')
  const [hrStatusFilter, setHrStatusFilter] = React.useState<string>('ALL')

  const { page: requestPage } = usePagination({ queryKey: 'requestsPage' })

  const REQUESTS_PER_PAGE = 10

  const { data, isLoading, isError } = useDashboardData()
  const { data: hrData, isLoading: isHrLoading, isError: isHrError } = useHrDashboardData()

  const {
    hrTotalEmployees,
    hrTotalRequests,
    hrPendingRequests,
    hrApprovedRequests,
    hrRejectedRequests,
    hrAvgDecisionTimeHours,
    hrEnrichedRequests,
    filteredHrRequests,
    paginatedHrRequests,
  } = useHrSelectors(hrData, {
    requestSearch,
    hrStatusFilter,
    page: requestPage,
    pageSize: REQUESTS_PER_PAGE,
  })

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

  const selectedRequest = React.useMemo(() => {
    if (!selectedRequestId) return null

    // Search in employee requests
    const empReq = requests.find((r) => r.id === selectedRequestId)
    if (empReq) return empReq

    // Search in HR requests
    const hrReq = hrData?.requests.find((r) => r.id === selectedRequestId)
    return hrReq || null
  }, [requests, hrData, selectedRequestId])

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
            </>
          )}
        </>
      )}

      {activeTab === 'hr' && (
        <>
          {isHrLoading && <HrLoading />}

          {(isHrError || !hrData) && !isHrLoading && <HrError />}

          {!isHrLoading && !isHrError && hrData && (
            <>
              <HrStatsGrid
                totalEmployees={hrTotalEmployees}
                totalRequests={hrTotalRequests}
                pendingRequestsCount={hrPendingRequests.length}
                approvedRequestsCount={hrApprovedRequests.length}
                rejectedRequestsCount={hrRejectedRequests.length}
                avgDecisionTimeHours={hrAvgDecisionTimeHours}
              />

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
                  variant={hrActiveTab === 'planning' ? 'default' : 'ghost'}
                  onClick={() => setHrActiveTab('planning')}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Planificación
                </Button>
              </div>

              {hrActiveTab === 'requests' && (
                  <HrRequestsTab
                    requestSearch={requestSearch}
                    setRequestSearch={setRequestSearch}
                    hrStatusFilter={hrStatusFilter}
                    setHrStatusFilter={setHrStatusFilter}
                    paginatedRequests={paginatedHrRequests}
                    totalFilteredRequests={filteredHrRequests.length}
                    requestsPerPage={REQUESTS_PER_PAGE}
                    onViewRequest={handleViewRequest}
                  />
                )}

              {hrActiveTab === 'planning' && (
                <HrPlanningTab requests={hrEnrichedRequests} />
              )}
            </>
          )}
        </>
      )}

      <RequestDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        request={selectedRequest}
        periods={activeTab === 'employee' ? periods : hrData?.periods || []}
      />
    </div>
  )
}
