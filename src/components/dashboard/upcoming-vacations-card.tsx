import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plane, Eye } from 'lucide-react'
import { VacationRequest } from '@/hooks/dashboard/use-dashboard-data'
import { useRouter } from 'next/navigation'

interface UpcomingVacationsCardProps {
  upcomingVacations: VacationRequest[]
  onCreateRequest: () => void
  isOnVacation?: boolean
  currentVacation?: VacationRequest | null
}

export function UpcomingVacationsCard({
  upcomingVacations,
  onCreateRequest,
  isOnVacation = false,
  currentVacation,
}: UpcomingVacationsCardProps) {
  const router = useRouter()

  const getDaysUntil = (date: string) => {
    const today = new Date()
    const start = new Date(date)
    const diffMs = start.getTime() - today.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }

  const getRemainingDays = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    // Add 1 day because the end date is inclusive
    const diffMs = end.getTime() - today.getTime()
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  }

  return (
    <Card className="lg:col-span-3 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Plane className="h-4 w-4 text-sky-500" />
          {isOnVacation ? '¡Estás de Vacaciones!' : 'Próximas Vacaciones'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isOnVacation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-2 bg-sky-50 dark:bg-sky-950/30 rounded-lg border border-sky-100 dark:border-sky-800">
            <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <Plane className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sky-700 dark:text-sky-300">
                Disfruta tu tiempo libre
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Desconéctate y recarga energías.
              </p>
              {currentVacation && (
                <div className="mt-3 text-sm text-sky-800 dark:text-sky-200 bg-sky-100/50 dark:bg-sky-900/30 px-3 py-1.5 rounded-full inline-block">
                  <span className="font-medium">
                    {getRemainingDays(currentVacation.end_date)} días restantes
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-xs opacity-80">
                    Hasta el {new Date(currentVacation.end_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
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
        )}
        <div className="mt-4">
          <Button
            className="w-full bg-black text-white hover:bg-black/90 dark:bg:white dark:text-black dark:hover:bg-white/90 transition-all hover:scale-[1.02] shadow-sm"
            size="sm"
            onClick={onCreateRequest}
          >
            {isOnVacation
              ? 'Solicitar más vacaciones'
              : 'Solicita tus próximas vacaciones'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
