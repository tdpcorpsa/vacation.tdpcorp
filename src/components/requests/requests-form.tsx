'use client'

import { useVacationPeriodsList } from '@/hooks/vacation-periods/use-vacation-periods-list'
import { useEmployeesList } from '@/hooks/employees/use-employees-list'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

export function RequestsForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const { data: periods } = useVacationPeriodsList()
  const { data: employees } = useEmployeesList()

  const startDate = watch('start_date')
  const endDate = watch('end_date')

  // Cálculo automático de días (simple)
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      if (!isNaN(diffDays) && diffDays > 0) {
        setValue('total_days', diffDays)
      }
    }
  }, [startDate, endDate, setValue])

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="employee_id">Empleado (Temporal)</FieldLabel>
        <FieldContent>
          <select
            id="employee_id"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('employee_id')}
          >
            <option value="">Seleccione un empleado</option>
            {employees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.profile?.first_name} {emp.profile?.last_name} ({emp.profile?.email})
              </option>
            ))}
          </select>
          <FieldError errors={[errors.employee_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="vacation_period_id">Periodo Vacacional</FieldLabel>
        <FieldContent>
          <select
            id="vacation_period_id"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('vacation_period_id')}
          >
            <option value="">Seleccione un periodo</option>
            {periods?.map((period) => (
              <option key={period.id} value={period.id}>
                {period.period_label} ({period.available_days} días disponibles)
              </option>
            ))}
          </select>
          <FieldError errors={[errors.vacation_period_id]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="start_date">Fecha Inicio</FieldLabel>
          <FieldContent>
            <Input id="start_date" type="date" {...register('start_date')} />
            <FieldError errors={[errors.start_date]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="end_date">Fecha Fin</FieldLabel>
          <FieldContent>
            <Input id="end_date" type="date" {...register('end_date')} />
            <FieldError errors={[errors.end_date]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="total_days">Días Totales</FieldLabel>
        <FieldContent>
          <Input
            id="total_days"
            type="number"
            {...register('total_days', { valueAsNumber: true })}
          />
          <FieldError errors={[errors.total_days]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="request_note">Nota</FieldLabel>
        <FieldContent>
          <Input id="request_note" {...register('request_note')} />
          <FieldError errors={[errors.request_note]} />
        </FieldContent>
      </Field>
    </div>
  )
}
