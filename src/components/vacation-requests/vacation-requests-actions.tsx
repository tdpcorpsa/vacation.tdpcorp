'use client'

import { VacationRequestsDelete } from './vacation-requests-delete'
import { VacationRequestsEdit } from './vacation-requests-edit'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useVacationRequestsSendEmail } from '@/hooks/vacation-requests/use-vacation-requests-send-email'
import { useVacationRequestsSubmit } from '@/hooks/vacation-requests/use-vacation-requests-submit'
import { Tables } from '@/types/supabase.types'
import { Edit, Mail, MoreHorizontal, Trash, Eye } from 'lucide-react'
import { useState } from 'react'
import CanAccess from '@/components/ui/can-access'

interface VacationRequestsActionsProps {
  request: Tables<{ schema: 'vacation' }, 'vacation_requests'>
  onViewDetail?: () => void
}

export function VacationRequestsActions({
  request,
  onViewDetail,
}: VacationRequestsActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    useVacationRequestsSendEmail()
  const { mutateAsync: submitRequest, isPending: isSubmitting } =
    useVacationRequestsSubmit()

  const isDraft = request.status === 'DRAFT'

  const handleSendToBoss = async () => {
    try {
      await sendEmail(request.id)
      await submitRequest(request.id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onViewDetail && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onViewDetail()
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalles
            </DropdownMenuItem>
          )}
          {isDraft && (
            <>
              <CanAccess
                subdomain="vacation"
                resource="vacation_requests"
                action="update"
                variant="hidden"
              >
                <DropdownMenuItem onClick={() => setShowEdit(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </CanAccess>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleSendToBoss()
                }}
                disabled={isSendingEmail || isSubmitting}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isSendingEmail || isSubmitting ? 'Enviando...' : 'Enviar al Jefe'}
              </DropdownMenuItem>
              <CanAccess
                subdomain="vacation"
                resource="vacation_requests"
                action="delete"
                variant="hidden"
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDelete(true)
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </CanAccess>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <VacationRequestsEdit
        open={showEdit}
        onOpenChange={setShowEdit}
        request={request}
      />
      <VacationRequestsDelete
        open={showDelete}
        onOpenChange={setShowDelete}
        request={request}
      />
    </>
  )
}
