import { z } from 'zod'

export const VacationPeriodSchema = z.object({
  employee_id: z.string().uuid('Debe seleccionar un empleado válido'),
  period_label: z.string().nonempty('El periodo es requerido'),
  start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Fecha de inicio inválida',
  }),
  end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Fecha de fin inválida',
  }),
  total_days: z.coerce.number().min(0, 'Los días totales deben ser mayor o igual a 0'),
  available_days: z.coerce.number().min(0, 'Los días disponibles deben ser mayor o igual a 0'),
})

export type VacationPeriodFormValues = z.infer<typeof VacationPeriodSchema>
