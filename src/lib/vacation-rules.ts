import { Database } from '@/types/supabase.types'
import { SupabaseClient } from '@supabase/supabase-js'
import { eachDayOfInterval, isSaturday, isSunday } from 'date-fns'

type VacationRequest = {
  start_date: string
  end_date: string
  total_days: number
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
}

export async function validateVacationRules(
  supabase: SupabaseClient<Database>,
  request: {
    vacation_period_id: string
    start_date: string
    end_date: string
    total_days: number
    employee_id?: string // Optional because in create/update it might not be in the form data but derived
  },
  currentRequestId?: string
) {
  // 1. Obtener el periodo vacacional para saber el total de días
  const { data: period, error: periodError } = await supabase
    .schema('vacation')
    .from('vacation_periods')
    .select('total_days')
    .eq('id', request.vacation_period_id)
    .single()

  if (periodError || !period) {
    throw new Error('No se pudo obtener el periodo vacacional')
  }

  // 2. Obtener TODAS las solicitudes existentes del periodo (excepto REJECTED) para validar solapamiento
  const { data: allExistingRequests, error: allRequestsError } = await supabase
    .schema('vacation')
    .from('vacation_requests')
    .select('start_date, end_date, total_days, status, id')
    .eq('vacation_period_id', request.vacation_period_id)
    .neq('status', 'REJECTED')

  if (allRequestsError) {
    throw new Error('Error al verificar reglas de vacaciones')
  }

  // Filtrar la solicitud actual
  const relevantRequests = allExistingRequests.filter((r) => r.id !== currentRequestId)

  // --- Regla 0: Validar Solapamiento de Fechas ---
  const requestStart = new Date(`${request.start_date}T00:00:00`).getTime()
  const requestEnd = new Date(`${request.end_date}T00:00:00`).getTime()

  for (const existing of relevantRequests) {
    const existingStart = new Date(`${existing.start_date}T00:00:00`).getTime()
    const existingEnd = new Date(`${existing.end_date}T00:00:00`).getTime()

    // Verificar si hay intersección de rangos
    if (
      (requestStart >= existingStart && requestStart <= existingEnd) || // Inicio dentro de rango existente
      (requestEnd >= existingStart && requestEnd <= existingEnd) ||     // Fin dentro de rango existente
      (requestStart <= existingStart && requestEnd >= existingEnd)      // Rango existente dentro de nuevo rango
    ) {
      throw new Error(
        `Ya existe una solicitud de vacaciones en el rango seleccionado (${existing.start_date} al ${existing.end_date}).`
      )
    }
  }

  // Filtrar solo APPROVED para las reglas de negocio de Perú
  const approvedRequests = relevantRequests.filter(r => r.status === 'APPROVED')

  // --- Regla 1: Primera etapa (Vacaciones Largas) ---
  // Verificar si ya existe algún bloque de >= 7 días
  const hasLongVacation = approvedRequests.some((r) => r.total_days >= 7)

  if (!hasLongVacation) {
    // Si no hay vacaciones largas previas, esta solicitud DEBE ser >= 7 días
    if (request.total_days < 7) {
      throw new Error(
        'Primera etapa: Debes tomar un primer bloque de vacaciones de al menos 7 días (vacaciones largas) antes de solicitar días sueltos.'
      )
    }
    
    // Validar que incluya fin de semana (implícito en 7 días, pero por si acaso)
    // "Condición clave: Siempre deben incluir fines de semana"
    const hasWeekend = checkHasWeekend(request.start_date, request.end_date)
    if (!hasWeekend) {
        throw new Error('Primera etapa: Las vacaciones largas deben incluir fines de semana.')
    }
  }

  // --- Regla 2: Segunda etapa (Control de Fines de Semana) ---
  // "Deben respetarse 4 fines de semana dentro del periodo vacacional"
  
  // Calcular días hábiles consumidos en solicitudes anteriores
  const previousWorkdays = approvedRequests.reduce((acc, r) => {
    return acc + calculateWorkdays(r.start_date, r.end_date)
  }, 0)

  // Calcular días hábiles de la solicitud actual
  const currentWorkdays = calculateWorkdays(request.start_date, request.end_date)

  const totalWorkdays = previousWorkdays + currentWorkdays
  
  // Calcular límite de días hábiles permitidos en el periodo
  // Lógica: Total Días - (4 fines de semana * 2 días) = Total Días - 8
  // Si el periodo es menor a 30 días, ajustamos proporcionalmente: Math.floor(TotalDays / 7) * 2
  const minWeekendDays = Math.floor(period.total_days / 7) * 2
  const maxWorkdays = period.total_days - minWeekendDays

  if (totalWorkdays > maxWorkdays) {
    throw new Error(
      `Segunda etapa: Has excedido el límite de días hábiles (${maxWorkdays}). Debes incluir más fines de semana en tus solicitudes para cumplir con la regla de ${minWeekendDays / 2} fines de semana por periodo.`
    )
  }
}

function calculateWorkdays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  
  const days = eachDayOfInterval({ start, end })
  return days.filter((d) => !isSaturday(d) && !isSunday(d)).length
}

function checkHasWeekend(startDate: string, endDate: string): boolean {
    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T00:00:00`)
    
    const days = eachDayOfInterval({ start, end })
    return days.some((d) => isSaturday(d) || isSunday(d))
}
