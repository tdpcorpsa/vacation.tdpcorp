'use client'

import { supabase } from '@/lib/supabase/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const loginUrl = process.env.NEXT_PUBLIC_LOGIN || '/dev-login'

export default function useLogout() {
  const router = useRouter()
  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    },
    onSuccess: () => {
      toast.success('Sesión cerrada exitosamente')
      router.push(loginUrl)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return logoutMutation
}
