'use client'

import { VacationPeriodsForm } from './vacation-periods-form'
import { useVacationPeriodsCreate } from '@/hooks/vacation-periods/use-vacation-periods-create'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

type VacationPeriodsCreateProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VacationPeriodsCreate({
  open,
  onOpenChange,
}: VacationPeriodsCreateProps) {
  const { mutate, isPending } = useVacationPeriodsCreate()
  const form = useForm<VacationPeriodFormValues>({
    resolver: zodResolver(VacationPeriodSchema) as any,
    defaultValues: {
      employee_id: '',
      period_label: '',
      start_date: '',
      end_date: '',
      total_days: 0,
      available_days: 0,
    },
  })

  const onSubmit = (data: VacationPeriodFormValues) => {
    mutate(data, {
      onSuccess: () => {
        onOpenChange(false)
        form.reset()
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Crear Periodo Vacacional</SheetTitle>
          <SheetDescription>
            Ingrese los detalles del nuevo periodo vacacional.
          </SheetDescription>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            id="create-vacation-period-form"
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
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Creando...' : 'Crear'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
