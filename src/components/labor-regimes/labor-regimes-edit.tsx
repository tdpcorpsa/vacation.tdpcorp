'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

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
import { LaborRegimeSchema } from '@/schemas/labor-regimes.schema'
import { useLaborRegimesUpdate } from '@/hooks/labor-regimes/use-labor-regimes-update'
import { LaborRegimeForm } from './labor-regimes-form'
import { Tables } from '@/types/supabase.types'
import { ScrollArea } from '../ui/scroll-area'

type LaborRegime = Tables<{ schema: 'vacation' }, 'labor_regime'>

interface LaborRegimeEditProps {
  item: LaborRegime
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LaborRegimeEdit({
  item,
  open,
  onOpenChange,
}: LaborRegimeEditProps) {
  const { mutate, isPending } = useLaborRegimesUpdate()

  const form = useForm<LaborRegimeSchema>({
    resolver: zodResolver(LaborRegimeSchema),
    defaultValues: {
      name: item.name,
      days: item.days,
      is_active: item.is_active,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: item.name,
        days: item.days,
        is_active: item.is_active,
      })
    }
  }, [item, form, open])

  const onSubmit = (data: LaborRegimeSchema) => {
    mutate(
      { id: item.id, data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-lg">
        <ScrollArea className="h-[calc(100vh-90px)]">
          <SheetHeader>
            <SheetTitle>Editar Régimen Laboral</SheetTitle>
            <SheetDescription>
              Modifique los datos del régimen laboral.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-6 pb-10"
            >
              <LaborRegimeForm />
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter>
          <Button
            type="submit"
            disabled={isPending}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
