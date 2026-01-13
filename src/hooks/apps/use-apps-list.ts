import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { applySupabasePagination } from '@/components/ui/pagination-group'
import { applySupabaseSearch } from '@/components/ui/search-input'

type AppRow = Tables<'apps'>

export function useAppsList({
  pagination,
  search,
  sortBy,
  sortOrder,
}: {
  pagination?: { page: number; pageSize: number }
  search?: string
  sortBy?: 'name' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['apps', pagination, search, sortBy, sortOrder],
    queryFn: async (): Promise<{
      data: AppRow[]
      total: number
      pagination?: { page: number; pageSize: number }
    }> => {
      let query = supabase.from('apps').select('*', { count: 'exact' })

      query = applySupabaseSearch(query, search, ['name', 'description', 'url'])

      const field = sortBy ?? 'created_at'
      query = query.order(field, { ascending: sortOrder === 'asc' })

      query = applySupabasePagination(query, pagination)

      const { data, error, count } = await query
      if (error) {
        throw new Error(error.message)
      }

      return { data: (data as AppRow[]) || [], total: count || 0, pagination }
    },
    enabled: true,
  })
}
