import * as React from 'react'
import { useRouter } from 'next/navigation'
import usePerms from '@/hooks/auth/use-perms'
import { useDashboardData } from '@/hooks/dashboard/use-dashboard-data'
import { useHrDashboardData } from '@/hooks/dashboard/use-hr-dashboard-data'
import { useHrSelectors } from '@/hooks/dashboard/use-hr-selectors'
import { usePagination } from '@/components/ui/pagination-group'
import {
  calculateAggregatedPeriod,
  calculatePeriodTotals,
  filterRequests,
} from '@/components/dashboard/utils'
import { DateRange } from 'react-day-picker'

export const useDashboardController = () => {
  const { canAccess } = usePerms()
  const router = useRouter()

  const [activeTab, setActiveTab] = React.useState<
    'requests' | 'planning' | 'my-data'
  >('my-data')

  const [selectedPeriodId, setSelectedPeriodId] = React.useState<string>('ALL')
  const [selectedRequestId, setSelectedRequestId] = React.useState<
    string | null
  >(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const [requestSearch, setRequestSearch] = React.useState('')
  const [hrStatusFilter, setHrStatusFilter] = React.useState<string>('ALL')
  const [dateRangeFilter, setDateRangeFilter] = React.useState<DateRange | undefined>(undefined)

  const { page: requestPage } = usePagination({ queryKey: 'requestsPage' })

  const REQUESTS_PER_PAGE = 10

  const { data, isLoading, isError } = useDashboardData()

  const canSeeAll = canAccess('vacation', 'employees', 'read')
  const canSeeOwn = canAccess('vacation', 'employees', 'readId')
  const canSeeTabs = canSeeAll || canSeeOwn

  const {
    data: hrData,
    isLoading: isHrLoading,
    isError: isHrError,
  } = useHrDashboardData(canSeeAll)

  // Adaptador de datos para cuando es empleado (readId)
  const employeeEnrichedRequests = React.useMemo(() => {
    if (canSeeAll || !data?.requests || !data?.employeeSummary) return []

    return data.requests.map((req) => ({
      ...req,
      employeeProfile: data.employeeSummary?.profile ?? null,
      employeeLaborRegime: data.employeeSummary?.laborRegime ?? null,
      createdByUser:
        req.created_by === data.employeeSummary?.employee.id
          ? data.employeeSummary?.profile
          : null,
      decidedByUser: null,
    }))
  }, [data, canSeeAll])

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
    dateRangeFilter,
    page: requestPage,
    pageSize: REQUESTS_PER_PAGE,
  })

  // Lógica unificada de datos para las pestañas
  const displayRequests = canSeeAll
    ? hrEnrichedRequests
    : employeeEnrichedRequests

  // Filtrado local para empleado (replicando lógica de useHrSelectors pero simple)
  const filteredDisplayRequests = React.useMemo(() => {
    if (canSeeAll) return filteredHrRequests

    return filterRequests(
      employeeEnrichedRequests,
      requestSearch,
      hrStatusFilter
    )
  }, [
    canSeeAll,
    filteredHrRequests,
    employeeEnrichedRequests,
    requestSearch,
    hrStatusFilter,
  ])

  const paginatedDisplayRequests = React.useMemo(() => {
    if (canSeeAll) return paginatedHrRequests
    return filteredDisplayRequests.slice(
      (requestPage - 1) * REQUESTS_PER_PAGE,
      requestPage * REQUESTS_PER_PAGE
    )
  }, [canSeeAll, paginatedHrRequests, filteredDisplayRequests, requestPage])

  const periods = data?.periods ?? []
  const requests = data?.requests ?? []
  const employeeSummary = data?.employeeSummary ?? null

  const currentPeriod =
    selectedPeriodId === 'ALL'
      ? null
      : periods.find((p) => p.id === selectedPeriodId) || periods[0]

  const aggregatedPeriod = React.useMemo(() => {
    return calculateAggregatedPeriod(periods)
  }, [periods])

  const periodRequests = requests.filter(
    (r) =>
      selectedPeriodId === 'ALL' || r.vacation_period_id === selectedPeriodId
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

  const today = new Date()

  const upcomingVacations = approvedRequests
    .filter((r) => new Date(r.start_date) >= today)
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    .slice(0, 5)

  const periodTotals = React.useMemo(() => {
    return calculatePeriodTotals(
      selectedPeriodId,
      currentPeriod,
      aggregatedPeriod
    )
  }, [aggregatedPeriod, currentPeriod, selectedPeriodId])

  // KPIs dinámicos
  const kpiStats = React.useMemo(() => {
    const isHr = canAccess('vacation', 'employees', 'read')

    // Caso 1: Empleado (solo readId) O RRHH en pestaña "Mis Datos" -> Mostrar datos personales
    if (!isHr || activeTab === 'my-data') {
      return {
        totalEmployees: 1,
        totalRequests: totalRequests,
        pendingRequestsCount: pendingRequests.length,
        approvedRequestsCount: approvedRequests.length,
        rejectedRequestsCount: rejectedRequests.length,
        avgDecisionTimeHours: 0,
      }
    }

    // Caso 2: RRHH en otras pestañas -> Mostrar datos globales
    return {
      totalEmployees: hrTotalEmployees,
      totalRequests: hrTotalRequests,
      pendingRequestsCount: hrPendingRequests.length,
      approvedRequestsCount: hrApprovedRequests.length,
      rejectedRequestsCount: hrRejectedRequests.length,
      avgDecisionTimeHours: hrAvgDecisionTimeHours,
    }
  }, [
    activeTab,
    canAccess,
    totalRequests,
    pendingRequests.length,
    approvedRequests.length,
    rejectedRequests.length,
    hrTotalEmployees,
    hrTotalRequests,
    hrPendingRequests.length,
    hrApprovedRequests.length,
    hrRejectedRequests.length,
    hrAvgDecisionTimeHours,
  ])

  // Determinar estado de carga global
  // Si soy empleado (readId y no read), mi fuente de verdad siempre es useDashboardData (data), incluso en tabs de requests/planning
  const isEmployeeOnly = canSeeOwn && !canSeeAll

  const isLoadingGlobal = isEmployeeOnly
    ? isLoading
    : activeTab === 'my-data'
    ? isLoading
    : isHrLoading
  const isErrorGlobal = isEmployeeOnly
    ? isError
    : activeTab === 'my-data'
    ? isError
    : isHrError
  const hasDataGlobal = isEmployeeOnly
    ? !!data
    : activeTab === 'my-data'
    ? !!data
    : !!hrData

  return {
    activeTab,
    setActiveTab,
    selectedPeriodId,
    setSelectedPeriodId,
    selectedRequestId,
    isDialogOpen,
    setIsDialogOpen,
    requestSearch,
    setRequestSearch,
    hrStatusFilter,
    setHrStatusFilter,
    dateRangeFilter,
    setDateRangeFilter,
    REQUESTS_PER_PAGE,
    canSeeTabs,
    periods,
    employeeSummary,
    periodTotals,
    upcomingVacations,
    kpiStats,
    isLoadingGlobal,
    isErrorGlobal,
    hasDataGlobal,
    paginatedDisplayRequests,
    filteredDisplayRequests,
    displayRequests,
    handleViewRequest,
    selectedRequest,
    hrData, // Needed for RequestDetailDialog periods prop
    requestsPage: requestPage,
  }
}
