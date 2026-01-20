import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'

interface HrPlanningTabProps {
  requests: EnrichedVacationRequest[]
}

export function HrPlanningTab({ requests }: HrPlanningTabProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const upcomingRequests = requests
    .filter(
      (r) => r.status === 'APPROVED' && new Date(r.start_date) > new Date()
    )
    .slice(0, 9)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planificación de Ausencias</CardTitle>
        <CardDescription>
          Calendario de próximas vacaciones aprobadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded bg-primary/10 text-primary font-bold text-xs">
                <span>{new Date(req.start_date).getDate()}</span>
                <span className="uppercase text-[10px]">
                  {new Date(req.start_date).toLocaleString('es-ES', {
                    month: 'short',
                  })}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {req.employeeProfile?.first_name}{' '}
                  {req.employeeProfile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {req.total_days} días · Hasta {formatDate(req.end_date)}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  Reg. {req.employeeLaborRegime?.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        {upcomingRequests.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No hay vacaciones futuras programadas.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
