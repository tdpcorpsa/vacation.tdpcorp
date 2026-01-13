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
import { Separator } from '@/components/ui/separator'

export function LaborRegimeForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<LaborRegimeSchema>()

  const isActive = watch('is_active')
  const enableSingleDays = watch('policies.block_b.enable_single_days')

  const blockAEnabled = watch('policies.block_a.enabled')
  const blockBEnabled = watch('policies.block_b.enabled')

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

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Políticas Vacacionales</h3>

        <div className="space-y-4 border rounded-md p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              Bloque A (Periodos Largos)
            </h4>
            <Switch
              checked={blockAEnabled}
              onCheckedChange={(checked: boolean) =>
                setValue('policies.block_a.enabled', checked)
              }
            />
          </div>

          {blockAEnabled && (
            <>
              <Field>
                <FieldLabel htmlFor="policies.block_a.days">
                  Días asignados
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="policies.block_a.days"
                    type="number"
                    {...register('policies.block_a.days', {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError errors={[errors.policies?.block_a?.days]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="policies.block_a.allowed_durations">
                  Duraciones permitidas (días)
                </FieldLabel>
                <FieldContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    Ingrese los números separados por coma (ej. 7, 8, 15)
                  </p>
                  <Input
                    id="policies.block_a.allowed_durations"
                    placeholder="7, 8, 15"
                    onChange={(e) => {
                      const val = e.target.value
                      const numbers = val
                        .split(',')
                        .map((v) => parseInt(v.trim()))
                        .filter((n) => !isNaN(n))
                      setValue('policies.block_a.allowed_durations', numbers)
                    }}
                    defaultValue={watch(
                      'policies.block_a.allowed_durations'
                    )?.join(', ')}
                  />
                  <FieldError
                    errors={[errors.policies?.block_a?.allowed_durations]}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="policies.block_a.required_weekends">
                  Fines de semana requeridos
                </FieldLabel>
                <FieldContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    Ingrese los números separados por coma (ej. 1, 2)
                  </p>
                  <Input
                    id="policies.block_a.required_weekends"
                    placeholder="1, 2"
                    onChange={(e) => {
                      const val = e.target.value
                      const numbers = val
                        .split(',')
                        .map((v) => parseInt(v.trim()))
                        .filter((n) => !isNaN(n))
                      setValue('policies.block_a.required_weekends', numbers)
                    }}
                    defaultValue={
                      Array.isArray(watch('policies.block_a.required_weekends'))
                        ? (
                            watch(
                              'policies.block_a.required_weekends'
                            ) as number[]
                          ).join(', ')
                        : ''
                    }
                  />
                  <FieldError
                    errors={[errors.policies?.block_a?.required_weekends]}
                  />
                </FieldContent>
              </Field>
            </>
          )}
        </div>

        <div className="space-y-4 border rounded-md p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Bloque B (Día a Día)</h4>
            <Switch
              checked={blockBEnabled}
              onCheckedChange={(checked: boolean) =>
                setValue('policies.block_b.enabled', checked)
              }
            />
          </div>
          {blockBEnabled && (
            <>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="policies.block_b.enable_single_days">
                  Permitir solicitud día a día
                </FieldLabel>
                <FieldContent>
                  <Switch
                    id="policies.block_b.enable_single_days"
                    checked={enableSingleDays}
                    onCheckedChange={(checked: boolean) =>
                      setValue('policies.block_b.enable_single_days', checked)
                    }
                  />
                  <FieldError
                    errors={[errors.policies?.block_b?.enable_single_days]}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="policies.block_b.required_weekends">
                  Fines de semana requeridos
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="policies.block_b.required_weekends"
                    type="number"
                    {...register('policies.block_b.required_weekends', {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError
                    errors={[errors.policies?.block_b?.required_weekends]}
                  />
                </FieldContent>
              </Field>
            </>
          )}
        </div>
      </div>
      <Separator />
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
