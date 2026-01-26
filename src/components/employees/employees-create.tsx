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
  SheetFooter,
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
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Crear Empleado</SheetTitle>
          <SheetDescription>
            Agregue un nuevo empleado al sistema.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4 px-4">
            <EmployeesForm mode="create" />
            <SheetFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
