'use client'

import { useEmployeesList } from '@/hooks/employees/use-employees-list'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useFormContext, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function VacationPeriodsForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  const { data: employees } = useEmployeesList()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="employee_id">Empleado</FieldLabel>
        <FieldContent>
          <select
            id="employee_id"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('employee_id')}
          >
            <option value="">Seleccione un empleado</option>
            {employees?.data?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.profile.first_name} {employee.profile.last_name} (
                {employee.profile.email})
              </option>
            ))}
          </select>
          <FieldError errors={[errors.employee_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="period_label">Etiqueta del Periodo</FieldLabel>
        <FieldContent>
          <Input
            id="period_label"
            placeholder="Ej. 2024-2025"
            {...register('period_label')}
          />
          <FieldError errors={[errors.period_label]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="start_date">Fecha Inicio</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value + 'T00:00:00'), 'PPP', {
                          locale: es,
                        })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? new Date(field.value + 'T00:00:00')
                          : undefined
                      }
                      onSelect={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError errors={[errors.start_date]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="end_date">Fecha Fin</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="end_date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value + 'T00:00:00'), 'PPP', {
                          locale: es,
                        })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? new Date(field.value + 'T00:00:00')
                          : undefined
                      }
                      onSelect={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError errors={[errors.end_date]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="total_days">Días Totales</FieldLabel>
          <FieldContent>
            <Input
              id="total_days"
              type="number"
              min={0}
              {...register('total_days', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.total_days]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="available_days">Días Disponibles</FieldLabel>
          <FieldContent>
            <Input
              id="available_days"
              type="number"
              min={0}
              {...register('available_days', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.available_days]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  )
}
