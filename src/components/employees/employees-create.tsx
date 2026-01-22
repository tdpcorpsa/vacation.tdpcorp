'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'
import { EmployeeSchema, EmployeeFormValues } from '@/schemas/employees.schema'
import { useEmployeesCreate } from '@/hooks/employees/use-employees-create'
import { EmployeesForm } from './employees-form'

export function EmployeesCreate() {
  const [open, setOpen] = useState(false)
  const createMutation = useEmployeesCreate()

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      id: '',
      labor_regime_id: '',
      hire_date: '',
      manager_id: null,
    },
  })

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      await createMutation.mutateAsync(values)
      setOpen(false)
      form.reset()
    } catch (_) {
      // Error handled in hook
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Empleado
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Crear Empleado</SheetTitle>
          <SheetDescription>
            Agregue un nuevo empleado al sistema.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <EmployeesForm mode="create" />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
