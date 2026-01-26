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
import { useEffect, useState } from 'react'
import usePerms from '@/hooks/auth/use-perms'
import useUser from '@/hooks/auth/use-user'
import { format, differenceInDays } from 'date-fns'
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
import { DateRange } from 'react-day-picker'

export function VacationRequestsForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useFormContext()

  const { canAccess } = usePerms()
  const { data: user } = useUser()

  // Permisos
  const canReadAll = canAccess('vacation', 'employees', 'read')
  const canReadOwn = canAccess('vacation', 'employees', 'readId')

  const employeeId = watch('employee_id')
  const { data: periods, isLoading: isLoadingPeriods } = useVacationPeriodsList({
    employeeId,
  })
  const { data: employees, isLoading: isLoadingEmployees } = useEmployeesList()

  const startDate = watch('start_date')
  const endDate = watch('end_date')
  const totalDays = watch('total_days')
  const vacationPeriodId = watch('vacation_period_id')

  const selectedPeriod = periods?.data?.find((p) => p.id === vacationPeriodId)

  // 1. Lógica de Empleado
  const [hasSetDefaultEmployee, setHasSetDefaultEmployee] = useState(false)

  useEffect(() => {
    // Esperar a que tengamos usuario y empleados cargados
    if (!user?.id || !employees?.data?.length) return

    // Si ya seteamos el default, no sobrescribir (permite al admin cambiar)
    if (hasSetDefaultEmployee) return

    // Verificar si el usuario actual está en la lista de empleados
    const userInList = employees.data.find((e) => e.id === user.id)

    // Si está en la lista y no hay selección actual, seleccionar al usuario
    if (userInList && !employeeId) {
      setValue('employee_id', user.id)
      setHasSetDefaultEmployee(true)
    } else if (employeeId) {
      // Si ya hay un valor (por persistencia o algo), marcar como seteado
      setHasSetDefaultEmployee(true)
    }
  }, [user, employees, employeeId, setValue, hasSetDefaultEmployee])

  // 2. Lógica de Periodo Automático
  useEffect(() => {
    if (periods?.data?.length) {
      // Ordenar por fecha de fin descendente para obtener el más reciente
      const sortedPeriods = [...periods.data].sort((a, b) => {
        return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
      })
      const mostRecentPeriod = sortedPeriods[0]

      if (mostRecentPeriod && mostRecentPeriod.id !== vacationPeriodId) {
        setValue('vacation_period_id', mostRecentPeriod.id)
      }
    }
  }, [periods, vacationPeriodId, setValue])

  // 3. Validaciones
  useEffect(() => {
    // Validar días disponibles
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

    // Validar fecha de inicio >= hoy
    if (startDate) {
      const start = new Date(startDate)
      // Ajustar a medianoche local para comparar con hoy medianoche local
      // Pero startDate viene como YYYY-MM-DD string, si hacemos new Date(str) es UTC.
      // Mejor usar el parsing consistente:
      const [y, m, d] = startDate.split('-').map(Number)
      const startLocal = new Date(y, m - 1, d)
      startLocal.setHours(0, 0, 0, 0)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startLocal < today) {
        if (errors.start_date?.type !== 'manual') {
          setError('start_date', {
            type: 'manual',
            message: 'La fecha de inicio no puede ser anterior a hoy',
          })
        }
      } else {
        if (errors.start_date?.type === 'manual') {
          clearErrors('start_date')
        }
      }
    }
  }, [
    totalDays,
    selectedPeriod,
    startDate,
    setError,
    clearErrors,
    errors.total_days,
    errors.start_date,
  ])

  // Manejo del Calendario Range
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (startDate && endDate) {
      // Ajustar fechas para evitar problemas de zona horaria al parsear 'YYYY-MM-DD'
      // new Date('2024-01-01') asume UTC, al mostrar en local puede ser día anterior
      // Mejor usar: new Date(year, monthIndex, day)
      const parseDate = (str: string) => {
        const [y, m, d] = str.split('-').map(Number)
        return new Date(y, m - 1, d)
      }
      return {
        from: parseDate(startDate),
        to: parseDate(endDate),
      }
    }
    return undefined
  })

  // Sincronizar estado local si cambian los valores del form externamente (reset)
  useEffect(() => {
    if (!startDate && !endDate) {
      setDateRange(undefined)
    }
  }, [startDate, endDate])

  const onSelectDate = (range: DateRange | undefined) => {
    setDateRange(range)

    if (range?.from) {
      setValue('start_date', format(range.from, 'yyyy-MM-dd'))
    } else {
      setValue('start_date', '')
    }

    if (range?.to) {
      setValue('end_date', format(range.to, 'yyyy-MM-dd'))
      if (range.from) {
        const days = differenceInDays(range.to, range.from) + 1
        setValue('total_days', days)
      }
    } else {
      // Si solo seleccionó fecha inicio
      setValue('end_date', '')
      if (range?.from) {
        setValue('total_days', 1)
        // Opcional: setear end_date igual a start_date para consistencia visual si se desea
        setValue('end_date', format(range.from, 'yyyy-MM-dd'))
      } else {
        setValue('total_days', 0)
      }
    }
  }

  // Registrar campos ocultos para validación
  // start_date y end_date se registran vía inputs ocultos abajo
  // total_days, vacation_period_id y employee_id tienen sus propios inputs/selects

  return (
    <div className="space-y-4">
      {/* Campo Empleado */}
      <Field>
        <FieldLabel htmlFor="employee_id">Empleado</FieldLabel>
        <FieldContent>
          {canReadAll ? (
            <select
              id="employee_id"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('employee_id')}
              value={employeeId || ''}
              disabled={!canReadAll}
            >
              <option value="" disabled hidden>
                Seleccione un empleado
              </option>
              {employees?.data?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.profile?.first_name} {emp.profile?.last_name}
                </option>
              ))}
            </select>
          ) : (
            <>
              {isLoadingEmployees ? (
                <div className="h-9 w-full rounded-md bg-muted animate-pulse" />
              ) : (
                <Input
                  value={(() => {
                    const emp = employees?.data?.find(
                      (e) => e.id === employeeId
                    )
                    return emp
                      ? `${emp.profile?.first_name || ''} ${
                          emp.profile?.last_name || ''
                        }`.trim()
                      : 'Cargando...'
                  })()}
                  disabled
                  className="disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-muted disabled:text-foreground font-semibold"
                />
              )}
              <input type="hidden" {...register('employee_id')} />
            </>
          )}
          <FieldError errors={[errors.employee_id]} />
        </FieldContent>
      </Field>

      {/* Campo Periodo Vacacional */}
      <Field>
        <FieldLabel htmlFor="vacation_period_id">Periodo Vacacional</FieldLabel>
        <FieldContent>
          {isLoadingPeriods ? (
            <div className="h-9 w-full rounded-md bg-muted animate-pulse" />
          ) : (
            <Input
              value={
                periods?.data?.find((p) => p.id === vacationPeriodId)
                  ? `${
                      periods.data.find((p) => p.id === vacationPeriodId)
                        ?.period_label
                    } (${
                      periods.data.find((p) => p.id === vacationPeriodId)
                        ?.available_days
                    } días disponibles)`
                  : 'Sin periodo activo'
              }
              disabled
              className="disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-muted disabled:text-foreground font-semibold"
            />
          )}
          <input type="hidden" {...register('vacation_period_id')} />
          <FieldError errors={[errors.vacation_period_id]} />
        </FieldContent>
      </Field>

      {/* Campo Fechas (Calendar Range) */}
      <Field>
        <FieldLabel>Fechas de Vacaciones</FieldLabel>
        <FieldContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd MMM yyyy', { locale: es })} -{' '}
                      {format(dateRange.to, 'dd MMM yyyy', { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, 'dd MMM yyyy', { locale: es })
                  )
                ) : (
                  <span>Seleccione un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onSelectDate}
                numberOfMonths={2}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today
                }}
              />
            </PopoverContent>
          </Popover>
          {/* Inputs ocultos para validación de fechas */}
          <input type="hidden" {...register('start_date')} />
          <input type="hidden" {...register('end_date')} />
          {/* Mostrar errores de start_date o end_date */}
          <FieldError errors={[errors.start_date, errors.end_date]} />
        </FieldContent>
      </Field>

      {/* Campo Días Totales (Readonly) */}
      <Field>
        <FieldLabel htmlFor="total_days">Días Totales</FieldLabel>
        <FieldContent>
          <Input
            id="total_days"
            type="number"
            {...register('total_days', { valueAsNumber: true })}
            disabled
            className="disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-muted disabled:text-foreground font-semibold"
          />
          <FieldError errors={[errors.total_days]} />
        </FieldContent>
      </Field>

      {/* Campo Nota */}
      <Field>
        <FieldLabel htmlFor="request_note">Nota</FieldLabel>
        <FieldContent>
          <Input
            id="request_note"
            maxLength={150}
            {...register('request_note')}
          />
          <FieldError errors={[errors.request_note]} />
        </FieldContent>
      </Field>
    </div>
  )
}
