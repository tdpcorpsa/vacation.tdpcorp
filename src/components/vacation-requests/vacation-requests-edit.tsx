'use client'

import { VacationRequestsForm } from './vacation-requests-form'
import { useVacationRequestsUpdate } from '@/hooks/vacation-requests/use-vacation-requests-update'
import {
  VacationRequestSchema,
  VacationRequestSchemaType,
} from '@/schemas/vacation-requests.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
import { Tables } from '@/types/supabase.types'

interface VacationRequestsEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request?: Tables<{ schema: 'vacation' }, 'vacation_requests'>
}

export function VacationRequestsEdit({
  open,
  onOpenChange,
  request,
}: VacationRequestsEditProps) {
  const { mutate, isPending } = useVacationRequestsUpdate()

  const form = useForm<VacationRequestSchemaType>({
    resolver: zodResolver(VacationRequestSchema),
    defaultValues: request
      ? {
          employee_id: request.employee_id,
          start_date: request.start_date,
          end_date: request.end_date,
          request_note: request.request_note || '',
          vacation_period_id: request.vacation_period_id,
          total_days: request.total_days,
        }
      : {
          employee_id: '',
          start_date: '',
          end_date: '',
          request_note: '',
          vacation_period_id: '',
          total_days: 1,
        },
  })

  useEffect(() => {
    if (request && open) {
      form.reset({
        employee_id: request.employee_id,
        start_date: request.start_date,
        end_date: request.end_date,
        request_note: request.request_note || '',
        vacation_period_id: request.vacation_period_id,
        total_days: request.total_days,
      })
    }
  }, [request, open, form])

  const onSubmit = (data: VacationRequestSchemaType) => {
    if (!request) return

    mutate(
      {
        id: request.id,
        data,
      },
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
          <SheetTitle>Editar Solicitud</SheetTitle>
          <SheetDescription>
            Modifique los campos de la solicitud.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-4 px-4"
          >
            <VacationRequestsForm />
            <SheetFooter className="px-0">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
