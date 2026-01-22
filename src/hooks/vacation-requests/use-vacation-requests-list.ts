'use client'

import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { applySupabasePagination } from '@/components/ui/pagination-group/generate-supabase-pagination'
import { applySupabaseSearch } from '@/components/ui/search-input/generate-supabase-search'
import { useQuery } from '@tanstack/react-query'
import usePerms from '@/hooks/auth/use-perms'
import { useProfileContext } from '@/providers/profile-provider'

export type VacationRequestWithProfiles = Tables<
  { schema: 'vacation' },
  'vacation_requests'
> & {
  employee: Tables<{ schema: 'vacation' }, 'employees'> | null
  vacation_period: Tables<{ schema: 'vacation' }, 'vacation_periods'> | null
  employee_profile?: Tables<'profiles'> | null
  approver_profile?: Tables<'profiles'> | null
}

interface UseVacationRequestsListProps {
  pagination: {
    page: number
    pageSize: number
  }
  search?: string
}

export const useVacationRequestsList = ({
  pagination,
  search,
}: UseVacationRequestsListProps) => {
  const { canAccess } = usePerms()
  const { profile } = useProfileContext()

  return useQuery({
    queryKey: ['vacation-requests', pagination, search, profile?.id],
    queryFn: async () => {
      const canReadAll = canAccess('vacation', 'vacation_requests', 'read')
      const canReadOwn = canAccess('vacation', 'vacation_requests', 'readId')

      // Si no tiene permiso de leer todo ni leer lo suyo, retornar vacío
      if (!canReadAll && !canReadOwn) {
        return {
          data: [] as VacationRequestWithProfiles[],
          total: 0,
          pagination,
        }
      }

      // Si solo tiene permiso de leer lo suyo, pero no tenemos el ID del perfil, retornar vacío por seguridad
      if (!canReadAll && canReadOwn && !profile?.id) {
        return {
          data: [] as VacationRequestWithProfiles[],
          total: 0,
          pagination,
        }
      }

      let query = supabase
        .schema('vacation')
        .from('vacation_requests')
        .select(
          '*, employee:employees(*), vacation_period:vacation_periods(*)',
          {
            count: 'exact',
          }
        )

      // Si NO tiene permiso de leer todo, pero SÍ tiene permiso de leer lo suyo, filtrar por su ID
      if (!canReadAll && canReadOwn) {
        query = query.eq('employee_id', profile!.id as string)
      }

      // Aplicar búsqueda
      query = applySupabaseSearch(query, search, ['request_note'])

      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      const {
        data: requests,
        count,
        error,
      } = await query.order('created_at', {
        ascending: false,
      })

      if (error) throw error

      if (!requests || requests.length === 0) {
        return {
          data: [] as VacationRequestWithProfiles[],
          total: count || 0,
          pagination,
        }
      }

      // Obtener IDs de empleados y aprobadores
      const profileIds = new Set<string>()
      requests.forEach((req) => {
        if (req.employee_id) profileIds.add(req.employee_id)
        if (req.decided_by) profileIds.add(req.decided_by)
      })

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(profileIds))

      if (profilesError) throw profilesError

      const profilesMap = new Map(profiles?.map((p) => [p.id, p]))

      const enrichedData: VacationRequestWithProfiles[] = requests.map(
        (req) => ({
          ...req,
          employee_profile: profilesMap.get(req.employee_id) || null,
          approver_profile: req.decided_by
            ? profilesMap.get(req.decided_by)
            : null,
        })
      )

      return {
        data: enrichedData,
        total: count || 0,
        pagination,
      }
    },
  })
}
