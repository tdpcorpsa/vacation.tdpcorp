import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { EmployeeFormValues } from '@/schemas/employees.schema'
import { toast } from 'sonner'

export function useEmployeesUpdate() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const { error } = await supabase
        .schema('vacation')
        .from('employees')
        .update({
          hire_date: values.hire_date || null,
          labor_regime_id: values.labor_regime_id,
          manager_id: values.manager_id || null,
        })
        .eq('id', values.id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      toast.success('Empleado actualizado correctamente')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
