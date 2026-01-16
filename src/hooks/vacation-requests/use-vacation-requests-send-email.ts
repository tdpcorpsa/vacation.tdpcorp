'use client'

import { sendRequestEmail } from '@/actions/vacation-requests/send-request-email'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVacationRequestsSendEmail = () => {
  return useMutation({
    mutationFn: async (requestId: string) => {
      return await sendRequestEmail(requestId)
    },
    onSuccess: () => {
      toast.success('Correo enviado exitosamente al jefe')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al enviar el correo')
    },
  })
}
