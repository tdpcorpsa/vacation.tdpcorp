import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { applySupabasePagination } from '@/components/ui/pagination-group/generate-supabase-pagination'
import { applySupabaseSearch } from '@/components/ui/search-input/generate-supabase-search'

export const useLaborRegimesList = ({
  pagination,
  search,
}: {
  pagination: {
    page: number
    pageSize: number
  }
  search?: string
}) => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['labor-regimes', pagination, search],
    queryFn: async () => {
      let query = supabase
        .schema('vacation')
        .from('labor_regime')
        .select('*', { count: 'exact' })

      query = applySupabaseSearch(query, search, ['name'])
      query = applySupabasePagination(query, pagination)

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
