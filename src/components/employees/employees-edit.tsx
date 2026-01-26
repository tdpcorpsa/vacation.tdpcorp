'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { EmployeeSchema, EmployeeFormValues } from '@/schemas/employees.schema'
import { useEmployeesUpdate } from '@/hooks/employees/use-employees-update'
import { EmployeesForm } from './employees-form'
import { EmployeeWithUser } from '@/hooks/employees/use-employees-list'

interface EmployeesEditProps {
  employee: EmployeeWithUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeesEdit({
  employee,
  open,
  onOpenChange,
}: EmployeesEditProps) {
  const updateMutation = useEmployeesUpdate()

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      id: employee.id,
      labor_regime_id: employee.labor_regime_id || '',
      hire_date: employee.hire_date || '',
      manager_id: employee.manager_id || null,
    },
  })

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      await updateMutation.mutateAsync(values)
      onOpenChange(false)
    } catch (_) {
      // Error handled in hook
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar Empleado</SheetTitle>
          <SheetDescription>Modifique los datos del empleado.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4 px-4">
            <EmployeesForm mode="edit" currentEmployeeId={employee.id} />
            <SheetFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="w-full">
                {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
