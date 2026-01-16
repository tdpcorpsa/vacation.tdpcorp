import { Database } from '@/types/supabase.types'

type VacationPeriod = Database['vacation']['Tables']['vacation_periods']['Row']
type VacationRequest =
  Database['vacation']['Tables']['vacation_requests']['Row']
type EmployeeRow = Database['vacation']['Tables']['employees']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type LaborRegimeRow = Database['vacation']['Tables']['labor_regime']['Row']

export type EmployeeSummary = {
  employee: EmployeeRow
  profile: ProfileRow
  laborRegime: LaborRegimeRow
  managerProfile: ProfileRow | null
  roleDescription: string
}

export const mockEmployeeSummary: EmployeeSummary = {
  employee: {
    id: 'emp1',
    labor_regime_id: 'reg1',
    manager_id: 'manager1',
    hire_date: '2020-03-15',
    created_at: '2020-03-15T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  profile: {
    id: 'emp1',
    first_name: 'David',
    last_name: 'Pachas',
    email: 'david.pachas@tdpcorp.com',
    phone: '+51 999 999 999',
    address: 'Lima, Perú',
    avatar_url: null,
    birth_date: '1990-05-10',
    is_superuser: false,
    created_at: '2020-03-15T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  laborRegime: {
    id: 'reg1',
    name: 'Régimen General 30 días',
    is_active: true,
    policies: null,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  managerProfile: {
    id: 'manager1',
    first_name: 'Ana',
    last_name: 'García',
    email: 'ana.garcia@tdpcorp.com',
    phone: '+51 988 888 888',
    address: 'Lima, Perú',
    avatar_url: null,
    birth_date: '1985-02-20',
    is_superuser: false,
    created_at: '2018-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  roleDescription: 'Desarrollador Senior Backend',
}

export const mockPeriods: VacationPeriod[] = [
  {
    id: '1',
    employee_id: 'emp1',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    total_days: 30,
    available_days: 15,
    period_label: '2024',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    employee_id: 'emp1',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    total_days: 30,
    available_days: 0,
    period_label: '2023',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    employee_id: 'emp1',
    start_date: '2022-01-01',
    end_date: '2022-12-31',
    total_days: 30,
    available_days: 0,
    period_label: '2022',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z',
  },
]

const baseRequests: VacationRequest[] = [
  {
    id: 'req1',
    employee_id: 'emp1',
    vacation_period_id: '1',
    start_date: '2024-05-01',
    end_date: '2024-05-15',
    total_days: 15,
    status: 'APPROVED',
    request_note: 'Vacaciones de verano',
    response_note: 'Aprobado',
    submitted_at: '2024-04-01T00:00:00Z',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
    created_by: 'emp1',
    decided_at: '2024-04-02T00:00:00Z',
    decided_by: 'manager1',
  },
  {
    id: 'req2',
    employee_id: 'emp1',
    vacation_period_id: '1',
    start_date: '2024-08-01',
    end_date: '2024-08-05',
    total_days: 5,
    status: 'PENDING',
    request_note: 'Semana santa',
    response_note: null,
    submitted_at: '2024-07-01T00:00:00Z',
    created_at: '2024-07-01T00:00:00Z',
    updated_at: '2024-07-01T00:00:00Z',
    created_by: 'emp1',
    decided_at: null,
    decided_by: null,
  },
  {
    id: 'req3',
    employee_id: 'emp1',
    vacation_period_id: '1',
    start_date: '2024-12-20',
    end_date: '2024-12-31',
    total_days: 12,
    status: 'REJECTED',
    request_note: 'Navidad',
    response_note: 'Se requiere personal en esas fechas',
    submitted_at: '2024-11-01T00:00:00Z',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
    created_by: 'emp1',
    decided_at: '2024-11-02T00:00:00Z',
    decided_by: 'manager1',
  },
  {
    id: 'req4',
    employee_id: 'emp1',
    vacation_period_id: '1',
    start_date: '2024-02-01',
    end_date: '2024-02-03',
    total_days: 3,
    status: 'APPROVED',
    request_note: 'Trámites personales',
    response_note: 'Ok',
    submitted_at: '2024-01-10T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    created_by: 'emp1',
    decided_at: '2024-01-11T00:00:00Z',
    decided_by: 'manager1',
  },
  {
    id: 'req5',
    employee_id: 'emp1',
    vacation_period_id: '1',
    start_date: '2024-06-15',
    end_date: '2024-06-20',
    total_days: 5,
    status: 'PENDING',
    request_note: 'Viaje familiar',
    response_note: null,
    submitted_at: '2024-05-20T00:00:00Z',
    created_at: '2024-05-20T00:00:00Z',
    updated_at: '2024-05-20T00:00:00Z',
    created_by: 'emp1',
    decided_at: null,
    decided_by: null,
  },
  {
    id: 'req6',
    employee_id: 'emp1',
    vacation_period_id: '1',
    start_date: '2024-09-10',
    end_date: '2024-09-12',
    total_days: 2,
    status: 'APPROVED',
    request_note: 'Descanso médico (regularización)',
    response_note: 'Aprobado',
    submitted_at: '2024-09-13T00:00:00Z',
    created_at: '2024-09-13T00:00:00Z',
    updated_at: '2024-09-13T00:00:00Z',
    created_by: 'emp1',
    decided_at: '2024-09-14T00:00:00Z',
    decided_by: 'manager1',
  },
  {
    id: 'req7',
    employee_id: 'emp1',
    vacation_period_id: '1',
    start_date: '2024-10-30',
    end_date: '2024-11-02',
    total_days: 4,
    status: 'REJECTED',
    request_note: 'Halloween',
    response_note: 'Alta carga laboral',
    submitted_at: '2024-10-01T00:00:00Z',
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
    created_by: 'emp1',
    decided_at: '2024-10-02T00:00:00Z',
    decided_by: 'manager1',
  },
]

function generateExtraRequests(count: number): VacationRequest[] {
  const today = new Date()

  return Array.from({ length: count }).map((_, index) => {
    const baseId = 8 + index
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + (index + 1) * 5)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 2)

    const submitted = new Date(today)
    submitted.setDate(today.getDate() - (index + 1) * 3)

    const created = new Date(submitted)
    const updated = new Date(created)
    updated.setDate(created.getDate() + 1)

    const statuses: VacationRequest['status'][] = [
      'PENDING',
      'APPROVED',
      'REJECTED',
    ]
    const status = statuses[index % statuses.length]

    const decidedAt =
      status === 'PENDING' ? null : new Date(updated).toISOString()

    const decidedBy = status === 'PENDING' ? null : 'manager1'

    return {
      id: `req${baseId}`,
      employee_id: 'emp1',
      vacation_period_id: baseId % 2 === 0 ? '1' : '2',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_days: 3,
      status,
      request_note:
        'Solicitud generada para pruebas de paginación y ordenamiento',
      response_note:
        status === 'APPROVED'
          ? 'Aprobado automáticamente para demo'
          : status === 'REJECTED'
            ? 'Rechazado automáticamente para demo'
            : null,
      submitted_at: submitted.toISOString(),
      created_at: created.toISOString(),
      updated_at: updated.toISOString(),
      created_by: 'emp1',
      decided_at: decidedAt,
      decided_by: decidedBy,
    }
  })
}

export const mockRequests: VacationRequest[] = [
  ...baseRequests,
  ...generateExtraRequests(12),
]

export const mockNextVacations = [
  {
    id: 'req1',
    start_date: '2024-05-01',
    end_date: '2024-05-15',
    total_days: 15,
  },
]

export const mockKPIs = {
  pending: 2,
  approved: 3,
  rejected: 2,
  lastRequest: '2024-07-01',
}
