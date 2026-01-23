'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { VacationRequestWithProfiles } from '@/hooks/vacation-requests/use-vacation-requests-list'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusColor, getStatusLabel } from './utils'

interface VacationRequestsViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request?: VacationRequestWithProfiles
}

export function VacationRequestsView({
  open,
  onOpenChange,
  request,
}: VacationRequestsViewProps) {
  if (!request) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Detalle de Solicitud</SheetTitle>
          <SheetDescription>
            Información completa de la solicitud y su estado.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Estado
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    request.status === 'APPROVED'
                      ? 'default'
                      : request.status === 'REJECTED'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {request.status === 'APPROVED'
                    ? 'Aprobado'
                    : request.status === 'REJECTED'
                      ? 'Rechazado'
                      : 'Pendiente'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Días Totales
              </label>
              <p className="text-sm font-medium">{request.total_days}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Empleado
              </label>
              <p className="text-sm font-medium">
                {request.employee_profile
                  ? `${request.employee_profile.first_name} ${request.employee_profile.last_name}`
                  : 'Desconocido'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p
                className="text-sm truncate"
                title={request.employee_profile?.email || ''}
              >
                {request.employee_profile?.email || '-'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Fecha Inicio
              </label>
              <p className="text-sm">
                {format(new Date(request.start_date), 'PPP', { locale: es })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Fecha Fin
              </label>
              <p className="text-sm">
                {format(new Date(request.end_date), 'PPP', { locale: es })}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nota de Solicitud
            </label>
            <p className="text-sm p-2 bg-muted/50 rounded-md mt-1">
              {request.request_note || 'Sin nota'}
            </p>
          </div>

          {(request.status === 'APPROVED' || request.status === 'REJECTED') && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm">
                Información de Resolución
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Resuelto por
                  </label>
                  <p className="text-sm font-medium">
                    {request.approver_profile
                      ? `${request.approver_profile.first_name} ${request.approver_profile.last_name}`
                      : 'Sistema'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha
                  </label>
                  <p className="text-sm">
                    {request.decided_at
                      ? format(new Date(request.decided_at), 'PPP p', {
                          locale: es,
                        })
                      : '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Razón / Nota de Respuesta
                </label>
                <p className="text-sm p-2 bg-muted/50 rounded-md mt-1">
                  {request.response_note || 'Sin detalles adicionales'}
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
