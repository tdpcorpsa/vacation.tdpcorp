import { useMemo } from 'react'
import {
  differenceInDays,
  eachDayOfInterval,
  format,
  getDay,
  isSameMonth,
  isToday,
  max,
  min,
  startOfDay,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CalendarEvent } from './planning-types'

interface PositionedEvent extends CalendarEvent {
  colStart: number // 0-6
  colSpan: number // 1-7
  row: number // Vertical stack index
}

interface WeekRowProps {
  weekStart: Date
  weekEnd: Date
  events: CalendarEvent[]
  currentMonth: Date
  selectedRequestIds: string[]
}

export function WeekRow({
  weekStart,
  weekEnd,
  events,
  currentMonth,
  selectedRequestIds,
}: WeekRowProps) {
  const MAX_VISIBLE_ROWS = 4

  // 1. Encontrar eventos que caen en esta semana
  const { visibleEvents, overflowByCol } = useMemo(() => {
    const overlapping = events.filter((evt) => {
      return evt.start <= weekEnd && evt.end >= weekStart
    })

    // 2. Calcular posición horizontal (colStart, colSpan)
    const positioned: PositionedEvent[] = overlapping.map((evt) => {
      // Normalizamos a inicio del día para evitar problemas con horas (23:59 vs 00:00)
      const start = startOfDay(max([evt.start, weekStart]))
      const end = startOfDay(min([evt.end, weekEnd]))

      const colStart = differenceInDays(start, startOfDay(weekStart))
      const colSpan = differenceInDays(end, start) + 1

      return {
        ...evt,
        colStart,
        colSpan,
        row: 0, // Se calculará después
      }
    })

    // 3. Ordenar por prioridad (seleccionado primero) y luego lógica visual
    positioned.sort((a, b) => {
      // Prioridad absoluta al seleccionado
      const isSelectedA = selectedRequestIds.includes(a.id)
      const isSelectedB = selectedRequestIds.includes(b.id)
      if (isSelectedA && !isSelectedB) return -1
      if (!isSelectedA && isSelectedB) return 1

      if (a.colStart !== b.colStart) return a.colStart - b.colStart
      return b.colSpan - a.colSpan
    })

    // 4. Calcular posición vertical (stacking)
    const grid: (string | null)[][] = Array(7)
      .fill(null)
      .map(() => []) // 7 columnas, n filas
    const maxRows = 100 // Límite interno alto para cálculo correcto

    positioned.forEach((evt) => {
      let rowIndex = 0
      while (rowIndex < maxRows) {
        let isRowFree = true
        for (let col = evt.colStart; col < evt.colStart + evt.colSpan; col++) {
          if (grid[col][rowIndex]) {
            isRowFree = false
            break
          }
        }

        if (isRowFree) {
          evt.row = rowIndex
          for (
            let col = evt.colStart;
            col < evt.colStart + evt.colSpan;
            col++
          ) {
            while (grid[col].length <= rowIndex) grid[col].push(null)
            grid[col][rowIndex] = evt.id
          }
          break
        }
        rowIndex++
      }
    })

    // Separar visibles y ocultos
    const visible = positioned.filter((evt) => evt.row < MAX_VISIBLE_ROWS)
    const hidden = positioned.filter((evt) => evt.row >= MAX_VISIBLE_ROWS)

    // Agrupar ocultos por columna
    const overflow: CalendarEvent[][] = Array(7)
      .fill(null)
      .map(() => [])
    hidden.forEach((evt) => {
      for (let i = evt.colStart; i < evt.colStart + evt.colSpan; i++) {
        if (i >= 0 && i < 7) {
          overflow[i].push(evt)
        }
      }
    })

    return { visibleEvents: visible, overflowByCol: overflow }
  }, [weekStart, weekEnd, events, selectedRequestIds])

  // Altura dinámica basada en el contenido
  const maxRowIndex =
    visibleEvents.length > 0 ? Math.max(...visibleEvents.map((e) => e.row)) : -1
  const hasOverflow = overflowByCol.some((arr) => arr.length > 0)

  // Si hay overflow, usamos el máximo + espacio para indicador. Si no, usamos lo que ocupen los eventos.
  // Mínimo 3 filas de altura (aprox 130px) para mantener consistencia visual en semanas vacías
  const rowsToShow = hasOverflow
    ? MAX_VISIBLE_ROWS + 1
    : Math.max(3, maxRowIndex + 1)

  const rowHeight = rowsToShow * 30 + 40 // 30px por fila + 40px padding inferior/superior

  // Generar días para el fondo
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  return (
    <div className="relative border-b" style={{ height: `${rowHeight}px` }}>
      {/* Grid de fondo (Celdas de días) */}
      <div className="absolute inset-0 grid grid-cols-7 h-full">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isDayToday = isToday(day)
          const isWeekend = getDay(day) === 0 || getDay(day) === 6

          return (
            <div
              key={day.toString()}
              className={cn(
                'h-full border-r relative p-2 transition-colors',
                !isCurrentMonth && 'bg-muted/10',
                isDayToday && 'bg-primary/5', // Sutil highlight para hoy
                isWeekend && isCurrentMonth && 'bg-muted/5' // Diferenciar fin de semana
              )}
            >
              <span
                className={cn(
                  'block text-right text-sm font-medium',
                  isDayToday
                    ? 'text-primary font-bold'
                    : isCurrentMonth
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {format(day, 'd')}
              </span>
            </div>
          )
        })}
      </div>

      {/* Capa de Eventos */}
      <div className="absolute inset-0 grid grid-cols-7 pointer-events-none pt-8 px-1">
        {/* Contenedor relativo para posicionar eventos absolutos dentro de la grid */}
        <div className="col-span-7 relative h-full">
          {visibleEvents.map((evt) => {
            const isSelected = selectedRequestIds.includes(evt.id)
            const isDimmed = selectedRequestIds.length > 0 && !isSelected

            return (
              <div
                key={`${evt.id}-${weekStart.toISOString()}`}
                className={cn(
                  'absolute h-7 rounded px-2 flex items-center shadow-sm transition-all duration-200 pointer-events-auto cursor-pointer',
                  evt.color,
                  'text-white text-xs font-medium truncate select-none hover:brightness-110 hover:z-50 hover:shadow-md',
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-primary z-40 brightness-110 shadow-lg'
                    : 'z-10',
                  isDimmed &&
                    'opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                )}
                style={{
                  left: `${(evt.colStart / 7) * 100}%`,
                  top: `${evt.row * 30}px`, // 28px height + 2px gap
                  // Añadir un pequeño margen horizontal visual
                  marginLeft: '2px',
                  width: `calc(${(evt.colSpan / 7) * 100}% - 4px)`,
                }}
                title={`${evt.title} (${format(evt.start, 'd MMM')} - ${format(
                  evt.end,
                  'd MMM'
                )})`}
              >
                {evt.title}
              </div>
            )
          })}

          {/* Overflow Indicators */}
          {overflowByCol.map((events, colIndex) => {
            if (events.length === 0) return null

            const uniqueEvents = Array.from(new Set(events.map((e) => e.id))).map(
              (id) => events.find((e) => e.id === id)!
            )

            return (
              <div
                key={`overflow-${colIndex}`}
                className="absolute h-7 px-1 flex items-center justify-center z-20 pointer-events-auto"
                style={{
                  left: `${(colIndex / 7) * 100}%`,
                  top: `${MAX_VISIBLE_ROWS * 30}px`,
                  width: `${(1 / 7) * 100}%`,
                }}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="bg-muted/80 backdrop-blur-sm text-muted-foreground text-[10px] font-medium px-1 rounded-sm cursor-help hover:bg-muted w-full text-center border border-border flex items-center justify-center h-full transition-colors">
                        +{uniqueEvents.length} más
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="p-0 overflow-hidden border-border z-50"
                    >
                      <div className="bg-muted px-3 py-1.5 border-b text-xs font-medium text-muted-foreground">
                        {uniqueEvents.length} vacaciones más
                      </div>
                      <div className="p-2 flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                        {uniqueEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className="text-xs flex items-center gap-2 min-w-[150px]"
                          >
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full shrink-0',
                                evt.color.split(' ')[0]
                              )}
                            />
                            <span className="truncate font-medium">
                              {evt.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
