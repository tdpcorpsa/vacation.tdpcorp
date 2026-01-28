'use client'

import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVacationRequestsSubmit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .schema('vacation')
        .from('vacation_requests')
        .update({
          status: 'PENDING',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacation-requests'] })
    },
    onError: (error) => {
      toast.error('Error al enviar la solicitud: ' + error.message)
    },
  })
}
