'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LaborRegimeEdit } from './labor-regimes-edit'
import { LaborRegimeDelete } from './labor-regimes-delete'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

type LaborRegime = Tables<{ schema: 'vacation' }, 'labor_regime'>

interface LaborRegimeActionsProps {
  item: LaborRegime
}

export function LaborRegimeActions({ item }: LaborRegimeActionsProps) {
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
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <CanAccess
            subdomain="vacation"
            resource="labor_regime"
            action="update"
            variant="hidden"
          >
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>
          <CanAccess
            subdomain="vacation"
            resource="labor_regime"
            action="delete"
            variant="hidden"
          >
            <DropdownMenuItem
              onClick={() => setOpenDelete(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <LaborRegimeEdit item={item} open={openEdit} onOpenChange={setOpenEdit} />
      <LaborRegimeDelete
        item={item}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  )
}
