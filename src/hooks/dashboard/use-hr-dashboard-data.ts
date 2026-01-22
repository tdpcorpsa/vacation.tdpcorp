import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  EmployeeRow,
  LaborRegimeRow,
  ProfileRow,
  VacationPeriod,
  VacationRequest,
} from './use-dashboard-data'

export type HRDashboardEmployee = {
  employee: EmployeeRow
  profile: ProfileRow | null
  managerProfile: ProfileRow | null
  laborRegime: LaborRegimeRow | null
}

export type HRDashboardData = {
  employees: HRDashboardEmployee[]
  periods: VacationPeriod[]
  requests: VacationRequest[]
  profilesById: Record<string, ProfileRow>
  laborRegimesById: Record<string, LaborRegimeRow>
}

export function useHrDashboardData() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['hr-dashboard'],
    queryFn: async (): Promise<HRDashboardData> => {
      const { data: employees, error: employeesError } = await supabase
        .schema('vacation')
        .from('employees')
        .select('*')

      if (employeesError) {
        throw new Error(employeesError.message)
      }

      const employeeList: EmployeeRow[] = employees ?? []

      if (!employeeList.length) {
        return {
          employees: [],
          periods: [],
          requests: [],
          profilesById: {},
          laborRegimesById: {},
        }
      }

      const { data: periods, error: periodsError } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .select('*')

      if (periodsError) {
        throw new Error(periodsError.message)
      }

      const { data: requests, error: requestsError } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .select('*')

      if (requestsError) {
        throw new Error(requestsError.message)
      }

      const employeeIds = employeeList.map((e) => e.id)
      const managerIds = employeeList
        .map((e) => e.manager_id)
        .filter((id): id is string => !!id)

      const createdByIds = (requests ?? [])
        .map((r) => r.created_by)
        .filter((id): id is string => !!id)

      const decidedByIds = (requests ?? [])
        .map((r) => r.decided_by)
        .filter((id): id is string => !!id)

      const profileIds = Array.from(
        new Set<string>([
          ...employeeIds,
          ...managerIds,
          ...createdByIds,
          ...decidedByIds,
        ])
      )

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', profileIds)

      if (profilesError) {
        throw new Error(profilesError.message)
      }

      const profilesById: Record<string, ProfileRow> = {}
      for (const profile of profiles ?? []) {
        profilesById[profile.id] = profile
      }

      const rawRegimeIds = employeeList
        .map((e) => e.labor_regime_id)
        .filter((id): id is string => !!id)

      const regimeIds = Array.from(new Set<string>(rawRegimeIds))

      let laborRegimes: LaborRegimeRow[] = []

      if (regimeIds.length) {
        const { data, error: laborRegimesError } = await supabase
          .schema('vacation')
          .from('labor_regime')
          .select('*')
          .in('id', regimeIds)

        if (laborRegimesError) {
          throw new Error(laborRegimesError.message)
        }

        laborRegimes = data ?? []
      }

      const laborRegimesById: Record<string, LaborRegimeRow> = {}
      for (const regime of laborRegimes) {
        laborRegimesById[regime.id] = regime
      }

      const hrEmployees: HRDashboardEmployee[] = employeeList.map(
        (employee) => ({
          employee,
          profile: profilesById[employee.id] ?? null,
          managerProfile: employee.manager_id
            ? (profilesById[employee.manager_id] ?? null)
            : null,
          laborRegime: employee.labor_regime_id
            ? (laborRegimesById[employee.labor_regime_id] ?? null)
            : null,
        })
      )

      return {
        employees: hrEmployees,
        periods: periods ?? [],
        requests: requests ?? [],
        profilesById,
        laborRegimesById,
      }
    },
  })
}
