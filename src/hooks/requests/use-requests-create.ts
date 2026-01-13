'use client'

import { supabase } from '@/lib/supabase/client'
import { RequestSchemaType } from '@/schemas/requests.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRequestsCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: RequestSchemaType & { employee_id: string; created_by: string }
    ) => {
      const { error } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .insert({
          ...data,
          status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      })

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Solicitud creada correctamente')
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
    onError: (error) => {
      toast.error('Error al crear la solicitud: ' + error.message)
    },
  })
}
