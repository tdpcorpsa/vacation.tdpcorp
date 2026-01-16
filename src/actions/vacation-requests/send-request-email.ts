'use server'

import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/supabase.types'
import nodemailer from 'nodemailer'

type VacationRequestWithEmployee = Tables<
  { schema: 'vacation' },
  'vacation_requests'
> & {
  employee: Tables<{ schema: 'vacation' }, 'employees'> | null
}

export async function sendRequestEmail(requestId: string) {
  const supabase = await createClient()

  // 1. Obtener la solicitud y el empleado
  const { data: request, error: requestError } = await supabase
    .schema('vacation')
    .from('vacation_requests')
    .select('*, employee:employees(*)')
    .eq('id', requestId)
    .single()

  if (requestError || !request) {
    throw new Error('No se pudo encontrar la solicitud')
  }

  // 2. Obtener el manager del empleado
  // Nota: request.employee es un array o un objeto dependiendo de la relación,
  // pero al usar select(*, employee:employees(*)) y ser FK, debería ser un objeto.
  // Sin embargo, typescript puede quejar. Lo trataremos con cuidado.
  // Mejor hacemos una consulta separada si es necesario, pero intentemos usar lo que tenemos.

  const typedRequest = request as VacationRequestWithEmployee
  const employee = typedRequest.employee

  if (!employee || !employee.manager_id) {
    throw new Error('El empleado no tiene un jefe asignado')
  }

  // 3. Obtener el email del manager
  const { data: managerProfile, error: managerError } = await supabase
    .from('users_view')
    .select('email, first_name, last_name')
    .eq('id', employee.manager_id)
    .single()

  if (managerError || !managerProfile || !managerProfile.email) {
    throw new Error('No se pudo obtener el email del jefe')
  }

  // 4. Obtener el perfil del empleado (para el nombre y email)
  const { data: employeeProfile, error: employeeProfileError } = await supabase
    .from('users_view')
    .select('email, first_name, last_name')
    .eq('id', employee.id)
    .single()

  if (employeeProfileError || !employeeProfile || !employeeProfile.email) {
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
    subject: `Solicitud de Vacaciones: ${employeeProfile.first_name} ${employeeProfile.last_name} (REQ: ${request.id}) (EMP: ${employee.id})`,
    text: `
      Solicitud de Vacaciones
      Estimado(a) ${managerProfile.first_name} ${managerProfile.last_name},

      El empleado ${employeeProfile.first_name} ${employeeProfile.last_name} con ID ${employee.id} ha solicitado vacaciones.

      Fecha Inicio: ${request.start_date}
      Fecha Fin: ${request.end_date}
      Días Totales: ${request.total_days}
      Nota: ${request.request_note || 'Ninguna'}

      Responda a este correo para aprobar o rechazar.
    `,
    html: `
      <h3>Solicitud de Vacaciones</h3>
      <p>Estimado(a) <strong>${managerProfile.first_name} ${managerProfile.last_name}</strong>,</p>
      
      <p>El empleado <strong>${employeeProfile.first_name} ${employeeProfile.last_name}</strong> con ID <strong>${employee.id}</strong> ha solicitado vacaciones.</p>
      
      <p>
        <strong>Fecha Inicio:</strong> ${request.start_date}<br/>
        <strong>Fecha Fin:</strong> ${request.end_date}<br/>
        <strong>Días Totales:</strong> ${request.total_days}<br/>
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
