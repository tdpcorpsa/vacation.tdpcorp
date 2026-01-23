import { VacationPeriod } from '@/hooks/dashboard/use-dashboard-data'
import { PeriodTotals } from './period-summary-card'
import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'

export const getStatusColor = (status: string) => {
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

export const getStatusLabel = (status: string) => {
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

export const calculateAggregatedPeriod = (periods: VacationPeriod[]) => {
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
}

export const calculatePeriodTotals = (
  selectedPeriodId: string,
  currentPeriod: VacationPeriod | null | undefined,
  aggregatedPeriod: ReturnType<typeof calculateAggregatedPeriod>
): PeriodTotals | null => {
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
}

export const filterRequests = (
  requests: EnrichedVacationRequest[],
  search: string,
  statusFilter: string
) => {
  const searchLower = search.toLowerCase()
  return requests.filter((req) => {
    const profile = req.employeeProfile
    const matchesSearch =
      !searchLower ||
      profile?.first_name?.toLowerCase().includes(searchLower) ||
      profile?.last_name?.toLowerCase().includes(searchLower) ||
      profile?.email?.toLowerCase().includes(searchLower)

    const matchesStatus =
      statusFilter === 'ALL' || req.status === statusFilter

    return matchesSearch && matchesStatus
  })
}


