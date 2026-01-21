import { useMemo } from 'react'
import { EnrichedVacationRequest } from './use-hr-selectors'

export function usePlanningRequests(requests: EnrichedVacationRequest[]) {
  const activeRequests = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return requests
      .filter((req) => {
        // Filter only approved requests
        if (req.status !== 'APPROVED') return false

        // Parse dates
        const endDate = new Date(req.end_date)
        endDate.setHours(0, 0, 0, 0)

        // Keep requests that haven't ended yet (or ended today)
        // "involucrando desde que se aprobaron hasta que se culmine el periodo de vacaciones"
        // This suggests we want to see them while they are relevant (future or current)
        return endDate >= today
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
  }, [requests])

  return { activeRequests }
}
