'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database, Tables } from '@/types/supabase.types'
import { eachDayOfInterval, format, isSaturday, isSunday } from 'date-fns'
import { es } from 'date-fns/locale'
import nodemailer from 'nodemailer'

type VacationRequestWithDetails = Tables<
  { schema: 'vacation' },
  'vacation_requests'
> & {
  employee: Tables<{ schema: 'vacation' }, 'employees'> | null
  vacation_period: Tables<{ schema: 'vacation' }, 'vacation_periods'> | null
}

export async function sendRequestEmail(requestId: string) {
  const supabase = await createClient()

  // Inicializar cliente admin para consultas de sistema (emails)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  let supabaseAdmin = null
  if (serviceRoleKey && supabaseUrl) {
    supabaseAdmin = createSupabaseClient<Database>(supabaseUrl, serviceRoleKey)
  }
  
  // Usar cliente admin si está disponible para asegurar acceso a datos de usuario,
  // sino fallback al cliente de sesión
  const systemClient = supabaseAdmin || supabase

  // 1. Obtener la solicitud, el empleado y el periodo
  const { data: request, error: requestError } = await supabase
    .schema('vacation')
    .from('vacation_requests')
    .select('*, employee:employees(*), vacation_period:vacation_periods(*)')
    .eq('id', requestId)
    .single()

  if (requestError || !request) {
    throw new Error('No se pudo encontrar la solicitud')
  }

  const typedRequest = request as VacationRequestWithDetails
  const employee = typedRequest.employee
  const vacationPeriod = typedRequest.vacation_period

  if (!employee || !employee.manager_id) {
    throw new Error('El empleado no tiene un jefe asignado')
  }

  // 2. Calcular días de fin de semana
  // Aseguramos que las fechas se interpreten correctamente agregando la hora para evitar desfases de zona horaria al iniciar el día
  const startDate = new Date(`${request.start_date}T00:00:00`)
  const endDate = new Date(`${request.end_date}T00:00:00`)
  
  const daysInterval = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const weekendDays = daysInterval.filter(
    (day) => isSaturday(day) || isSunday(day)
  ).length

  const formattedStartDate = format(startDate, "d 'de' MMMM, yyyy", {
    locale: es,
  })
  const formattedEndDate = format(endDate, "d 'de' MMMM, yyyy", { locale: es })

  // 3. Obtener el email del manager
  const { data: managerProfile, error: managerError } = await systemClient
    .from('users_view')
    .select('email, first_name, last_name')
    .eq('id', employee.manager_id)
    .single()

  if (managerError || !managerProfile || !managerProfile.email) {
    console.error('Error fetching manager email:', managerError)
    throw new Error('No se pudo obtener el email del jefe')
  }

  // 4. Obtener el perfil del empleado (para el nombre y email)
  const { data: employeeProfile, error: employeeProfileError } = await systemClient
    .from('users_view')
    .select('email, first_name, last_name')
    .eq('id', employee.id)
    .single()

  if (employeeProfileError || !employeeProfile || !employeeProfile.email) {
    console.error('Error fetching employee email:', employeeProfileError)
    throw new Error('No se pudo obtener el email del empleado')
  }

  // 5. Configurar transporte SMTP (Outlook)
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER || 'sahid.vilic@tdpcorp.com.pe',
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  })

  // 6. Enviar correo
  const mailOptions = {
    from: process.env.SMTP_USER || 'sahid.vilic@tdpcorp.com.pe',
    to: managerProfile.email,
    cc: employeeProfile.email,
    subject: `Solicitud de Vacaciones: ${employeeProfile.first_name} ${employeeProfile.last_name} (REQ: ${request.id})`,
    text: `
      Solicitud de Vacaciones
      Estimado(a) ${managerProfile.first_name} ${managerProfile.last_name},

      El empleado ${employeeProfile.first_name} ${employeeProfile.last_name} ha solicitado vacaciones.

      Periodo: ${vacationPeriod?.period_label || 'No especificado'}
      ID del Empleado: ${employee.id}
      Desde: ${formattedStartDate}
      Hasta: ${formattedEndDate}
      Total de días: ${request.total_days}
      Días de fin de semana (Sáb/Dom): ${weekendDays}
      Nota: ${request.request_note || 'Ninguna'}

      Responda a este correo para aprobar o rechazar.
    `,
    html: `
      <h3>Solicitud de Vacaciones</h3>
      <p>Estimado(a) <strong>${managerProfile.first_name} ${managerProfile.last_name}</strong>,</p>
      
      <p>El empleado <strong>${employeeProfile.first_name} ${employeeProfile.last_name}</strong> ha solicitado vacaciones.</p>
      
      <p>
        <strong>Periodo:</strong> ${vacationPeriod?.period_label || 'No especificado'}<br/>
        <strong>ID del Empleado:</strong> ${employee.id}<br/>
        <strong>Desde:</strong> ${formattedStartDate}<br/>
        <strong>Hasta:</strong> ${formattedEndDate}<br/>
        <strong>Total de días:</strong> ${request.total_days}<br/>
        <strong>Días de fin de semana (Sáb/Dom):</strong> ${weekendDays}<br/>
        <strong>Nota:</strong> ${request.request_note || 'Ninguna'}
      </p>
      
      <p><strong>Responda a este correo para aprobar o rechazar.</strong></p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error enviando email:', error)
    throw new Error('Falló el envío del correo electrónico')
  }
}
