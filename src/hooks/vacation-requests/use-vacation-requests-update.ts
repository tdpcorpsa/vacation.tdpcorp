'use client'

import { supabase } from '@/lib/supabase/client'
import { VacationRequestSchemaType } from '@/schemas/vacation-requests.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { validateVacationRules } from '@/lib/vacation-rules'

export const useVacationRequestsUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: VacationRequestSchemaType
    }) => {
      // Validar reglas de negocio (Perú)
      await validateVacationRules(supabase, data, id)

      const { error } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Solicitud actualizada correctamente')
      queryClient.invalidateQueries({ queryKey: ['vacation-requests'] })
    },
    onError: (error) => {
      toast.error('Error al actualizar la solicitud: ' + error.message)
    },
  })
}
