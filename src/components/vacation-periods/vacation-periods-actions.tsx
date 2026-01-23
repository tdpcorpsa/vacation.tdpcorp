'use client'

import { VacationPeriodsDelete } from './vacation-periods-delete'
import { VacationPeriodsEdit } from './vacation-periods-edit'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/supabase.types'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useState } from 'react'
import CanAccess from '@/components/ui/can-access'

type VacationPeriodsActionsProps = {
  vacationPeriod: Tables<{ schema: 'vacation' }, 'vacation_periods'>
}

export function VacationPeriodsActions({
  vacationPeriod,
}: VacationPeriodsActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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
          <CanAccess
            subdomain="vacation"
            resource="vacation_periods"
            action="update"
            variant="hidden"
          >
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>
          <CanAccess
            subdomain="vacation"
            resource="vacation_periods"
            action="delete"
            variant="hidden"
          >
            <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <VacationPeriodsEdit
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        vacationPeriod={vacationPeriod}
      />

      <VacationPeriodsDelete
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        id={vacationPeriod.id}
      />
    </>
  )
}
