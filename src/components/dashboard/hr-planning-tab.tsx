import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'
import { usePlanningRequests } from '@/hooks/dashboard/use-planning-requests'
import { PlanningSidebar } from './planning-sidebar'
import { PlanningCalendar } from './planning-calendar'
import { useState } from 'react'

interface HrPlanningTabProps {
  requests: EnrichedVacationRequest[]
}

export function HrPlanningTab({ requests }: HrPlanningTabProps) {
  const { activeRequests } = usePlanningRequests(requests)
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([])

  const handleSelectRequest = (id: string | null) => {
    if (!id) {
      setSelectedRequestIds([])
      return
    }

    setSelectedRequestIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((prevId) => prevId !== id)
      }

      if (prev.length >= 3) {
        // Opción A: No permitir más de 3 (usuario debe deseleccionar)
        // return prev
        // Opción B: FIFO (reemplazar el más antiguo) - Más fluido
        return [...prev.slice(1), id]
      }

      return [...prev, id]
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Planificación de Ausencias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6 h-[850px]">
          {/* Zona izquierda: 25% */}
          <div className="lg:w-1/4 h-full lg:border-r lg:pr-4">
            <PlanningSidebar
              requests={activeRequests}
              selectedRequestIds={selectedRequestIds}
              onSelectRequest={handleSelectRequest}
            />
          </div>

          {/* Zona derecha: 75% */}
          <div className="lg:w-3/4 h-full overflow-hidden">
            <PlanningCalendar
              requests={activeRequests}
              selectedRequestIds={selectedRequestIds}
              onSelectRequest={handleSelectRequest}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
