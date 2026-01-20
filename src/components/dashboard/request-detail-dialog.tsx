'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { VacationRequest, VacationPeriod } from '@/hooks/dashboard/use-dashboard-data'
import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'
import { getStatusColor, getStatusLabel } from './utils'

interface RequestDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: VacationRequest | EnrichedVacationRequest | null
  periods: VacationPeriod[]
}

export function RequestDetailDialog({
  open,
  onOpenChange,
  request,
  periods,
}: RequestDetailDialogProps) {
  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalle de Solicitud</DialogTitle>
          <DialogDescription>
            Información detallada de la solicitud de vacaciones.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">
              Periodo
            </h4>
            <p className="text-sm font-medium">
              {periods.find((p) => p.id === request.vacation_period_id)
                ?.period_label || 'Sin etiqueta'}{' '}
              (
              {periods.find((p) => p.id === request.vacation_period_id)
                ? `${new Date(
                    periods.find(
                      (p) => p.id === request.vacation_period_id
                    )!.start_date
                  ).toLocaleDateString()} - ${new Date(
                    periods.find(
                      (p) => p.id === request.vacation_period_id
                    )!.end_date
                  ).toLocaleDateString()}`
                : '-'}
              )
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Desde
              </h4>
              <p className="text-sm font-medium">
                {new Date(request.start_date).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Hasta
              </h4>
              <p className="text-sm font-medium">
                {new Date(request.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Días Solicitados
              </h4>
              <p className="text-sm font-medium">{request.total_days}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Estado
              </h4>
              <Badge
                variant="secondary"
                className={cn(
                  'font-normal',
                  getStatusColor(request.status)
                )}
              >
                {getStatusLabel(request.status)}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Tiempo de decisión
              </h4>
              <p className="text-sm">
                {request.decided_at
                  ? `${Math.max(
                      0,
                      Math.round(
                        (new Date(request.decided_at).getTime() -
                          new Date(request.submitted_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )} días`
                  : 'Aún sin decisión'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Fecha de creación
              </h4>
              <p className="text-sm">
                {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Última actualización
              </h4>
              <p className="text-sm">
                {new Date(request.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
          {request.request_note && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Nota de Solicitud
              </h4>
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                {request.request_note}
              </p>
            </div>
          )}
          {request.response_note && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Nota de Respuesta
              </h4>
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                {request.response_note}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
