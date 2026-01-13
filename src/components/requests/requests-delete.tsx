'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useRequestsDelete } from '@/hooks/requests/use-requests-delete'
import { Tables } from '@/types/supabase.types'

interface RequestsDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request?: Tables<{ schema: 'vacation' }, 'vacation_requests'>
}

export function RequestsDelete({
  open,
  onOpenChange,
  request,
}: RequestsDeleteProps) {
  const { mutate } = useRequestsDelete()

  if (!request) return null

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar Solicitud"
      description={`¿Estás seguro que deseas eliminar la solicitud de vacaciones del ${request.start_date} al ${request.end_date}?`}
      confirmWord="ELIMINAR"
      variant="destructive"
      onConfirm={() => {
        mutate(request.id)
        onOpenChange(false)
      }}
    />
  )
}
