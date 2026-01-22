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

  // Si no tiene permiso de leer todo ('read'), pero sí tiene 'readId', forzamos el filtro por su propio ID
  const canReadAll = canAccess('vacation', 'vacation_periods', 'read')
  const canReadOwn = canAccess('vacation', 'vacation_periods', 'readId')

  // Si no puede leer todo, pero puede leer lo suyo, usamos su ID.
  // Si puede leer todo, usamos el employeeId seleccionado (o undefined si no seleccionó nada).
  const effectiveEmployeeId =
    !canReadAll && canReadOwn ? profile?.id || undefined : employeeId

  return useQuery({
    queryKey: [
      'vacation-periods',
      pagination.page,
      pagination.pageSize,
      search,
      effectiveEmployeeId, // Usamos el ID efectivo
    ],
    queryFn: async () => {
      // Si no tiene permisos, retornar vacío
      if (!canReadAll && !canReadOwn) {
        return {
          data: [],
          total: 0,
        }
      }

      // Si solo tiene permiso de leer lo suyo, pero no tenemos el ID del perfil, retornar vacío por seguridad
      if (!canReadAll && canReadOwn && !profile?.id) {
        return {
          data: [],
          total: 0,
        }
      }

      let query = supabase
        .schema('vacation')
        .from('vacation_periods')
        .select('*, employee:employees(*)', { count: 'exact' })

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

      // Obtener perfiles para mostrar nombres
      const employeeIds = Array.from(
        new Set(data?.map((p) => p.employee_id) || [])
      )

      const profilesMap = new Map()
      if (employeeIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', employeeIds)

        if (profiles) {
          profiles.forEach((p) => profilesMap.set(p.id, p))
        }
      }

      const enrichedData = data?.map((period) => ({
        ...period,
        employee_profile: profilesMap.get(period.employee_id),
      }))

      return {
        data: enrichedData || [],
        total: count || 0,
      }
    },
    enabled: true, // Siempre habilitado, controlamos el retorno dentro
  })
}
