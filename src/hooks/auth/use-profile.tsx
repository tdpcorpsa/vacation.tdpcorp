'use client'

import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { useQuery } from '@tanstack/react-query'
import useUser from './use-user'

type UserView = Tables<'users_view'> & {
  roles: {
    name: Tables<'roles'>['name']
    description?: Tables<'roles'>['description']
    app_perms?: Tables<'role_app_perms'> &
      {
        app_id: Tables<'apps'>['id']
        subdomain: Tables<'apps'>['subdomain']
        perms: Tables<'role_app_perms'>['perms']
      }[]
  }[]
}

export default function useProfile() {
  const { data: user } = useUser()
  const query = useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserView> => {
      if (!user?.id) {
        throw new Error('User not found')
      }
      const { data, error } = await supabase
        .from('users_view')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error

      console.log('useProfile data:', data)

      return data as UserView
    },
  })
  return query
}
