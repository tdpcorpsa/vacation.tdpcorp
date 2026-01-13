'use client'

import { supabase } from '@/lib/supabase/client'
import { RequestSchemaType } from '@/schemas/requests.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRequestsUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: RequestSchemaType
    }) => {
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
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
    onError: (error) => {
      toast.error('Error al actualizar la solicitud: ' + error.message)
    },
  })
}
