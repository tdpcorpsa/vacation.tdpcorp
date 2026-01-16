'use client'

import { VacationPeriodsForm } from './vacation-periods-form'
import { useVacationPeriodsUpdate } from '@/hooks/vacation-periods/use-vacation-periods-update'
import {
  VacationPeriodFormValues,
  VacationPeriodSchema,
} from '@/schemas/vacation-periods.schema'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tables } from '@/types/supabase.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

type VacationPeriodsEditProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vacationPeriod: Tables<{ schema: 'vacation' }, 'vacation_periods'>
}

export function VacationPeriodsEdit({
  open,
  onOpenChange,
  vacationPeriod,
}: VacationPeriodsEditProps) {
  const { mutate, isPending } = useVacationPeriodsUpdate()
  const form = useForm<VacationPeriodFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(VacationPeriodSchema) as any,
    defaultValues: {
      employee_id: vacationPeriod.employee_id,
      period_label: vacationPeriod.period_label,
      start_date: vacationPeriod.start_date,
      end_date: vacationPeriod.end_date,
      total_days: vacationPeriod.total_days,
      available_days: vacationPeriod.available_days,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        employee_id: vacationPeriod.employee_id,
        period_label: vacationPeriod.period_label,
        start_date: vacationPeriod.start_date,
        end_date: vacationPeriod.end_date,
        total_days: vacationPeriod.total_days,
        available_days: vacationPeriod.available_days,
      })
    }
  }, [open, vacationPeriod, form])

  const onSubmit = (data: VacationPeriodFormValues) => {
    mutate(
      { id: vacationPeriod.id, data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar Periodo Vacacional</SheetTitle>
          <SheetDescription>
            Modifique los detalles del periodo vacacional.
          </SheetDescription>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            id="edit-vacation-period-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-4 px-4"
          >
            <VacationPeriodsForm />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                type="button"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
