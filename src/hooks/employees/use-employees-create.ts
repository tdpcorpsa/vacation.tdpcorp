import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { EmployeeFormValues } from '@/schemas/employees.schema'
import { toast } from 'sonner'

export function useEmployeesCreate() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const { error } = await supabase
        .schema('vacation')
        .from('employees')
        .insert({
          id: values.id,
          hire_date: values.hire_date || null,
          labor_regime_id: values.labor_regime_id,
          manager_id: values.manager_id || null,
        })

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      toast.success('Empleado creado correctamente')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['potential_employees'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
