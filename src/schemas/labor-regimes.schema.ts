import { z } from 'zod'

export const LaborRegimeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  days: z.number().min(0, 'Los días deben ser mayor o igual a 0'),
  is_active: z.boolean(),
  policies: z.object({
    block_a: z.object({
      enabled: z.boolean(),
      days: z.number().min(0),
      allowed_durations: z.array(z.number()),
      required_weekends: z.array(z.number()),
    }),
    block_b: z.object({
      enabled: z.boolean(),
      enable_single_days: z.boolean(),
      required_weekends: z.number().min(0),
    }),
  }),
})

export type LaborRegimeSchema = z.infer<typeof LaborRegimeSchema>
