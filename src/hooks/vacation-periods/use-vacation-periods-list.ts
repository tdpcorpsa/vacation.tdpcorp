'use client'

import { supabase } from '@/lib/supabase/client'
import { applySupabasePagination } from '@/components/ui/pagination-group/generate-supabase-pagination'
import { applySupabaseSearch } from '@/components/ui/search-input/generate-supabase-search'
import { useQuery } from '@tanstack/react-query'
import usePerms from '@/hooks/auth/use-perms'
import { useProfileContext } from '@/providers/profile-provider'

type UseVacationPeriodsListProps = {
  pagination?: {
    page: number
    pageSize: number
  }
  search?: string
  employeeId?: string
}

export const useVacationPeriodsList = ({
  pagination = { page: 1, pageSize: 100 },
  search,
  employeeId,
}: UseVacationPeriodsListProps = {}) => {
  const { canAccess } = usePerms()
  const { profile } = useProfileContext()

  return useQuery({
    queryKey: ['vacation-periods', pagination, search, employeeId, profile?.id],
    queryFn: async () => {
      const canReadAll = canAccess('vacation', 'vacation_periods', 'read')
      const canReadId = canAccess('vacation', 'vacation_periods', 'readId')

      // Si no tiene ningún permiso de lectura, retornar vacío
      if (!canReadAll && !canReadId) {
        return {
          data: [],
          total: 0,
        }
      }

      // Determinar el employeeId efectivo
      // Si solo tiene permiso readId, forzamos a ver sus propios datos
      let effectiveEmployeeId = employeeId
      if (!canReadAll && canReadId) {
        if (profile?.id) {
          effectiveEmployeeId = profile.id
        } else {
          // Si no hay profile.id (algo raro), retornar vacío por seguridad
          return { data: [], total: 0 }
        }
      }

      // Si se requiere que esté ligado a un empleado, y no hay employeeId efectivo, no devolver nada
      if (!effectiveEmployeeId) {
        return {
          data: [],
          total: 0,
        }
      }

      let query = supabase
        .schema('vacation')
        .from('vacation_periods')
        .select('*', { count: 'exact' })

      if (effectiveEmployeeId) {
        query = query.eq('employee_id', effectiveEmployeeId)
      }

      // Aplicar búsqueda
      query = applySupabaseSearch(query, search, ['period_label'])

      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      const { data, error, count } = await query.order('created_at', {
        ascending: false,
      })

      if (error) throw error

      return {
        data: data || [],
        total: count || 0,
      }
    },
    enabled: true, // Siempre habilitado, controlamos el retorno dentro
  })
}
