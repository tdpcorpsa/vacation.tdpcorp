'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEmployeesList } from '@/hooks/employees/use-employees-list'

interface EmployeesSelectProps {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export function EmployeesSelect({
  value,
  onValueChange,
  disabled,
}: EmployeesSelectProps) {
  const { data, isLoading } = useEmployeesList({
    pagination: { page: 1, pageSize: 1000 },
  })

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Seleccionar empleado..." />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="p-2 text-sm text-muted-foreground">Cargando...</div>
        ) : (
          data?.data.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.profile.first_name} {employee.profile.last_name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
