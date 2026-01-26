'use client'

import { Controller, useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useLaborRegimeList } from '@/hooks/employees/use-labor-regime-list'
import { usePotentialEmployees } from '@/hooks/employees/use-potential-employees'
import { useManagersList } from '@/hooks/employees/use-managers-list'
import { EmployeeFormValues } from '@/schemas/employees.schema'

interface EmployeesFormProps {
  mode: 'create' | 'edit'
  currentEmployeeId?: string
}

export function EmployeesForm({ mode, currentEmployeeId }: EmployeesFormProps) {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<EmployeeFormValues>()

  const { data: laborRegimes } = useLaborRegimeList()
  const { data: potentialEmployees } = usePotentialEmployees()
  const { data: managers } = useManagersList()

  const filteredManagers = managers?.filter(
    (manager) => manager.id !== currentEmployeeId
  )

  return (
    <div className="space-y-4">
      {/* Employee (User) - Only for Create */}
      {mode === 'create' && (
        <Field>
          <FieldLabel htmlFor="id">Usuario</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="id"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <SelectTrigger id="id" className="w-full">
                    <SelectValue placeholder="Seleccione un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {potentialEmployees?.map((user) => (
                      <SelectItem key={user.id} value={user.id!}>
                        {user.first_name} {user.last_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.id]} />
          </FieldContent>
        </Field>
      )}

      {/* Hire Date */}
      <Field>
        <FieldLabel htmlFor="hire_date">Fecha de Contratación</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="hire_date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(
                        (() => {
                          const [y, m, d] = field.value.split('-').map(Number)
                          return new Date(y, m - 1, d)
                        })(),
                        'PPP',
                        { locale: es }
                      )
                    ) : (
                      <span>Seleccione una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value
                        ? (() => {
                            const [y, m, d] = field.value.split('-').map(Number)
                            return new Date(y, m - 1, d)
                          })()
                        : undefined
                    }
                    onSelect={(date) =>
                      field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <FieldError errors={[errors.hire_date]} />
        </FieldContent>
      </Field>

      {/* Labor Regime */}
      <Field>
        <FieldLabel htmlFor="labor_regime_id">Régimen Laboral</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="labor_regime_id"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="labor_regime_id" className="w-full">
                  <SelectValue placeholder="Seleccione un régimen" />
                </SelectTrigger>
                <SelectContent>
                  {laborRegimes?.map((regime) => (
                    <SelectItem key={regime.id} value={regime.id}>
                      {regime.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.labor_regime_id]} />
        </FieldContent>
      </Field>

      {/* Manager */}
      <Field>
        <FieldLabel htmlFor="manager_id">Jefe Directo</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="manager_id"
            render={({ field }) => (
              <Select
                onValueChange={(val) =>
                  field.onChange(val === 'none' ? null : val)
                }
                value={field.value || 'none'}
              >
                <SelectTrigger id="manager_id" className="w-full">
                  <SelectValue placeholder="Seleccione un jefe (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {filteredManagers?.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.user?.first_name} {manager.user?.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.manager_id]} />
        </FieldContent>
      </Field>
    </div>
  )
}
