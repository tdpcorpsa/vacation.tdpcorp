import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VacationRequest } from '@/hooks/dashboard/use-dashboard-data'

export type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

interface RequestsSummaryCardProps {
  statusFilter: StatusFilter
  setStatusFilter: (status: StatusFilter) => void
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalRequests: number
  averageDays: number
  lastPending: VacationRequest | null
}

export function RequestsSummaryCard({
  statusFilter,
  setStatusFilter,
  pendingCount,
  approvedCount,
  rejectedCount,
  totalRequests,
  averageDays,
  lastPending,
}: RequestsSummaryCardProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resumen de Solicitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <button
            type="button"
            onClick={() =>
              setStatusFilter(statusFilter === 'PENDING' ? 'ALL' : 'PENDING')
            }
            className={cn(
              'flex items-center justify-between p-2 rounded-md border bg-yellow-50/50 border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20 text-left w-full transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md',
              statusFilter === 'PENDING' &&
                'ring-2 ring-yellow-300 border-yellow-400'
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                Pendientes
              </span>
            </div>
            <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
              {pendingCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              setStatusFilter(statusFilter === 'APPROVED' ? 'ALL' : 'APPROVED')
            }
            className={cn(
              'flex items-center justify-between p-2 rounded-md border bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20 text-left w-full transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md',
              statusFilter === 'APPROVED' &&
                'ring-2 ring-green-300 border-green-400'
            )}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Aprobadas
              </span>
            </div>
            <span className="text-lg font-bold text-green-700 dark:text-green-400">
              {approvedCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              setStatusFilter(statusFilter === 'REJECTED' ? 'ALL' : 'REJECTED')
            }
            className={cn(
              'flex items-center justify-between p-2 rounded-md border bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20 text-left w-full transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md',
              statusFilter === 'REJECTED' &&
                'ring-2 ring-red-300 border-red-400'
            )}
          >
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Rechazadas
              </span>
            </div>
            <span className="text-lg font-bold text-red-700 dark:text-red-400">
              {rejectedCount}
            </span>
          </button>
          <div className="flex items-center justify-between p-2 rounded-md border bg-muted/40">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Total solicitudes
              </span>
              <span className="text-[11px] text-muted-foreground">
                Promedio de días por solicitud: {averageDays}
              </span>
            </div>
            <span className="text-lg font-bold">{totalRequests}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md border bg-muted/30 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Última solicitud pendiente
              </span>
              <span className="text-[11px] text-muted-foreground">
                {lastPending
                  ? new Date(
                      lastPending.submitted_at || lastPending.created_at
                    ).toLocaleDateString()
                  : 'Sin pendientes'}
              </span>
            </div>
            {lastPending && (
              <Badge variant="outline" className="text-[10px]">
                Pendiente
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
