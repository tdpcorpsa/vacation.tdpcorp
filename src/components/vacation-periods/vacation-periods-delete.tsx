'use client'

import { useVacationPeriodsDelete } from '@/hooks/vacation-periods/use-vacation-periods-delete'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'

type VacationPeriodsDeleteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
}

export function VacationPeriodsDelete({
  open,
  onOpenChange,
  id,
}: VacationPeriodsDeleteProps) {
  const { mutate } = useVacationPeriodsDelete()

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="¿Estás seguro?"
      description="Esta acción no se puede deshacer. Esto eliminará permanentemente el periodo vacacional."
      confirmWord="ELIMINAR"
      variant="destructive"
      onConfirm={() =>
        mutate(id, {
          onSuccess: () => onOpenChange(false),
        })
      }
    />
  )
}
