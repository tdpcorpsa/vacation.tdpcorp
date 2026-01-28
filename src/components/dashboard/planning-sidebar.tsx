import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { format, differenceInCalendarDays, isWithinInterval, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { SearchInput } from '@/components/ui/search-input'
import { useQueryState, parseAsString } from 'nuqs'
import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, CalendarDays, Eraser, Files } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PlanningSidebarProps {
  requests: EnrichedVacationRequest[]
  selectedRequestIds: string[]
  onSelectRequest: (id: string | null) => void
}

export function PlanningSidebar({
  requests,
  selectedRequestIds,
  onSelectRequest,
}: PlanningSidebarProps) {
  const [search, setSearch] = useQueryState(
    'planning_search',
    parseAsString.withDefault('').withOptions({ shallow: true, throttleMs: 300 })
  )

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (empId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setExpandedGroups((prev) => ({ ...prev, [empId]: !prev[empId] }))
  }

  // Agrupar y filtrar
  const groupedRequests = useMemo(() => {
    // 1. Filtrar
    const filtered = requests.filter((r) => {
      if (!search) return true
      const fullName =
        `${r.employeeProfile?.first_name || ''} ${r.employeeProfile?.last_name || ''}`.toLowerCase()
      return fullName.includes(search.toLowerCase())
    })

    // 2. Agrupar por empleado
    const groups: Record<string, EnrichedVacationRequest[]> = {}
    filtered.forEach((r) => {
      const empId = r.employee_id
      if (!groups[empId]) groups[empId] = []
      groups[empId].push(r)
    })

    // 3. Ordenar solicitudes dentro de los grupos (Más reciente primero)
    Object.values(groups).forEach((group) => {
      group.sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      )
    })

    // 4. Crear array de grupos y ordenar por la solicitud más reciente del grupo
    const groupArray = Object.entries(groups).map(([empId, reqs]) => ({
      empId,
      employee: reqs[0].employeeProfile,
      requests: reqs,
      latestDate: new Date(reqs[0].start_date).getTime(),
    }))

    // Ordenar grupos por fecha de solicitud más reciente
    groupArray.sort((a, b) => b.latestDate - a.latestDate)

    return groupArray
  }, [requests, search])

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    return `${format(s, 'd MMM', { locale: es })} - ${format(e, 'd MMM', { locale: es })}`
  }

  const getDaysRemainingText = (start: string, end: string) => {
    const today = startOfDay(new Date())
    const startDate = startOfDay(new Date(start))
    const endDate = startOfDay(new Date(end))

    if (isWithinInterval(today, { start: startDate, end: endDate })) {
      const remaining = differenceInCalendarDays(endDate, today)
      return { text: `Quedan ${remaining} días`, type: 'ongoing' as const }
    } else if (today < startDate) {
      const startsIn = differenceInCalendarDays(startDate, today)
      return { text: `Inicia en ${startsIn} días`, type: 'upcoming' as const }
    }
    return null
  }

  const RequestInfo = ({ request }: { request: EnrichedVacationRequest }) => {
    const remaining = getDaysRemainingText(request.start_date, request.end_date)
    
    return (
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex items-center gap-2 text-xs text-foreground/90">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="font-medium truncate">
            {formatDateRange(request.start_date, request.end_date)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className="text-[10px] h-5 px-2 font-medium bg-background border-muted-foreground/30 text-muted-foreground"
          >
            {request.total_days}d
          </Badge>
          
          {remaining && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-[10px] h-5 px-2 font-medium border",
                remaining.type === 'ongoing' 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-blue-50 text-blue-700 border-blue-200"
              )}
            >
              {remaining.text}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4 px-1 flex items-center gap-2">
        <SearchInput
          param="planning_search"
          placeholder="Buscar empleado..."
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setSearch(null)
            onSelectRequest(null)
          }}
          title="Limpiar filtros y selección"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-4 p-1">
        {groupedRequests.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground text-sm border rounded-lg border-dashed">
            {search
              ? 'No se encontraron empleados.'
              : 'No hay vacaciones activas.'}
          </div>
        ) : (
          groupedRequests.map(({ empId, employee, requests: empRequests }) => {
            const isMultiple = empRequests.length > 1
            const isExpanded = expandedGroups[empId]
            const firstRequest = empRequests[0]
            
            // Verificar si alguna solicitud de este grupo está seleccionada
            const hasSelectedRequest = empRequests.some(r => selectedRequestIds.includes(r.id))

            return (
              <div
                key={empId}
                className={cn(
                  'rounded-lg border bg-card transition-all overflow-hidden shadow-sm',
                  hasSelectedRequest 
                    ? 'border-foreground ring-1 ring-foreground shadow-md' 
                    : 'hover:border-foreground/50 hover:shadow-md'
                )}
              >
                {/* Card Header / Main Action */}
                <div
                  className={cn(
                    'p-3 flex items-start gap-3 cursor-pointer select-none',
                    isMultiple && isExpanded ? 'bg-accent/50 border-b' : ''
                  )}
                  onClick={(e) => {
                    if (isMultiple) {
                      toggleGroup(empId)
                    } else {
                      onSelectRequest(firstRequest.id)
                    }
                  }}
                >
                  <Avatar className="h-10 w-10 border shrink-0 mt-1">
                    <AvatarImage src={employee?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {employee?.first_name?.[0]}
                      {employee?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">
                        {employee?.first_name} {employee?.last_name}
                      </span>
                    </div>
                    
                    {isMultiple ? (
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-xs text-foreground/90 h-3.5">
                          <Files className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="font-medium">Múltiples solicitudes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                            {empRequests.length} solicitudes
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            Ver detalles
                          </span>
                        </div>
                      </div>
                    ) : (
                      <RequestInfo request={firstRequest} />
                    )}
                  </div>

                  {isMultiple && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => toggleGroup(empId, e)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  
                   {/* Checkmark or indicator if single and selected */}
                   {!isMultiple && selectedRequestIds.includes(firstRequest.id) && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                   )}
                </div>

                {/* Dropdown Content for Multiple */}
                {isMultiple && isExpanded && (
                  <div className="bg-muted/30 divide-y">
                    {empRequests.map((req) => {
                      const isSelected = selectedRequestIds.includes(req.id)
                      return (
                        <div
                          key={req.id}
                          className={cn(
                            'p-2.5 pl-[3.25rem] text-sm cursor-pointer transition-colors hover:bg-accent flex items-center justify-between group',
                            isSelected ? 'bg-primary/5 text-primary' : ''
                          )}
                          onClick={() => onSelectRequest(req.id)}
                        >
                          <div className="flex flex-col gap-0.5 w-full">
                             <RequestInfo request={req} />
                          </div>
                           {isSelected && (
                              <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                           )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
