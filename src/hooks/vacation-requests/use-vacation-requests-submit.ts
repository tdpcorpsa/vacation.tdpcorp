'use client'

import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVacationRequestsSubmit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // 1. Obtener detalles de la solicitud
      const { data: request, error: requestError } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .select('total_days, vacation_period_id, status')
        .eq('id', id)
        .single()

      if (requestError) throw requestError
      if (!request) throw new Error('Solicitud no encontrada')

      // Validar estado
      if (request.status !== 'DRAFT') {
        throw new Error('Solo se pueden enviar solicitudes en borrador')
      }

      // 2. Obtener días disponibles del periodo
      const { data: period, error: periodError } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .select('available_days')
        .eq('id', request.vacation_period_id)
        .single()

      if (periodError) throw periodError
      if (!period) throw new Error('Periodo vacacional no encontrado')

      if (period.available_days < request.total_days) {
        throw new Error('Días insuficientes en el periodo seleccionado')
      }

      // 3. Descontar días del periodo
      const { error: updatePeriodError } = await supabase
        .schema('vacation')
        .from('vacation_periods')
        .update({
          available_days: period.available_days - request.total_days,
        })
        .eq('id', request.vacation_period_id)

      if (updatePeriodError) throw updatePeriodError

      // 4. Actualizar estado de la solicitud
      const { error: updateRequestError } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .update({
          status: 'PENDING',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateRequestError) {
        // Revertir cambio en periodo si falla la solicitud
        await supabase
          .schema('vacation')
          .from('vacation_periods')
          .update({
            available_days: period.available_days,
          })
          .eq('id', request.vacation_period_id)

        throw updateRequestError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacation-requests'] })
      queryClient.invalidateQueries({ queryKey: ['vacation-periods'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
    },
    onError: (error) => {
      toast.error('Error al enviar la solicitud: ' + error.message)
    },
  })
}
