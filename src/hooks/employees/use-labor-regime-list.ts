import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'

type LaborRegime = Tables<{ schema: 'vacation' }, 'labor_regime'>

export function useLaborRegimeList() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['labor_regime'],
    queryFn: async (): Promise<LaborRegime[]> => {
      const { data, error } = await supabase
        .schema('vacation')
        .from('labor_regime')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw new Error(error.message)
      return data || []
    },
  })
}
