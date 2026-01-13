'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const useVacationPeriodsList = () => {
  return useQuery({
    queryKey: ['vacation-periods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error

      return data
    },
  })
}
