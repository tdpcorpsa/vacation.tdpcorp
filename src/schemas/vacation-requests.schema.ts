import { z } from 'zod'

export const VacationRequestSchema = z
  .object({
    employee_id: z.string().optional(), // Temporal para pruebas
    start_date: z.string().nonempty('La fecha de inicio es requerida'),
    end_date: z.string().nonempty('La fecha de fin es requerida'),
    request_note: z.string().optional(),
    vacation_period_id: z
      .string()
      .uuid('El periodo de vacaciones es requerido'),
    total_days: z.number().min(1, 'Debe solicitar al menos un día'),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)
      return end >= start
    },
    {
      message:
        'La fecha de fin debe ser igual o posterior a la fecha de inicio',
      path: ['end_date'],
    }
  )

export type VacationRequestSchemaType = z.infer<typeof VacationRequestSchema>
