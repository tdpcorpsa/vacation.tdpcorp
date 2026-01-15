import { Database } from '@/types/supabase.types'

// ------------------------------------------------------------------
// TYPES (Based on Schema + Joins)
// ------------------------------------------------------------------

type EmployeeRow = Database['vacation']['Tables']['employees']['Row']
type VacationRequestRow =
  Database['vacation']['Tables']['vacation_requests']['Row']
type VacationPeriodRow =
  Database['vacation']['Tables']['vacation_periods']['Row']
type LaborRegimeRow = Database['vacation']['Tables']['labor_regime']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type HRLaborRegime = LaborRegimeRow

export type HREmployee = EmployeeRow & {
  profile: ProfileRow
  manager?: {
    id: string
    profile: ProfileRow
  }
  labor_regime: HRLaborRegime
}

export type HRVacationPeriod = VacationPeriodRow & {
  employee: HREmployee
}

export type HRVacationRequest = VacationRequestRow & {
  employee: HREmployee
  created_by_user?: ProfileRow
  decided_by_user?: ProfileRow
  vacation_period: VacationPeriodRow
}

// ------------------------------------------------------------------
// GENERATORS & MOCK DATA
// ------------------------------------------------------------------

const firstNames = [
  'Ana',
  'Carlos',
  'Elena',
  'David',
  'Sofia',
  'Miguel',
  'Lucia',
  'Jorge',
  'Maria',
  'Pedro',
  'Laura',
  'Daniel',
  'Carmen',
  'Pablo',
  'Isabel',
  'Raul',
  'Patricia',
  'Fernando',
  'Rosa',
  'Luis',
]
const lastNames = [
  'Garcia',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Perez',
  'Sanchez',
  'Ramirez',
  'Torres',
  'Flores',
  'Rivera',
  'Gomez',
  'Diaz',
  'Reyes',
  'Morales',
  'Ortiz',
  'Castillo',
  'Chavez',
  'Vasquez',
]
const domains = ['tdpcorp.com', 'example.com']

// 1. REGIMES
export const mockRegimes: HRLaborRegime[] = [
  {
    id: 'regime_general',
    name: 'General (30 días)',
    is_active: true,
    policies: { base_days: 30, max_accumulation: 60 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'regime_mype',
    name: 'MYPE (15 días)',
    is_active: true,
    policies: { base_days: 15, max_accumulation: 30 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'regime_parttime',
    name: 'Part-Time (6 días)',
    is_active: true,
    policies: { base_days: 6, max_accumulation: 12 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// 2. PROFILES & EMPLOYEES
const generateEmployees = (count: number): HREmployee[] => {
  const employees: HREmployee[] = []

  for (let i = 0; i < count; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)]
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)]
    const domain = domains[0]
    const id = `emp_${i + 1}`

    // Assign random manager from existing employees (if any), else null (CEO)
    // To ensure no circular dependency in this simple mock, we pick from already created
    const manager =
      i > 0 && Math.random() > 0.1
        ? employees[Math.floor(Math.random() * Math.min(i, 5))] // Pick from top 5 created
        : undefined

    const regime =
      mockRegimes[Math.floor(Math.random() * mockRegimes.length)]

    const profile: ProfileRow = {
      id: `user_${id}`,
      first_name: fn,
      last_name: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`,
      phone: `+51 9${Math.floor(Math.random() * 90000000 + 10000000)}`,
      avatar_url: null,
      address: null,
      birth_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_superuser: false,
    }

    employees.push({
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      hire_date: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        1
      ).toISOString(),
      labor_regime_id: regime.id,
      manager_id: manager ? manager.id : null,
      profile,
      manager: manager
        ? { id: manager.id, profile: manager.profile }
        : undefined,
      labor_regime: regime,
    })
  }
  return employees
}

export const mockHREmployees = generateEmployees(50)

// 3. PERIODS
const generatePeriods = (employees: HREmployee[]): HRVacationPeriod[] => {
  const periods: HRVacationPeriod[] = []
  employees.forEach((emp) => {
    // Generate 1 or 2 periods per employee
    const baseDays = (emp.labor_regime.policies as any).base_days || 30
    const count = Math.random() > 0.5 ? 2 : 1

    for (let i = 0; i < count; i++) {
      const year = 2026 + i
      const total = baseDays
      const used = Math.floor(Math.random() * total)
      periods.push({
        id: `period_${emp.id}_${year}`,
        employee_id: emp.id,
        period_label: `${year} - ${year + 1}`,
        start_date: `${year}-01-01`,
        end_date: `${year + 1}-01-01`,
        total_days: total,
        available_days: total - used,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        employee: emp,
      })
    }
  })
  return periods
}

export const mockHRPeriods = generatePeriods(mockHREmployees)

// 4. REQUESTS
const generateRequests = (
  employees: HREmployee[],
  periods: HRVacationPeriod[],
  count: number
): HRVacationRequest[] => {
  const requests: HRVacationRequest[] = []

  for (let i = 0; i < count; i++) {
    const emp = employees[Math.floor(Math.random() * employees.length)]
    // Find a period for this employee
    const period =
      periods.find((p) => p.employee_id === emp.id) || periods[0]

    const statusOptions: ('PENDING' | 'APPROVED' | 'REJECTED')[] = [
      'PENDING',
      'APPROVED',
      'REJECTED',
    ]
    const status =
      statusOptions[Math.floor(Math.random() * statusOptions.length)]

    const startMonth = Math.floor(Math.random() * 12)
    const startDay = Math.floor(Math.random() * 25) + 1
    const duration = Math.floor(Math.random() * 10) + 1
    const startDate = new Date(2026, startMonth, startDay)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + duration)

    const submittedDate = new Date(startDate)
    submittedDate.setDate(submittedDate.getDate() - 15) // Submitted 15 days before

    // Created by: 80% employee, 20% HR (simulated by random user)
    const createdBy =
      Math.random() > 0.2
        ? emp.profile
        : employees[Math.floor(Math.random() * employees.length)].profile

    // Decided by: Manager or HR
    const decidedBy =
      status !== 'PENDING'
        ? emp.manager?.profile ||
          employees[Math.floor(Math.random() * employees.length)].profile
        : undefined

    const decidedAt =
      status !== 'PENDING'
        ? new Date(
            submittedDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
          ).toISOString()
        : null

    requests.push({
      id: `req_${i + 1}`,
      employee_id: emp.id,
      vacation_period_id: period.id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_days: duration,
      status,
      request_note: Math.random() > 0.7 ? 'Solicitud de vacaciones' : null,
      response_note:
        status === 'REJECTED'
          ? 'No es posible en estas fechas por carga laboral.'
          : null,
      submitted_at: submittedDate.toISOString(),
      created_at: submittedDate.toISOString(),
      updated_at: decidedAt || submittedDate.toISOString(),
      created_by: createdBy.id, // ID string
      decided_by: decidedBy?.id || null, // ID string
      decided_at: decidedAt,
      employee: emp,
      created_by_user: createdBy, // Full object
      decided_by_user: decidedBy, // Full object
      vacation_period: period,
    })
  }

  return requests.sort(
    (a, b) =>
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  )
}

export const mockHRRequests = generateRequests(
  mockHREmployees,
  mockHRPeriods,
  150
)

// ------------------------------------------------------------------
// KPI CALCULATIONS
// ------------------------------------------------------------------

export const getAvgDecisionTime = (requests: HRVacationRequest[]) => {
  const decided = requests.filter(
    (r) => r.decided_at && r.submitted_at
  )
  if (decided.length === 0) return 0
  const totalHours = decided.reduce((acc, r) => {
    const start = new Date(r.submitted_at).getTime()
    const end = new Date(r.decided_at!).getTime()
    return acc + (end - start) / (1000 * 60 * 60)
  }, 0)
  return Math.round(totalHours / decided.length)
}

export const getBacklogCount = (requests: HRVacationRequest[], days: number) => {
  const now = new Date() // Current date simulation
  return requests.filter((r) => {
    if (r.status !== 'PENDING') return false
    const submitted = new Date(r.submitted_at)
    const diffTime = Math.abs(now.getTime() - submitted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > days
  }).length
}

export const mockHRKPIs = {
  totalEmployees: mockHREmployees.length,
  totalRequests: mockHRRequests.length,
  pendingRequests: mockHRRequests.filter((r) => r.status === 'PENDING').length,
  approvedRequests: mockHRRequests.filter((r) => r.status === 'APPROVED')
    .length,
  rejectedRequests: mockHRRequests.filter((r) => r.status === 'REJECTED')
    .length,
  avgDecisionTimeHours: getAvgDecisionTime(mockHRRequests),
  backlogOldPending: getBacklogCount(mockHRRequests, 7), // Older than 7 days
}
