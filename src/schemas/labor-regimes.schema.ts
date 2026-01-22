import { z } from 'zod'

export const LaborRegimeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  days: z.number().min(0, 'Los días deben ser mayor o igual a 0'),
  is_active: z.boolean(),
})

export type LaborRegimeSchema = z.infer<typeof LaborRegimeSchema>
