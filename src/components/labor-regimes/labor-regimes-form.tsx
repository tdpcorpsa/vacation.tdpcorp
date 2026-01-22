'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { LaborRegimeSchema } from '@/schemas/labor-regimes.schema'

export function LaborRegimeForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<LaborRegimeSchema>()

  const isActive = watch('is_active')

  return (
    <div className="grid gap-4 py-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ej. Régimen General"
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="days">Días de vacaciones</FieldLabel>
        <FieldContent>
          <Input
            id="days"
            type="number"
            placeholder="Ej. 30"
            {...register('days', { valueAsNumber: true })}
          />
          <FieldError errors={[errors.days]} />
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="is_active">Activo</FieldLabel>
        <FieldContent>
          <Switch
            id="is_active"
            checked={isActive}
            onCheckedChange={(checked: boolean) =>
              setValue('is_active', checked)
            }
          />
          <FieldError errors={[errors.is_active]} />
        </FieldContent>
      </Field>
    </div>
  )
}
