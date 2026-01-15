import { z } from 'zod'

export const EmployeeSchema = z.object({
  id: z.string().uuid('Debe seleccionar un usuario válido'),
  hire_date: z.string().optional().nullable().or(z.literal('')),
  labor_regime_id: z.string().uuid('Debe seleccionar un régimen laboral'),
  manager_id: z.string().uuid().optional().nullable().or(z.literal('')),
})

export type EmployeeFormValues = z.infer<typeof EmployeeSchema>
