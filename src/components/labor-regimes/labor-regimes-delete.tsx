'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useLaborRegimesDelete } from '@/hooks/labor-regimes/use-labor-regimes-delete'
import { Tables } from '@/types/supabase.types'

type LaborRegime = Tables<{ schema: 'vacation' }, 'labor_regime'>

interface LaborRegimeDeleteProps {
  item: LaborRegime
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LaborRegimeDelete({
  item,
  open,
  onOpenChange,
}: LaborRegimeDeleteProps) {
  const { mutate, isPending } = useLaborRegimesDelete()

  const onConfirm = () => {
    mutate(item.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="¿Estás seguro?"
      description={`Esta acción eliminará el régimen laboral "${item.name}". Esta acción no se puede deshacer.`}
      onConfirm={onConfirm}
      confirmWord="ELIMINAR"
      variant="destructive"
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
    />
  )
}
