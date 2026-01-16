'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

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
  return useQuery({
    queryKey: ['vacation-periods', pagination, search, employeeId],
    queryFn: async () => {
      let query = supabase
        .schema('vacation')
        .from('vacation_periods')
        .select('*', { count: 'exact' })

      if (search) {
        query = query.ilike('period_label', `%${search}%`)
      }

      if (employeeId) {
        query = query.eq('employee_id', employeeId)
      }

      const from = (pagination.page - 1) * pagination.pageSize
      const to = from + pagination.pageSize - 1

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        total: count || 0,
      }
    },
  })
}
