'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export default function useUser() {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession()
      return data.session?.user
    },
  })

  return userQuery
}
