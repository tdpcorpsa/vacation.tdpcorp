'use client'

import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVacationPeriodsDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Periodo vacacional eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['vacation-periods'] })
    },
    onError: (error) => {
      toast.error('Error al eliminar el periodo vacacional')
      console.error(error)
    },
  })
}
