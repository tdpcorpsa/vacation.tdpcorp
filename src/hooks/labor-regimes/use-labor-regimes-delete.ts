import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export const useLaborRegimesDelete = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .schema('vacation')
        .from('labor_regime')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Régimen laboral eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['labor-regimes'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
