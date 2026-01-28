import { useMemo } from 'react'
import { HRDashboardData, HRDashboardEmployee } from './use-hr-dashboard-data'
import { VacationRequest, VacationPeriod } from './use-dashboard-data'
import { DateRange } from 'react-day-picker'
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns'

export type EnrichedVacationRequest = VacationRequest & {
  employeeProfile: HRDashboardEmployee['profile']
  employeeLaborRegime: HRDashboardEmployee['laborRegime']
  createdByUser: HRDashboardEmployee['profile']
  decidedByUser: HRDashboardEmployee['profile']
}

export type EnrichedVacationPeriod = VacationPeriod & {
  employeeProfile: HRDashboardEmployee['profile']
  employeeLaborRegime: HRDashboardEmployee['laborRegime']
}

export function useHrSelectors(
  hrData: HRDashboardData | undefined,
  filters: {
    requestSearch: string
    hrStatusFilter: string
    dateRangeFilter?: DateRange
    page: number
    pageSize: number
  }
) {
  const hrEmployees = useMemo(() => hrData?.employees ?? [], [hrData])
  const hrRequests = useMemo(() => hrData?.requests ?? [], [hrData])
  const hrProfilesById = useMemo(() => hrData?.profilesById ?? {}, [hrData])

  const hrEmployeesById = useMemo(() => {
    const map: Record<string, HRDashboardEmployee> = {}
    for (const emp of hrEmployees) {
      map[emp.employee.id] = emp
    }
    return map
  }, [hrEmployees])

  const hrEnrichedRequests = useMemo(
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

  const hrTotalEmployees = hrEmployees.length
  const hrTotalRequests = hrRequests.length
  const hrPendingRequests = hrRequests.filter((r) => r.status === 'PENDING')
  const hrApprovedRequests = hrRequests.filter((r) => r.status === 'APPROVED')
  const hrRejectedRequests = hrRequests.filter((r) => r.status === 'REJECTED')

  const hrAvgDecisionTimeHours = useMemo(() => {
    const decided = hrRequests.filter((r) => r.decided_at && r.submitted_at)
    if (!decided.length) return 0
    const totalHours = decided.reduce((acc, r) => {
      if (!r.submitted_at || !r.decided_at) return acc
      const start = new Date(r.submitted_at).getTime()
      const end = new Date(r.decided_at).getTime()
      return acc + (end - start) / (1000 * 60 * 60)
    }, 0)
    return Math.round(totalHours / decided.length)
  }, [hrRequests])

  const filteredHrRequests = useMemo(() => {
    const search = filters.requestSearch.toLowerCase()
    return hrEnrichedRequests.filter((req) => {
      const profile = req.employeeProfile
      const matchesSearch =
        !search ||
        profile?.first_name?.toLowerCase().includes(search) ||
        profile?.last_name?.toLowerCase().includes(search) ||
        profile?.email?.toLowerCase().includes(search)

      const matchesStatus =
        filters.hrStatusFilter === 'ALL' || req.status.toLowerCase() === filters.hrStatusFilter.toLowerCase()

      let matchesDate = true
      if (filters.dateRangeFilter?.from) {
        const filterFrom = startOfDay(filters.dateRangeFilter.from)
        const filterTo = endOfDay(
          filters.dateRangeFilter.to || filters.dateRangeFilter.from
        )
        // Parsear fechas de solicitud (asumiendo string YYYY-MM-DD)
        // Usamos new Date(str + 'T00:00:00') para evitar problemas de zona horaria local
        // O mejor, usamos las mismas utilidades de fecha consistentes
        const parse = (s: string) => {
           const [y, m, d] = s.split('-').map(Number)
           return new Date(y, m - 1, d)
        }
        const reqStart = startOfDay(parse(req.start_date))
        const reqEnd = endOfDay(parse(req.end_date))

        matchesDate = reqStart <= filterTo && reqEnd >= filterFrom
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [
    hrEnrichedRequests,
    filters.requestSearch,
    filters.hrStatusFilter,
    filters.dateRangeFilter,
  ])

  const paginatedHrRequests = filteredHrRequests.slice(
    (filters.page - 1) * filters.pageSize,
    filters.page * filters.pageSize
  )

  return {
    hrTotalEmployees,
    hrTotalRequests,
    hrPendingRequests,
    hrApprovedRequests,
    hrRejectedRequests,
    hrAvgDecisionTimeHours,
    hrEnrichedRequests,
    filteredHrRequests,
    paginatedHrRequests,
  }
}
