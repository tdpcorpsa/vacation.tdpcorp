import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useUser from '@/hooks/auth/use-user'

export type VacationPeriod = Tables<{ schema: 'vacation' }, 'vacation_periods'>
export type VacationRequest = Tables<
  { schema: 'vacation' },
  'vacation_requests'
>
export type EmployeeRow = Tables<{ schema: 'vacation' }, 'employees'>
export type ProfileRow = Tables<'profiles'>
export type LaborRegimeRow = Tables<{ schema: 'vacation' }, 'labor_regime'>

export type EmployeeSummary = {
  employee: EmployeeRow
  profile: ProfileRow | null
  laborRegime: LaborRegimeRow | null
  managerProfile: ProfileRow | null
  roleDescription: string | null
}

export type DashboardData = {
  periods: VacationPeriod[]
  requests: VacationRequest[]
  employeeSummary: EmployeeSummary | null
}

export function useDashboardData() {
  const supabase = createClient()
  const { data: user } = useUser()

  return useQuery({
    queryKey: ['dashboard', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<DashboardData> => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado')
      }

      const { data: employee, error: employeeError } = await supabase
        .schema('vacation')
        .from('employees')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (employeeError) {
        throw new Error(employeeError.message)
      }

      if (!employee) {
        return {
          periods: [],
          requests: [],
          employeeSummary: null,
        }
      }

      const { data: periods, error: periodsError } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .select('*')
        .eq('employee_id', employee.id)
        .order('start_date', { ascending: false })

      if (periodsError) {
        throw new Error(periodsError.message)
      }

      const { data: requests, error: requestsError } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .select('*')
        .eq('employee_id', employee.id)

      if (requestsError) {
        throw new Error(requestsError.message)
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', employee.id)
        .maybeSingle()

      if (profileError) {
        throw new Error(profileError.message)
      }

      let managerProfile: ProfileRow | null = null

      if (employee.manager_id) {
        const { data: manager, error: managerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', employee.manager_id)
          .maybeSingle()

        if (managerError) {
          throw new Error(managerError.message)
        }

        managerProfile = manager
      }

      const { data: laborRegime, error: laborRegimeError } = await supabase
        .schema('vacation')
        .from('labor_regime')
        .select('*')
        .eq('id', employee.labor_regime_id)
        .maybeSingle()

      if (laborRegimeError) {
        throw new Error(laborRegimeError.message)
      }

      const employeeSummary: EmployeeSummary = {
        employee,
        profile: profile ?? null,
        laborRegime: laborRegime ?? null,
        managerProfile,
        roleDescription: null,
      }

      return {
        periods: periods ?? [],
        requests: requests ?? [],
        employeeSummary,
      }
    },
  })
}
