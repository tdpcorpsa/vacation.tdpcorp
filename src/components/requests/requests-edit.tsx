'use client'

import { RequestsForm } from './requests-form'
import { useRequestsUpdate } from '@/hooks/requests/use-requests-update'
import { RequestSchema, RequestSchemaType } from '@/schemas/requests.schema'
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

interface RequestsEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request?: Tables<{ schema: 'vacation' }, 'vacation_requests'>
}

export function RequestsEdit({
  open,
  onOpenChange,
  request,
}: RequestsEditProps) {
  const { mutate, isPending } = useRequestsUpdate()

  const form = useForm<RequestSchemaType>({
    resolver: zodResolver(RequestSchema),
  })

  useEffect(() => {
    if (request && open) {
      form.reset({
        start_date: request.start_date,
        end_date: request.end_date,
        request_note: request.request_note || '',
        vacation_period_id: request.vacation_period_id,
        total_days: request.total_days,
      })
    }
  }, [request, open, form])

  const onSubmit = (data: RequestSchemaType) => {
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
            <RequestsForm />
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
