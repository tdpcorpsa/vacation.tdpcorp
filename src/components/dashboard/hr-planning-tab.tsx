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
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Planificación de Ausencias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6 h-[850px]">
          {/* Zona izquierda: 25% */}
          <div className="lg:w-1/4 h-full lg:border-r lg:pr-4 overflow-hidden">
            <PlanningSidebar
              requests={activeRequests}
              selectedRequestId={selectedRequestId}
              onSelectRequest={setSelectedRequestId}
            />
          </div>

          {/* Zona derecha: 75% */}
          <div className="lg:w-3/4 h-full overflow-hidden">
            <PlanningCalendar
              requests={activeRequests}
              selectedRequestId={selectedRequestId}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
