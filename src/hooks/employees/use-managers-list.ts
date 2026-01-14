import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'

type Employee = Tables<{ schema: 'vacation' }, 'employees'>
type UserView = Tables<'users_view'>

export type Manager = Employee & { user?: UserView }

export function useManagersList() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['managers'],
    queryFn: async (): Promise<Manager[]> => {
      const { data: employees, error } = await supabase
        .schema('vacation')
        .from('employees')
        .select('*')

      if (error) throw new Error(error.message)
      if (!employees || employees.length === 0) return []

      const ids = employees.map((e) => e.id)
      const { data: users } = await supabase
        .from('users_view')
        .select('*')
        .in('id', ids)

      return employees.map((e) => ({
        ...e,
        user: users?.find((u) => u.id === e.id),
      }))
    },
  })
}
