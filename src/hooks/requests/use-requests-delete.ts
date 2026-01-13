'use client'

import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRequestsDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Solicitud eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
    onError: (error) => {
      toast.error('Error al eliminar la solicitud: ' + error.message)
    },
  })
}
