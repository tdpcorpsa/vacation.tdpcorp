import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { LaborRegimeSchema } from '@/schemas/labor-regimes.schema'
import { toast } from 'sonner'

export const useLaborRegimesCreate = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LaborRegimeSchema) => {
      const { error } = await supabase
        .schema('vacation')
        .from('labor_regime')
        .insert(data)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Régimen laboral creado correctamente')
      queryClient.invalidateQueries({ queryKey: ['labor-regimes'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
