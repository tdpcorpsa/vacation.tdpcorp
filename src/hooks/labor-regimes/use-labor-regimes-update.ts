import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { LaborRegimeSchema } from '@/schemas/labor-regimes.schema'
import { toast } from 'sonner'

export const useLaborRegimesUpdate = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: LaborRegimeSchema
    }) => {
      const { error } = await supabase
        .schema('vacation')
        .from('labor_regime')
        .update(data)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Régimen laboral actualizado correctamente')
      queryClient.invalidateQueries({ queryKey: ['labor-regimes'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
