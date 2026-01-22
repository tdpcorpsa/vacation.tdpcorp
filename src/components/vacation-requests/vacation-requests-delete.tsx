'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useVacationRequestsDelete } from '@/hooks/vacation-requests/use-vacation-requests-delete'
import { Tables } from '@/types/supabase.types'

interface VacationRequestsDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request?: Tables<{ schema: 'vacation' }, 'vacation_requests'>
}

export function VacationRequestsDelete({
  open,
  onOpenChange,
  request,
}: VacationRequestsDeleteProps) {
  const { mutate } = useVacationRequestsDelete()

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
