'use client'

import { VacationRequestsForm } from './vacation-requests-form'
import { useVacationRequestsCreate } from '@/hooks/vacation-requests/use-vacation-requests-create'
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
import useUser from '@/hooks/auth/use-user'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface VacationRequestsCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VacationRequestsCreate({
  open,
  onOpenChange,
}: VacationRequestsCreateProps) {
  const { mutate, isPending } = useVacationRequestsCreate()
  const { data: user } = useUser()

  const form = useForm<VacationRequestSchemaType>({
    resolver: zodResolver(VacationRequestSchema),
    defaultValues: {
      total_days: 0,
    },
  })

  const onSubmit = (data: VacationRequestSchemaType) => {
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
