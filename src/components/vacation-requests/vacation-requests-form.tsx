'use client'

import { useVacationPeriodsList } from '@/hooks/vacation-periods/use-vacation-periods-list'
import { useEmployeesList } from '@/hooks/employees/use-employees-list'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

export function VacationRequestsForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useFormContext()

  const employeeId = watch('employee_id')
  const { data: periods } = useVacationPeriodsList({ employeeId })
  const { data: employees } = useEmployeesList()

  const startDate = watch('start_date')
  const endDate = watch('end_date')
  const totalDays = watch('total_days')
  const vacationPeriodId = watch('vacation_period_id')

  const selectedPeriod = periods?.data?.find((p) => p.id === vacationPeriodId)

  // Validar que los días solicitados no excedan los disponibles
  useEffect(() => {
    if (selectedPeriod && totalDays > selectedPeriod.available_days) {
      if (
        errors.total_days?.message !==
        `El periodo solo tiene ${selectedPeriod.available_days} días disponibles`
      ) {
        setError('total_days', {
          type: 'manual',
          message: `El periodo solo tiene ${selectedPeriod.available_days} días disponibles`,
        })
      }
    } else {
      if (errors.total_days?.type === 'manual') {
        clearErrors('total_days')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDays, selectedPeriod, setError, clearErrors])

  const addDays = (dateStr: string, days: number): string => {
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    date.setDate(date.getDate() + days)
    const newY = date.getFullYear()
    const newM = String(date.getMonth() + 1).padStart(2, '0')
    const newD = String(date.getDate()).padStart(2, '0')
    return `${newY}-${newM}-${newD}`
  }

  const diffDays = (startStr: string, endStr: string): number => {
    const [y1, m1, d1] = startStr.split('-').map(Number)
    const [y2, m2, d2] = endStr.split('-').map(Number)
    const date1 = new Date(y1, m1 - 1, d1)
    const date2 = new Date(y2, m2 - 1, d2)
    const diffTime = date2.getTime() - date1.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const { onChange: onDaysChange, ...daysRegister } = register('total_days', {
    valueAsNumber: true,
  })
  const { onChange: onStartChange, ...startRegister } = register('start_date')
  const { onChange: onEndChange, ...endRegister } = register('end_date')

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
            {employees?.data?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.profile?.first_name} {emp.profile?.last_name} (
                {emp.profile?.email})
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
            {periods?.data?.map((period) => (
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
            <Input
              id="start_date"
              type="date"
              {...startRegister}
              onChange={(e) => {
                onStartChange(e)
                const newStart = e.target.value
                // Si cambiamos fecha inicio, mantenemos los días y actualizamos fecha fin
                if (newStart && totalDays > 0) {
                  const newEndDate = addDays(newStart, totalDays - 1)
                  setValue('end_date', newEndDate)
                } else if (newStart && endDate) {
                  // Si no hay días pero hay fecha fin, calculamos días
                  const days = diffDays(newStart, endDate)
                  if (days > 0) setValue('total_days', days)
                }
              }}
            />
            <FieldError errors={[errors.start_date]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="end_date">Fecha Fin</FieldLabel>
          <FieldContent>
            <Input
              id="end_date"
              type="date"
              {...endRegister}
              onChange={(e) => {
                onEndChange(e)
                const newEnd = e.target.value
                // Si cambiamos fecha fin, recalculamos días (manteniendo fecha inicio)
                if (startDate && newEnd) {
                  const days = diffDays(startDate, newEnd)
                  if (days > 0) setValue('total_days', days)
                }
              }}
            />
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
            min={1}
            {...daysRegister}
            onChange={(e) => {
              onDaysChange(e)
              let days = parseInt(e.target.value) || 0
              if (days < 0) {
                days = 0
                setValue('total_days', 0)
                return
              }
              // Si cambiamos días, actualizamos fecha fin (manteniendo fecha inicio)
              if (startDate && days > 0) {
                const newEndDate = addDays(startDate, days - 1)
                setValue('end_date', newEndDate)
              }
            }}
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
