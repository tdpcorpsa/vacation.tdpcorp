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
import useProfile from '@/hooks/auth/use-profile'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { 
  Calendar,
  Clock,
  CheckCircle2, 
  XCircle, 
  User, 
  Send, 
  FileText,
  History,
  PlusCircle
} from 'lucide-react'

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
  const { data: userProfile } = useProfile()

  const { data: creatorProfile } = useQuery({
    queryKey: ['profile', request?.created_by],
    queryFn: async () => {
      if (!request?.created_by) return null
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', request.created_by)
        .single()
      return data
    },
    enabled: !!request?.created_by,
  })

  const { data: deciderProfile } = useQuery({
    queryKey: ['profile', request?.decided_by],
    queryFn: async () => {
      if (!request?.decided_by) return null
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', request.decided_by)
        .single()
      return data
    },
    enabled: !!request?.decided_by,
  })

  if (!request) return null

  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-'
    try {
      return format(new Date(dateStr), 'd MMM yyyy, h:mm a', { locale: es })
    } catch {
      return '-'
    }
  }

  const formatDateOnly = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMM yyyy', { locale: es })
    } catch {
      return dateStr
    }
  }

  const getCreatorName = () => {
    if (creatorProfile) {
      return `${creatorProfile.first_name} ${creatorProfile.last_name}`
    }
    if ('createdByUser' in request && request.createdByUser) {
      return `${request.createdByUser.first_name} ${request.createdByUser.last_name}`
    }
    return 'Usuario'
  }

  const getDeciderName = () => {
    if (deciderProfile) {
      return `${deciderProfile.first_name} ${deciderProfile.last_name}`
    }
    if ('decidedByUser' in request && request.decidedByUser) {
      return `${request.decidedByUser.first_name} ${request.decidedByUser.last_name}`
    }
    return 'Administrador'
  }

  const getSubmittedByName = () => {
    // Temporalmente usamos el usuario en sesión
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`
    }
    return 'Usuario'
  }

  const period = periods.find((p) => p.id === request.vacation_period_id)
  
  const getPeriodYears = () => {
    if (!period) return ''
    try {
      const startYear = new Date(period.start_date).getFullYear()
      const endYear = new Date(period.end_date).getFullYear()
      return `${startYear}-${endYear}`
    } catch {
      return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between pr-4">
            <DialogTitle>Detalle de Solicitud</DialogTitle>
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
          <DialogDescription>
            Información completa y seguimiento de la solicitud.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden gap-6 py-2">
          {/* Resumen Principal */}
          <div className="bg-muted/30 p-4 rounded-lg border space-y-4 shrink-0">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Fechas de Vacaciones</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-foreground">
                  {formatDateOnly(request.start_date)} - {formatDateOnly(request.end_date)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground ml-7">
                Duración: {request.total_days} días
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm pt-2 border-t border-muted/50">
              <span className="text-muted-foreground">Periodo:</span>
              <Badge variant="outline" className="font-medium bg-background">
                 {getPeriodYears() ? `${getPeriodYears()}` : 'Sin etiqueta'}
              </Badge>
            </div>
          </div>

          {/* Línea de Tiempo de Eventos */}
          <div className="flex flex-col flex-1 min-h-0 space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2 shrink-0">
              <History className="h-4 w-4" />
              Historial de Eventos
            </h4>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="relative ml-2 min-h-full">
                {/* Línea vertical conectora */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-muted" />

                <div className="space-y-8 pb-4">
                  {/* Evento: Decisión (si existe) */}
                  {request.status !== 'PENDING' && request.decided_at && (
                    <div className="relative pl-12">
                      <span className="absolute left-0 top-0 h-8 w-8 rounded-full border bg-background flex items-center justify-center z-10">
                        {request.status === 'APPROVED' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold mt-1">
                          {request.status === 'APPROVED' ? 'Solicitud Aprobada' : 'Solicitud Rechazada'}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(request.decided_at)}
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>Decidido por: <span className="font-medium">{getDeciderName()}</span></span>
                        </div>
                        {request.response_note && (
                           <div className="mt-2 text-sm bg-muted/50 p-2 rounded border border-muted/50">
                              <div className="flex items-start gap-2">
                                 <FileText className="h-3 w-3 mt-1 text-muted-foreground shrink-0" />
                                 <p className="text-xs italic">"{request.response_note}"</p>
                              </div>
                           </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Estado Pendiente */}
                  {request.status === 'PENDING' && (
                     <div className="relative pl-12">
                        <span className="absolute left-0 top-0 h-8 w-8 rounded-full border bg-background flex items-center justify-center z-10">
                           <Clock className="h-4 w-4 text-yellow-500" />
                        </span>
                        <div className="flex flex-col gap-1">
                           <span className="text-sm font-semibold text-muted-foreground mt-1">En espera de respuesta...</span>
                        </div>
                     </div>
                  )}

                  {/* Evento: Envío (solo si fue enviada) */}
                  {(request.status !== 'DRAFT' || request.submitted_at) && (
                    <div className="relative pl-12">
                      <span className="absolute left-0 top-0 h-8 w-8 rounded-full border bg-background flex items-center justify-center z-10">
                        <Send className="h-4 w-4 text-blue-500" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold mt-1">Solicitud Enviada</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(request.submitted_at)}
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>Enviado por: <span className="font-medium">{getSubmittedByName()}</span></span>
                        </div>
                        {request.request_note && (
                           <div className="mt-2 text-sm bg-muted/50 p-2 rounded border border-muted/50">
                              <div className="flex items-start gap-2">
                                 <FileText className="h-3 w-3 mt-1 text-muted-foreground shrink-0" />
                                 <p className="text-xs italic">"{request.request_note}"</p>
                              </div>
                           </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Evento: Creación */}
                  <div className="relative pl-12">
                    <span className="absolute left-0 top-0 h-8 w-8 rounded-full border bg-background flex items-center justify-center z-10">
                      <PlusCircle className="h-4 w-4 text-slate-500" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-600 mt-1">Solicitud Creada</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(request.created_at)}
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>Creado por: <span className="font-medium">{getCreatorName()}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
