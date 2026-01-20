import { EnrichedVacationRequest } from '@/hooks/dashboard/use-hr-selectors'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color: string
  original: EnrichedVacationRequest
}
