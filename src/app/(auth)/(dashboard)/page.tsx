'use client'
import * as React from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { HrLoading } from '@/components/dashboard/hr-loading'
import { HrError } from '@/components/dashboard/hr-error'
import { HrStatsGrid } from '@/components/dashboard/hr-stats-grid'
import { HrRequestsTab } from '@/components/dashboard/hr-requests-tab'
import { HrPlanningTab } from '@/components/dashboard/hr-planning-tab'
import { EmployeeInfoCard } from '@/components/dashboard/employee-info-card'
import { PeriodSummaryCard } from '@/components/dashboard/period-summary-card'
import { UpcomingVacationsCard } from '@/components/dashboard/upcoming-vacations-card'
import {
  Users,
  FileText,
  Calendar,
  User,
  Plus,
} from 'lucide-react'
import { RequestDetailDialog } from '@/components/dashboard/request-detail-dialog'
import CanAccess from '@/components/ui/can-access'
import { useRouter } from 'next/navigation'
import { useDashboardController } from '@/hooks/dashboard/use-dashboard-controller'

export default function DashboardPage() {
  const router = useRouter()
  
  const {
    activeTab,
    setActiveTab,
    selectedPeriodId,
    setSelectedPeriodId,
    isDialogOpen,
    setIsDialogOpen,
    requestSearch,
    setRequestSearch,
    hrStatusFilter,
    setHrStatusFilter,
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
    hrData,
  } = useDashboardController()

  return (
    <CanAccess
      subdomain="vacation"
      resource="employees"
      action="readId"
      variant="page"
    >
      <div className="max-w-[95%] mx-auto space-y-4 pb-10">
        <PageHeader
          title="Dashboard"
          description="Gestión integral de vacaciones y métricas."
        />

        {isLoadingGlobal && <HrLoading />}

        {(isErrorGlobal || !hasDataGlobal) && !isLoadingGlobal && <HrError />}

        {!isLoadingGlobal && !isErrorGlobal && hasDataGlobal && (
          <>
            <HrStatsGrid
              totalEmployees={kpiStats.totalEmployees}
              totalRequests={kpiStats.totalRequests}
              pendingRequestsCount={kpiStats.pendingRequestsCount}
              approvedRequestsCount={kpiStats.approvedRequestsCount}
              rejectedRequestsCount={kpiStats.rejectedRequestsCount}
              avgDecisionTimeHours={kpiStats.avgDecisionTimeHours}
            />

            {canSeeTabs && (
              <div className="flex flex-wrap items-center gap-2 border-b pb-2">
                <Button
                  variant={activeTab === 'my-data' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('my-data')}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Mis Datos
                </Button>

                <Button
                  variant={activeTab === 'requests' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('requests')}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Bandeja de Solicitudes
                </Button>

                <Button
                  variant={activeTab === 'planning' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('planning')}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Planificación
                </Button>
              </div>
            )}

            {activeTab === 'requests' && canSeeTabs && (
              <HrRequestsTab
                requestSearch={requestSearch}
                setRequestSearch={setRequestSearch}
                hrStatusFilter={hrStatusFilter}
                setHrStatusFilter={setHrStatusFilter}
                paginatedRequests={paginatedDisplayRequests}
                totalFilteredRequests={filteredDisplayRequests.length}
                requestsPerPage={REQUESTS_PER_PAGE}
                onViewRequest={handleViewRequest}
              />
            )}

            {activeTab === 'planning' && canSeeTabs && (
              <HrPlanningTab requests={displayRequests} />
            )}

            {activeTab === 'my-data' && (
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
            )}
          </>
        )}

        <RequestDetailDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          request={selectedRequest}
          periods={activeTab === 'my-data' ? periods : hrData?.periods || []}
        />
      </div>
    </CanAccess>
  )
}

