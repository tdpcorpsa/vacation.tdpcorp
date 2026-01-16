import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'

type UserView = Tables<'users_view'>

export function usePotentialEmployees() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['potential_employees'],
    queryFn: async (): Promise<UserView[]> => {
      // Get existing employee IDs
      const { data: employees, error: empError } = await supabase
        .schema('vacation')
        .from('employees')
        .select('id')

      if (empError) throw new Error(empError.message)

      const existingIds = employees?.map((e) => e.id) || []

      let query = supabase.from('users_view').select('*')

      if (existingIds.length > 0) {
        query = query.not(
          'id',
          'in',
          `(${existingIds.map((id) => `"${id}"`).join(',')})`
        )
      }

      const { data, error } = await query.order('first_name')

      if (error) throw new Error(error.message)
      return data || []
    },
  })
}
