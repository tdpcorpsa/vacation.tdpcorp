'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'

type Employee = Database['vacation']['Tables']['employees']['Row']
type ProfilePartial = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'first_name' | 'last_name' | 'email' | 'avatar_url'
>
type LaborRegime = Database['vacation']['Tables']['labor_regime']['Row']

export type EmployeeWithUser = Employee & {
  profile:
    | ProfilePartial
    | {
        first_name: string
        last_name: string
        email: string
        avatar_url: null
      }
  labor_regime?: LaborRegime | null
  manager?: ProfilePartial | null
  is_on_vacation?: boolean
  currentVacation?: any
}

export const useEmployeesList = (params?: {
  pagination?: {
    page: number
    pageSize: number
  }
  search?: string
}) => {
  return useQuery({
    queryKey: ['employees', params?.pagination, params?.search],
    queryFn: async () => {
      // 1. Obtener empleados con sus relaciones
      const { data: employees, error: employeesError } = await supabase
        .schema('vacation')
        .from('employees')
        .select(`
          *,
          labor_regime:labor_regime(*)
        `)

      if (employeesError) throw employeesError
      if (!employees || employees.length === 0) {
        return {
          data: [],
          total: 0,
          pagination: params?.pagination,
        }
      }

      // 2. Obtener perfiles de empleados y sus jefes
      const employeeIds = employees.map((e) => e.id)
      const managerIds = employees
        .map((e) => e.manager_id)
        .filter((id): id is string => !!id)
      
      const allProfileIds = Array.from(new Set([...employeeIds, ...managerIds]))

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .in('id', allProfileIds)

      if (profilesError) throw profilesError

      // 3. Verificar estado de vacaciones (solicitudes aprobadas activas hoy)
      const today = new Date().toISOString().split('T')[0]
      const { data: activeVacations, error: vacationsError } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .select('employee_id')
        .eq('status', 'APPROVED')
        .lte('start_date', today)
        .gte('end_date', today)

      if (vacationsError) throw vacationsError

      const vacationEmployeeIds = new Set(activeVacations?.map(v => v.employee_id))

      // 4. Combinar datos
      let employeesWithProfile = employees.map((emp) => {
        const profile = profiles?.find((p) => p.id === emp.id)
        const manager = emp.manager_id 
          ? profiles?.find((p) => p.id === emp.manager_id)
          : null
          
        return {
          ...emp,
          profile: profile || {
            first_name: 'Desconocido',
            last_name: '',
            email: '',
            avatar_url: null,
          },
          labor_regime: emp.labor_regime as LaborRegime | null,
          manager: manager || null,
          is_on_vacation: vacationEmployeeIds.has(emp.id)
        }
      })

      // 5. Filtrar por búsqueda
      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        employeesWithProfile = employeesWithProfile.filter((emp) => {
          const fullName =
            `${emp.profile.first_name} ${emp.profile.last_name}`.toLowerCase()
          const email = emp.profile.email?.toLowerCase() || ''
          const laborRegimeName = emp.labor_regime?.name?.toLowerCase() || ''
          
          return fullName.includes(searchLower) || 
                 email.includes(searchLower) ||
                 laborRegimeName.includes(searchLower)
        })
      }

      // 6. Paginación
      const total = employeesWithProfile.length
      let pagedData = employeesWithProfile

      if (params?.pagination) {
        const { page, pageSize } = params.pagination
        const from = (page - 1) * pageSize
        const to = from + pageSize
        pagedData = employeesWithProfile.slice(from, to)
      }

      return {
        data: pagedData,
        total,
        pagination: params?.pagination,
      }
    },
  })
}
