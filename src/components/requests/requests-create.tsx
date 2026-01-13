'use client'

import { RequestsForm } from './requests-form'
import { useRequestsCreate } from '@/hooks/requests/use-requests-create'
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
import useUser from '@/hooks/auth/use-user'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface RequestsCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestsCreate({ open, onOpenChange }: RequestsCreateProps) {
  const { mutate, isPending } = useRequestsCreate()
  const { data: user } = useUser()

  const form = useForm<RequestSchemaType>({
    resolver: zodResolver(RequestSchema),
    defaultValues: {
      total_days: 0,
    },
  })

  const onSubmit = (data: RequestSchemaType) => {
    // Si hay un empleado seleccionado manualmente, usamos ese ID, si no, usamos el del usuario logueado
    const targetEmployeeId = data.employee_id || user?.id

    if (!targetEmployeeId) {
      toast.error('No se pudo identificar al empleado')
      return
    }

    if (!user?.id) {
      toast.error('No se pudo identificar al usuario creador')
      return
    }

    mutate(
      {
        ...data,
        employee_id: targetEmployeeId,
        created_by: user.id,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      }
    )
  }

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Crear Solicitud</SheetTitle>
          <SheetDescription>
            Complete los campos para crear una nueva solicitud de vacaciones.
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
