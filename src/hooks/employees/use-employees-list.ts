'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'

type Employee = Database['vacation']['Tables']['employees']['Row']
type ProfilePartial = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'first_name' | 'last_name' | 'email' | 'avatar_url'
>

export type EmployeeWithUser = Employee & {
  profile:
    | ProfilePartial
    | {
        first_name: string
        last_name: string
        email: string
        avatar_url: null
      }
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
      // 1. Obtener empleados
      const { data: employees, error: employeesError } = await supabase
        .schema('vacation')
        .from('employees')
        .select('*')

      if (employeesError) throw employeesError
      if (!employees || employees.length === 0) {
        return {
          data: [],
          total: 0,
          pagination: params?.pagination,
        }
      }

      // 2. Obtener perfiles de esos empleados
      const employeeIds = employees.map((e) => e.id)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .in('id', employeeIds)

      if (profilesError) throw profilesError

      // 3. Combinar datos
      let employeesWithProfile = employees.map((emp) => {
        const profile = profiles?.find((p) => p.id === emp.id)
        return {
          ...emp,
          profile: profile || {
            first_name: 'Desconocido',
            last_name: '',
            email: '',
            avatar_url: null,
          },
        }
      })

      // 4. Filtrar por búsqueda
      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        employeesWithProfile = employeesWithProfile.filter((emp) => {
          const fullName =
            `${emp.profile.first_name} ${emp.profile.last_name}`.toLowerCase()
          const email = emp.profile.email?.toLowerCase() || ''
          return fullName.includes(searchLower) || email.includes(searchLower)
        })
      }

      // 5. Paginación
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
