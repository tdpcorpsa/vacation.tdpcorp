import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export const useGetAppBySubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['app', subdomain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (error) {
        throw error
      }

      return data
    },
    enabled: !!subdomain,
    retry: false,
  })
}
