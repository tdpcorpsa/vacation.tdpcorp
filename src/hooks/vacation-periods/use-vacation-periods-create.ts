'use client'

import { supabase } from '@/lib/supabase/client'
import { VacationPeriodFormValues } from '@/schemas/vacation-periods.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVacationPeriodsCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: VacationPeriodFormValues) => {
      const { error } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .insert(data)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Periodo vacacional creado correctamente')
      queryClient.invalidateQueries({ queryKey: ['vacation-periods'] })
    },
    onError: (error) => {
      toast.error('Error al crear el periodo vacacional')
      console.error(error)
    },
  })
}
