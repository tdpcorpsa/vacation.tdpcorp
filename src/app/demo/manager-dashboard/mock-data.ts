import { Database } from '@/types/supabase.types'

type VacationPeriod = Database['vacation']['Tables']['vacation_periods']['Row']
type VacationRequest =
  Database['vacation']['Tables']['vacation_requests']['Row']

// Extended type for team requests
export type TeamVacationRequest = VacationRequest & {
  employee: {
    first_name: string
    last_name: string
    avatar_url?: string
    position: string
  }
}

export type TeamAbsence = {
  id: string
  employee: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
  start_date: string
  end_date: string
  total_days: number
  type: 'VACATION' | 'SICK_LEAVE' | 'OTHER' // For future extensibility, currently mostly vacation
}

export const mockPeriods: VacationPeriod[] = [
  {
    id: '1',
    employee_id: 'manager1',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    total_days: 30,
    available_days: 20,
    period_label: '2024',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    employee_id: 'manager1',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    total_days: 30,
    available_days: 0,
    period_label: '2023',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
]

export const mockRequests: VacationRequest[] = [
  {
    id: 'req1',
    employee_id: 'manager1',
    vacation_period_id: '1',
    start_date: '2024-05-01',
    end_date: '2024-05-10',
    total_days: 10,
    status: 'APPROVED',
    request_note: 'Vacaciones de verano',
    response_note: 'Aprobado',
    submitted_at: '2024-04-01T00:00:00Z',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
    created_by: 'manager1',
    decided_at: '2024-04-02T00:00:00Z',
    decided_by: 'director1',
  },
]

export const mockNextVacations = [
  {
    id: 'req1',
    start_date: '2024-05-01',
    end_date: '2024-05-10',
    total_days: 10,
  },
]

export const mockKPIs = {
  pending: 0,
  approved: 1,
  rejected: 0,
  lastRequest: '2024-04-01',
}

export const mockTeamRequests: TeamVacationRequest[] = [
  {
    id: 'team_req1',
    employee_id: 'emp2',
    vacation_period_id: 'p2_emp2',
    start_date: '2025-06-01',
    end_date: '2025-06-15',
    total_days: 15,
    status: 'PENDING',
    request_note: 'Viaje a Europa',
    response_note: null,
    submitted_at: '2025-05-01T10:00:00Z',
    created_at: '2025-05-01T10:00:00Z',
    updated_at: '2025-05-01T10:00:00Z',
    created_by: 'emp2',
    decided_at: null,
    decided_by: null,
    employee: {
      first_name: 'Ana',
      last_name: 'García',
      position: 'Desarrollador Senior',
    },
  },
  {
    id: 'team_req2',
    employee_id: 'emp3',
    vacation_period_id: 'p1_emp3',
    start_date: '2025-07-20',
    end_date: '2025-07-25',
    total_days: 5,
    status: 'PENDING',
    request_note: 'Asuntos personales',
    response_note: null,
    submitted_at: '2025-05-10T10:00:00Z',
    created_at: '2025-05-10T10:00:00Z',
    updated_at: '2025-05-10T10:00:00Z',
    created_by: 'emp3',
    decided_at: null,
    decided_by: null,
    employee: {
      first_name: 'Carlos',
      last_name: 'Mendoza',
      position: 'Analista QA',
    },
  },
  {
    id: 'team_req3',
    employee_id: 'emp4',
    vacation_period_id: 'p1_emp4',
    start_date: '2025-08-01',
    end_date: '2025-08-30',
    total_days: 30,
    status: 'PENDING',
    request_note: 'Luna de miel',
    response_note: null,
    submitted_at: '2025-04-20T10:00:00Z',
    created_at: '2025-04-20T10:00:00Z',
    updated_at: '2025-04-20T10:00:00Z',
    created_by: 'emp4',
    decided_at: null,
    decided_by: null,
    employee: {
      first_name: 'Diana',
      last_name: 'Torres',
      position: 'Diseñadora UX',
    },
  },
  {
    id: 'team_req4',
    employee_id: 'emp5',
    vacation_period_id: 'p1_emp5',
    start_date: '2025-07-20',
    end_date: '2025-07-25',
    total_days: 5,
    status: 'PENDING',
    request_note: 'Asuntos personales',
    response_note: null,
    submitted_at: '2025-05-10T10:00:00Z',
    created_at: '2025-05-10T10:00:00Z',
    updated_at: '2025-05-10T10:00:00Z',
    created_by: 'emp5',
    decided_at: null,
    decided_by: null,
    employee: {
      first_name: 'Carlos',
      last_name: 'Mendoza',
      position: 'Analista QA',
    },
  },
  {
    id: 'team_req5',
    employee_id: 'emp6',
    vacation_period_id: 'p1_emp6',
    start_date: '2025-07-20',
    end_date: '2025-07-25',
    total_days: 5,
    status: 'PENDING',
    request_note: 'Asuntos personales',
    response_note: null,
    submitted_at: '2025-05-10T10:00:00Z',
    created_at: '2025-05-10T10:00:00Z',
    updated_at: '2025-05-10T10:00:00Z',
    created_by: 'emp6',
    decided_at: null,
    decided_by: null,
    employee: {
      first_name: 'Carlos',
      last_name: 'Mendoza',
      position: 'Analista QA',
    },
  },
]

export const mockTeamAbsences: TeamAbsence[] = [
  {
    id: 'abs1',
    employee: {
      first_name: 'Pedro',
      last_name: 'Sánchez',
    },
    start_date: '2025-05-20',
    end_date: '2025-05-25',
    total_days: 5,
    type: 'VACATION',
  },
  {
    id: 'abs2',
    employee: {
      first_name: 'Lucía',
      last_name: 'Fernández',
    },
    start_date: '2025-06-01',
    end_date: '2025-06-03',
    total_days: 3,
    type: 'SICK_LEAVE',
  },
]
