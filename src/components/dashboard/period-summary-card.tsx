import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, CalendarDays, CheckCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VacationPeriod } from '@/hooks/dashboard/use-dashboard-data'

export interface PeriodTotals {
  totalDays: number
  availableDays: number
  usedDays: number
  percentage: number
  startDate: Date
  endDate: Date
  label: string
}

interface PeriodSummaryCardProps {
  selectedPeriodId: string
  setSelectedPeriodId: (id: string) => void
  periods: VacationPeriod[]
  periodTotals: PeriodTotals | null
}

export function PeriodSummaryCard({
  selectedPeriodId,
  setSelectedPeriodId,
  periods,
  periodTotals,
}: PeriodSummaryCardProps) {
  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600 dark:text-green-400'
    if (percentage < 80) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <Card className="lg:col-span-6 h-full flex flex-col overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="bg-muted/30 py-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Periodo Vacacional</CardTitle>
            <CardDescription>
              Resumen de días disponibles y usados.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
            <CalendarDays className="ml-2 h-4 w-4 text-muted-foreground" />
            <Select
              value={selectedPeriodId}
              onValueChange={setSelectedPeriodId}
            >
              <SelectTrigger className="w-[200px] border-0 shadow-none focus:ring-0 font-medium">
                <SelectValue placeholder="Seleccionar periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los periodos</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {new Date(period.start_date).getFullYear()} -{' '}
                    {new Date(period.end_date).getFullYear()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 pt-1 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-2 mb-1">
          <span>
            Desde:{' '}
            <span className="font-medium text-foreground">
              {periodTotals ? periodTotals.startDate.toLocaleDateString() : '-'}
            </span>
          </span>
          <span className="hidden md:inline text-muted-foreground/30 mx-2">
            |
          </span>
          <span>
            Hasta:{' '}
            <span className="font-medium text-foreground">
              {periodTotals ? periodTotals.endDate.toLocaleDateString() : '-'}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center items-center">
          <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-muted/20 border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Días Totales
              </span>
              <Calendar className="h-4 w-4 text-muted-foreground opacity-70" />
            </div>
            <span className="text-3xl font-bold">
              {periodTotals?.totalDays ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-green-50/50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Días Disponibles
              </span>
              <CheckCircle className="h-4 w-4 text-green-500 opacity-70" />
            </div>
            <span className="text-3xl font-bold text-green-700 dark:text-green-400">
              {periodTotals?.availableDays ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Días Usados
              </span>
              <Clock className="h-4 w-4 text-blue-500 opacity-70" />
            </div>
            <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {periodTotals?.usedDays ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1 p-4 rounded-lg border bg-background shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className="text-sm font-medium text-muted-foreground">
              Consumo
            </span>
            <span
              className={cn(
                'text-4xl font-extrabold',
                periodTotals
                  ? getPercentageColor(periodTotals.percentage)
                  : 'text-muted-foreground'
              )}
            >
              {periodTotals ? `${periodTotals.percentage}%` : '-'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
