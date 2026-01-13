'use client'

import { supabase } from '@/lib/supabase/client'
import { VacationPeriodFormValues } from '@/schemas/vacation-periods.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVacationPeriodsUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: VacationPeriodFormValues
    }) => {
      const { error } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .update(data)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Periodo vacacional actualizado correctamente')
      queryClient.invalidateQueries({ queryKey: ['vacation-periods'] })
    },
    onError: (error) => {
      toast.error('Error al actualizar el periodo vacacional')
      console.error(error)
    },
  })
}
