'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const useEmployeesList = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      // 1. Obtener empleados
      const { data: employees, error: employeesError } = await supabase
        .schema('vacation')
        .from('employees')
        .select('*')

      if (employeesError) throw employeesError
      if (!employees || employees.length === 0) return []

      // 2. Obtener perfiles de esos empleados
      const employeeIds = employees.map((e) => e.id)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', employeeIds)

      if (profilesError) throw profilesError

      // 3. Combinar datos
      const employeesWithProfile = employees.map((emp) => {
        const profile = profiles?.find((p) => p.id === emp.id)
        return {
          ...emp,
          profile: profile || { first_name: 'Desconocido', last_name: '', email: '' },
        }
      })

      return employeesWithProfile
    },
  })
}
