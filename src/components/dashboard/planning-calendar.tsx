import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'
import { Button } from '@/components/ui/button'
import {
  addMonths,
  addDays,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  endOfDay,
  endOfMonth,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { WeekRow } from './planning-week-row'
import { CalendarEvent } from './planning-types'

interface PlanningCalendarProps {
  requests: EnrichedVacationRequest[]
  selectedRequestId: string | null
}

// Paleta de colores vibrantes estilo "Google Calendar" o similar
const EVENT_COLORS = [
  'bg-indigo-900 border-indigo-900', // Oscuro (ej. Ignacio)
  'bg-cyan-500 border-cyan-500', // Turquesa (ej. Natalia)
  'bg-rose-400 border-rose-400', // Rosa (ej. Ramiro)
  'bg-pink-500 border-pink-500', // Fucsia (ej. Juan)
  'bg-red-800 border-red-800', // Rojo oscuro (ej. Ana)
  'bg-emerald-500 border-emerald-500',
  'bg-amber-500 border-amber-500',
  'bg-violet-600 border-violet-600',
]

const getEventColor = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return EVENT_COLORS[Math.abs(hash) % EVENT_COLORS.length]
}

export function PlanningCalendar({
  requests,
  selectedRequestId,
}: PlanningCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Sincronizar mes con la selección
  useEffect(() => {
    if (selectedRequestId) {
      const req = requests.find((r) => r.id === selectedRequestId)
      if (req) {
        setCurrentDate(new Date(req.start_date))
      }
    }
  }, [selectedRequestId, requests])

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToday = () => setCurrentDate(new Date())

  // Preparar eventos
  const events: CalendarEvent[] = useMemo(() => {
    return requests
      .filter((req) => req.status === 'APPROVED')
      .map((req) => {
        // Asegurar fechas en zona horaria local para evitar desfases
        // Asumimos que la fecha viene en formato YYYY-MM-DD
        const parseLocalDate = (dateStr: string) => {
          if (!dateStr) return new Date()
          // Si viene solo fecha YYYY-MM-DD
          if (dateStr.includes('T')) {
            return new Date(dateStr)
          }
          const [y, m, d] = dateStr.split('-').map(Number)
          return new Date(y, m - 1, d)
        }

        return {
          id: req.id,
          title: `${req.employeeProfile?.first_name} ${req.employeeProfile?.last_name}`,
          start: parseLocalDate(req.start_date),
          end: endOfDay(parseLocalDate(req.end_date)),
          color: getEventColor(req.employee_id),
          original: req,
        }
      })
  }, [requests])

  // Generar grid del mes
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  // Generar semanas
  const weeks = []
  let day = startDate
  while (day <= endDate) {
    const weekStart = day
    const weekEnd = endOfWeek(day, { weekStartsOn: 0 })
    weeks.push({ start: weekStart, end: weekEnd })
    day = addDays(day, 7)
  }

  const weekDays = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border shadow-sm overflow-hidden font-sans">
      {/* Header Estilo App */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-8 w-8 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={goToday}
            variant="ghost"
            className="h-8 text-sm font-normal px-4 rounded"
          >
            Hoy
          </Button>
        </div>

        <h2 className="text-xl font-medium text-foreground">
          {format(currentDate, 'MMMM', { locale: es }).charAt(0).toUpperCase() +
            format(currentDate, 'MMMM', { locale: es }).slice(1)}{' '}
          del {format(currentDate, 'yyyy')}
        </h2>

        {/* Placeholder div to maintain layout balance if needed, or just empty */}
        <div className="w-[100px]"></div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 flex flex-col bg-card">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-[0.8rem] font-normal text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks Rows */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {weeks.map((week, weekIdx) => (
            <WeekRow
              key={weekIdx}
              weekStart={week.start}
              weekEnd={week.end}
              events={events}
              currentMonth={currentDate}
              selectedRequestId={selectedRequestId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
