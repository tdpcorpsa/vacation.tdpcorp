'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmployeesEdit } from './employees-edit'
import { EmployeesDelete } from './employees-delete'
import { EmployeeWithUser } from '@/hooks/employees/use-employees-list'

interface EmployeesActionsProps {
  employee: EmployeeWithUser
}

export function EmployeesActions({ employee }: EmployeesActionsProps) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openEdit && (
        <EmployeesEdit
          employee={employee}
          open={openEdit}
          onOpenChange={setOpenEdit}
        />
      )}

      {openDelete && (
        <EmployeesDelete
          employee={employee}
          open={openDelete}
          onOpenChange={setOpenDelete}
        />
      )}
    </>
  )
}
