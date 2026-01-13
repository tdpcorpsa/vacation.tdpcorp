'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

interface UseRequestsListProps {
  pagination: {
    page: number
    pageSize: number
  }
  search?: string
}

export const useRequestsList = ({ pagination, search }: UseRequestsListProps) => {
  return useQuery({
    queryKey: ['requests', pagination, search],
    queryFn: async () => {
      let query = supabase
        .schema('vacation')
        .from('vacation_requests')
        .select('*, employee:employees(*), vacation_period:vacation_periods(*)', {
          count: 'exact',
        })
        .range(
          (pagination.page - 1) * pagination.pageSize,
          pagination.page * pagination.pageSize - 1
        )
        .order('created_at', { ascending: false })

      if (search) {
        // Búsqueda simple por nota, ajustar según necesidad
        query = query.ilike('request_note', `%${search}%`)
      }

      const { data, count, error } = await query

      if (error) throw error

      return {
        data: data || [],
        total: count || 0,
        pagination,
      }
    },
  })
}
