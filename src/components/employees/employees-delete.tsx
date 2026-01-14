'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useEmployeesDelete } from '@/hooks/employees/use-employees-delete'
import { Tables } from '@/types/supabase.types'

type Employee = Tables<{ schema: 'vacation' }, 'employees'>

interface EmployeesDeleteProps {
  employee: Employee
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeesDelete({
  employee,
  open,
  onOpenChange,
}: EmployeesDeleteProps) {
  const deleteMutation = useEmployeesDelete()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(employee.id)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="¿Estás seguro?"
      description="Esta acción no se puede deshacer. Esto eliminará permanentemente al empleado."
      confirmWord="ELIMINAR"
      variant="destructive"
      onConfirm={handleDelete}
    />
  )
}
