import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plane, Eye } from 'lucide-react'
import { VacationRequest } from '@/hooks/dashboard/use-dashboard-data'
import { useRouter } from 'next/navigation'

interface UpcomingVacationsCardProps {
  upcomingVacations: VacationRequest[]
}

export function UpcomingVacationsCard({
  upcomingVacations,
}: UpcomingVacationsCardProps) {
  const router = useRouter()

  const getDaysUntil = (date: string) => {
    const today = new Date()
    const start = new Date(date)
    const diffMs = start.getTime() - today.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }

  return (
    <Card className="lg:col-span-3 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Plane className="h-4 w-4 text-sky-500" />
          Próximas Vacaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {upcomingVacations.length > 0 ? (
            upcomingVacations.slice(0, 1).map((vacation) => (
              <div
                key={vacation.id}
                className="flex flex-col gap-1 rounded-md border p-3 shadow-sm text-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group"
                title="Ver detalle de vacación"
              >
                <div className="flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1 bg-green-50 text-green-700 border-green-200"
                  >
                    Programado
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {vacation.total_days} días
                    </span>
                    <p className="font-medium text-xs mt-1">
                      {new Date(vacation.start_date).toLocaleDateString()} -{' '}
                      {new Date(vacation.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      En {getDaysUntil(vacation.start_date)} días empiezan
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No hay próximas vacaciones.
            </p>
          )}
        </div>
        <div className="mt-4">
          <Button
            className="w-full bg-black text-white hover:bg-black/90 dark:bg:white dark:text-black dark:hover:bg-white/90 transition-all hover:scale-[1.02] shadow-sm"
            size="sm"
            onClick={() => router.push('/vacation-requests?action=create')}
          >
            Solicita tus próximas vacaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
