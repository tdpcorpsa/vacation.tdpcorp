import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { applySupabasePagination } from '@/components/ui/pagination-group'

type Employee = Tables<{ schema: 'vacation' }, 'employees'>
type UserView = Tables<'users_view'>

export type EmployeeWithUser = Employee & {
  user?: UserView
}

export function useEmployeesList({
  pagination,
  search,
}: {
  pagination?: { page: number; pageSize: number }
  search?: string
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['employees', pagination, search],
    queryFn: async (): Promise<{
      data: EmployeeWithUser[]
      total: number
      pagination?: { page: number; pageSize: number }
    }> => {
      let query = supabase
        .schema('vacation')
        .from('employees')
        .select('*', { count: 'exact' })

      if (search) {
        const { data: users } = await supabase
          .from('users_view')
          .select('id')
          .or(
            `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
          )

        if (users && users.length > 0) {
          const userIds = users.map((u) => u.id!)
          query = query.in('id', userIds)
        } else {
          // If no users found matching search, return empty
          return { data: [], total: 0, pagination }
        }
      }

      query = applySupabasePagination(query, pagination)

      const { data: employees, error, count } = await query
      if (error) throw new Error(error.message)

      if (!employees || employees.length === 0) {
        return { data: [], total: count || 0, pagination }
      }

      const employeeIds = employees.map((e) => e.id)
      const { data: users } = await supabase
        .from('users_view')
        .select('*')
        .in('id', employeeIds)

      const data = employees.map((e) => ({
        ...e,
        user: users?.find((u) => u.id === e.id),
      }))

      return { data, total: count || 0, pagination }
    },
  })
}
