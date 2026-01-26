import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
  // Ordenar por nombre alfabéticamente
  const sortedRequests = [...requests].sort((a, b) => {
    const nameA = `${a.employeeProfile?.first_name || ''} ${a.employeeProfile?.last_name || ''}`.toLowerCase()
    const nameB = `${b.employeeProfile?.first_name || ''} ${b.employeeProfile?.last_name || ''}`.toLowerCase()
    return nameA.localeCompare(nameB)
  })

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar">
      {sortedRequests.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground text-sm">
          No hay vacaciones activas para mostrar.
        </div>
      ) : (
        sortedRequests.map((req) => (
          <div
            key={req.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
              selectedRequestIds.includes(req.id)
                ? 'bg-primary/10 border-primary'
                : 'bg-card hover:bg-accent/50 border-transparent hover:border-border'
            )}
            onClick={() => onSelectRequest(req.id)}
          >
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={req.employeeProfile?.avatar_url || undefined} />
              <AvatarFallback>
                {req.employeeProfile?.first_name?.[0]}
                {req.employeeProfile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-sm truncate">
                {req.employeeProfile?.first_name} {req.employeeProfile?.last_name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {format(new Date(req.start_date), 'd MMM', { locale: es })} -{' '}
                {format(new Date(req.end_date), 'd MMM', { locale: es })}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">
                {req.total_days} días
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
