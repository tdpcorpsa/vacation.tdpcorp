'use client'

import { EmployeesList } from '@/components/employees/employees-list'
import { EmployeesCreate } from '@/components/employees/employees-create'
import { PageHeader } from '@/components/ui/page-header'
import CanAccess from '@/components/ui/can-access'

export default function EmployeesPage() {
  return (
    <CanAccess
      subdomain="vacation"
      resource="employees"
      action="read"
      variant="page"
      fallbackReadId={false}
    >
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Empleados"
          description="Gestión de empleados de la empresa."
          actions={
            <CanAccess
              subdomain="vacation"
              resource="employees"
              action="create"
              variant="hidden"
            >
              <EmployeesCreate />
            </CanAccess>
          }
        />
        <div className="flex-1 p-4 pt-0">
          <EmployeesList />
        </div>
      </div>
    </CanAccess>
  )
}
