'use client'

import { RequestsDelete } from './requests-delete'
import { RequestsEdit } from './requests-edit'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/supabase.types'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useState } from 'react'

interface RequestsActionsProps {
  request: Tables<{ schema: 'vacation' }, 'vacation_requests'>
}

export function RequestsActions({ request }: RequestsActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDelete(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RequestsEdit
        open={showEdit}
        onOpenChange={setShowEdit}
        request={request}
      />
      <RequestsDelete
        open={showDelete}
        onOpenChange={setShowDelete}
        request={request}
      />
    </>
  )
}
