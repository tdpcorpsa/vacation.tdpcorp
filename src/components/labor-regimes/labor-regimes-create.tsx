'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'
import { LaborRegimeSchema } from '@/schemas/labor-regimes.schema'
import { useLaborRegimesCreate } from '@/hooks/labor-regimes/use-labor-regimes-create'
import { LaborRegimeForm } from './labor-regimes-form'

export function LaborRegimeCreate() {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useLaborRegimesCreate()

  const form = useForm<LaborRegimeSchema>({
    resolver: zodResolver(LaborRegimeSchema),
    defaultValues: {
      name: '',
      days: 30,
      is_active: true,
    },
  })

  const onSubmit = (data: LaborRegimeSchema) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Régimen
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-lg">
        <SheetHeader>
          <SheetTitle>Crear Régimen Laboral</SheetTitle>
          <SheetDescription>
            Ingrese los datos del nuevo régimen laboral.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-6"
          >
            <LaborRegimeForm />
            <SheetFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
